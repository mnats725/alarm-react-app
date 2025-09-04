import { useEffect, useRef } from 'react';

import { useAlarmStore } from '@/store/alarm-store';
import { selectAlarms } from '@/store/alarm-selectors';
import { getMinuteKey, isAlarmDueNow } from '@/utils/alarm.utils';
import { requestNotificationPermission, showAlarmNotification } from '@/utils/notification.utils';
import { playBeep } from '@/utils/sound.utils';

type TriggerMap = Map<string, string>;

export const AlarmRunner = (): null => {
  const alarms = useAlarmStore(selectAlarms);

  const lastMinuteKeyRef = useRef<string | null>(null);
  const triggeredMapRef = useRef<TriggerMap>(new Map());

  useEffect(() => {
    let isMounted = true;

    const tick = (): void => {
      if (!isMounted) {
        return;
      }

      const now = new Date();
      const minuteKey = getMinuteKey(now);

      if (lastMinuteKeyRef.current === minuteKey) {
        return;
      }

      lastMinuteKeyRef.current = minuteKey;

      // проверяем будильники раз в минуту
      alarms.forEach((alarmItem) => {
        const alreadyTriggered = triggeredMapRef.current.get(alarmItem.id) === minuteKey;
        if (alreadyTriggered) {
          return;
        }

        const due = isAlarmDueNow(alarmItem, now);
        if (!due) {
          return;
        }

        triggeredMapRef.current.set(alarmItem.id, minuteKey);

        // уведомление
        requestNotificationPermission().then((permission) => {
          if (permission !== 'granted') {
            return;
          }
          const title = alarmItem.label || 'Будильник';
          const body = `Время: ${alarmItem.time}`;
          showAlarmNotification(title, body);
        });

        // звук (8 секунд)
        const beep = playBeep(alarmItem.volume ?? 1, 8);

        // авто-стоп, если вкладка закрыта/размонтирована
        const onVisibilityChange = (): void => {
          if (document.hidden) {
            beep.stop();
          }
        };
        document.addEventListener('visibilitychange', onVisibilityChange, { once: true });
      });
    };

    const intervalId = window.setInterval(tick, 1000);
    tick(); // стартовая проверка

    const cleanup = (): void => {
      isMounted = false;
      window.clearInterval(intervalId);
    };

    return cleanup;
  }, [alarms]);

  return null;
};

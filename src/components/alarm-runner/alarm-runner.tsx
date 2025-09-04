import { useEffect, useRef, useState } from 'react';

import { useAlarmStore } from '@/store/alarm-store';
import { selectAlarms } from '@/store/alarm-selectors';
import { getMinuteKey, isAlarmDueNow } from '@/utils/alarm.utils';
import { requestNotificationPermission, showAlarmNotification } from '@/utils/notification.utils';
import { playAlarmSound, type BeepController } from '@/utils/sound.utils';

import styles from './alarm-toast.module.css';

import type { Alarm } from '@/types/alarm.type';

type TriggerMap = Map<string, string>;

export const AlarmRunner = (): JSX.Element | null => {
  const alarms = useAlarmStore(selectAlarms);
  const updateAlarm = useAlarmStore((state) => state.updateAlarm);
  const snoozeAlarm = useAlarmStore((state) => state.snoozeAlarm);
  const disableAlarm = useAlarmStore((state) => state.disableAlarm);

  const lastMinuteKeyRef = useRef<string | null>(null);
  const triggeredMapRef = useRef<TriggerMap>(new Map());
  const soundRef = useRef<BeepController | null>(null);

  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);

  useEffect(() => {
    let isMounted = true;

    const stopSound = (): void => {
      soundRef.current?.stop();
      soundRef.current = null;
    };

    const triggerAlarm = (alarmItem: Alarm, minuteKey: string): void => {
      setRingingAlarm(alarmItem);
      soundRef.current = playAlarmSound(alarmItem.soundId, alarmItem.volume);
      triggeredMapRef.current.set(alarmItem.id, minuteKey);

      requestNotificationPermission().then((permission) => {
        if (permission !== 'granted') return;

        const title = alarmItem.label || 'Будильник';
        const body = `Время: ${alarmItem.time}`;
        showAlarmNotification(title, body);
      });
    };

    const tick = (): void => {
      if (!isMounted) {
        return;
      }
      const now = new Date();
      const minuteKey = getMinuteKey(now);

      if (lastMinuteKeyRef.current === minuteKey) return;

      lastMinuteKeyRef.current = minuteKey;

      alarms.forEach((alarmItem) => {
        const alreadyTriggered = triggeredMapRef.current.get(alarmItem.id) === minuteKey;

        if (alreadyTriggered) return;

        const dueBySnooze = alarmItem.snoozeUntilKey === minuteKey;
        const dueByTime = isAlarmDueNow(alarmItem, now);

        if (!dueBySnooze && !dueByTime) return;

        if (dueBySnooze) updateAlarm(alarmItem.id, { snoozeUntilKey: null });

        triggerAlarm(alarmItem, minuteKey);
      });
    };

    const intervalId = window.setInterval(tick, 1000);
    tick();

    const cleanup = (): void => {
      isMounted = false;
      window.clearInterval(intervalId);
      stopSound();
    };

    return cleanup;
  }, [alarms, updateAlarm]);

  const handleSnooze = (alarmId: string): void => {
    soundRef.current?.stop();
    soundRef.current = null;
    snoozeAlarm(alarmId, 5);
    setRingingAlarm(null);
  };

  const handleDisable = (alarmId: string): void => {
    soundRef.current?.stop();
    soundRef.current = null;
    disableAlarm(alarmId);
    setRingingAlarm(null);
  };

  const handleDismiss = (): void => {
    soundRef.current?.stop();
    soundRef.current = null;
    setRingingAlarm(null);
  };

  if (!ringingAlarm) return null;

  return (
    <div className={styles.toast} role="dialog" aria-live="assertive" aria-label="Будильник звонит">
      <h3 className={styles.title}>{ringingAlarm.label || 'Будильник'}</h3>
      <p className={styles.info}>Сейчас {ringingAlarm.time}</p>
      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${styles.primary}`}
          type="button"
          onClick={() => handleSnooze(ringingAlarm.id)}
        >
          Подождать 5 минут
        </button>
        <button className={`${styles.btn}`} type="button" onClick={handleDismiss}>
          Остановить
        </button>
        <button
          className={`${styles.btn} ${styles.danger}`}
          type="button"
          onClick={() => handleDisable(ringingAlarm.id)}
        >
          Отключить
        </button>
      </div>
    </div>
  );
};

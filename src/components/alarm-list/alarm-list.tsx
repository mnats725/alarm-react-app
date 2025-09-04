import { useMemo, useCallback } from 'react';

import { useAlarmStore } from '@/store/alarm-store';
import { selectAlarms } from '@/store/alarm-selectors';

import { AlarmCard } from './alarm-card';

import styles from './alarm-list.module.css';

export type AlarmListProps = {
  title?: string;
};

export const AlarmList = ({ title }: AlarmListProps) => {
  const finalTitle = title ?? 'Мои будильники';

  const alarms = useAlarmStore(selectAlarms);
  const toggleAlarm = useAlarmStore((state) => state.toggleAlarm);
  const removeAlarm = useAlarmStore((state) => state.removeAlarm);

  const alarmsSorted = useMemo(
    () => [...alarms].sort((firstAlarm, secondAlarm) => firstAlarm.time.localeCompare(secondAlarm.time)),
    [alarms]
  );

  const isEmpty = alarmsSorted.length === 0;

  const handleToggle = useCallback(
    (alarmId: string): void => {
      toggleAlarm(alarmId);
    },
    [toggleAlarm]
  );

  const handleRemove = useCallback(
    (alarmId: string): void => {
      removeAlarm(alarmId);
    },
    [removeAlarm]
  );

  return (
    <section className={styles.section} aria-labelledby="alarms-title">
      <h2 id="alarms-title" className={styles.title}>
        {finalTitle}
      </h2>

      {isEmpty ? (
        <p className={styles.empty}>Список пуст — добавьте первый будильник выше.</p>
      ) : (
        <ul className={styles.list} role="list">
          {alarmsSorted.map((alarmItem) => (
            <li key={alarmItem.id} className={styles.item}>
              <AlarmCard alarm={alarmItem} onToggle={handleToggle} onRemove={handleRemove} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

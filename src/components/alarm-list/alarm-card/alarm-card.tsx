import { memo } from 'react';

import { WEEKDAY_SHORT_BY_CODE } from '@/constants/week-days.const';

import styles from './alarm-card.module.css';

import type { MouseEvent } from 'react';
import type { Alarm } from '@/types/alarm.type';

export type AlarmCardProps = {
  alarm: Alarm;
  onToggle: (alarmId: string) => void;
  onRemove: (alarmId: string) => void;
};

export const AlarmCard = memo(({ alarm, onToggle, onRemove }: AlarmCardProps) => {
  const handleToggleClick = (mouseEvent: MouseEvent<HTMLButtonElement>): void => {
    mouseEvent.preventDefault();
    onToggle(alarm.id);
  };

  const handleRemoveClick = (mouseEvent: MouseEvent<HTMLButtonElement>): void => {
    mouseEvent.preventDefault();
    onRemove(alarm.id);
  };

  return (
    <article className={styles.card} aria-label={`${alarm.label || 'Будильник'} ${alarm.time}`}>
      <header className={styles.head}>
        <time className={styles.time} dateTime={alarm.time}>
          {alarm.time}
        </time>
        <div className={styles.controls}>
          <button
            type="button"
            className={alarm.enabled ? `${styles.toggle} ${styles.on}` : styles.toggle}
            aria-pressed={alarm.enabled}
            onClick={handleToggleClick}
          >
            {alarm.enabled ? 'Вкл' : 'Выкл'}
          </button>
          <button
            type="button"
            className={styles.remove}
            onClick={handleRemoveClick}
            aria-label="Удалить"
            title="Удалить"
          >
            ✕
          </button>
        </div>
      </header>

      <p className={styles.label}>{alarm.label || <span className={styles.muted}>Без метки</span>}</p>

      <footer className={styles.foot}>
        <ul className={styles.repeat} role="list" aria-label="Повтор">
          {alarm.repeat.map((weekday) => (
            <li key={weekday} className={styles.badge}>
              {WEEKDAY_SHORT_BY_CODE[weekday]}
            </li>
          ))}
        </ul>
      </footer>
    </article>
  );
});

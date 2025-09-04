import { memo } from 'react';

import { WEEK_DAYS } from '@/constants/week-days.const';

import styles from './weekday-picker.module.css';

import type { Weekday } from '@/types/alarm.type';
import type { MouseEvent } from 'react';

export type WeekdayPickerProps = {
  selected: Weekday[];
  onToggle: (weekdayCode: Weekday) => void;
};

export const WeekdayPicker = memo(({ selected, onToggle }: WeekdayPickerProps) => {
  const handleClick =
    (weekdayCode: Weekday) =>
    (mouseEvent: MouseEvent<HTMLButtonElement>): void => {
      mouseEvent.preventDefault();
      onToggle(weekdayCode);
    };

  return (
    <fieldset className={styles.fieldset} aria-label="Повтор">
      <legend className={styles.legend}>Повтор</legend>
      <ul className={styles.days} role="list">
        {WEEK_DAYS.map((day) => {
          const isActive = selected.includes(day.code as Weekday);
          return (
            <li key={day.code}>
              <button
                type="button"
                className={isActive ? `${styles.day} ${styles.dayActive}` : styles.day}
                aria-pressed={isActive}
                onClick={handleClick(day.code as Weekday)}
              >
                {day.short}
              </button>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
});

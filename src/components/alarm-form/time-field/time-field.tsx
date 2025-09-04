import { memo } from 'react';

import styles from './time-field.module.css';

import type { ChangeEvent } from 'react';

export type TimeFieldProps = {
  value: string;
  onChangeValue: (newValue: string) => void;
  inputId?: string;
  labelText?: string;
};

export const TimeField = memo(({ value, onChangeValue, inputId, labelText }: TimeFieldProps) => {
  const finalId = inputId || 'alarm-time';
  const finalLabel = labelText || 'Время';

  const handleChange = (changeEvent: ChangeEvent<HTMLInputElement>): void => {
    onChangeValue(changeEvent.currentTarget.value);
  };

  return (
    <fieldset className={styles.fieldset} aria-label={finalLabel}>
      <label className={styles.label} htmlFor={finalId}>
        {finalLabel}
      </label>
      <input id={finalId} className={styles.input} type="time" value={value} onChange={handleChange} required />
    </fieldset>
  );
});

import { memo } from 'react';

import styles from './label-field.module.css';

import type { ChangeEvent } from 'react';

export type LabelFieldProps = {
  value: string;
  onChangeValue: (newValue: string) => void;
  inputId?: string;
  labelText?: string;
  placeholder?: string;
};

export const LabelField = memo(({ value, onChangeValue, inputId, labelText, placeholder }: LabelFieldProps) => {
  const finalId = inputId ?? 'alarm-label';
  const finalLabel = labelText ?? 'Метка';
  const finalPlaceholder = placeholder ?? 'Например: Подъём';

  const handleChange = (changeEvent: ChangeEvent<HTMLInputElement>): void => {
    onChangeValue(changeEvent.currentTarget.value);
  };

  return (
    <fieldset className={styles.fieldset} aria-label={finalLabel}>
      <label className={styles.label} htmlFor={finalId}>
        {finalLabel}
      </label>
      <input
        id={finalId}
        className={styles.input}
        type="text"
        placeholder={finalPlaceholder}
        value={value}
        onChange={handleChange}
      />
    </fieldset>
  );
});

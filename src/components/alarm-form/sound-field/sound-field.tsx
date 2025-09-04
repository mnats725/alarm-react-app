import { memo } from 'react';

import { SOUND_OPTIONS } from '@/constants/sounds.const';

import styles from './sound-field.module.css';

import type { ChangeEvent } from 'react';
import type { SoundId } from '@/types/alarm.type';

export type SoundFieldProps = {
  value: SoundId;
  onChangeValue: (newValue: SoundId) => void;
  selectId?: string;
  labelText?: string;
};

export const SoundField = memo(({ value, onChangeValue, selectId, labelText }: SoundFieldProps) => {
  const finalId = selectId || 'alarm-sound';
  const finalLabel = labelText || 'Звук';

  const handleChange = (changeEvent: ChangeEvent<HTMLSelectElement>): void => {
    onChangeValue(changeEvent.currentTarget.value as SoundId);
  };

  return (
    <fieldset className={styles.fieldset} aria-label={finalLabel}>
      <label className={styles.label} htmlFor={finalId}>
        {finalLabel}
      </label>
      <select id={finalId} className={styles.select} value={value} onChange={handleChange}>
        {SOUND_OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    </fieldset>
  );
});

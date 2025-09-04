import { memo } from 'react';

import styles from './volume-control.module.css';

import type { ChangeEvent } from 'react';

export type VolumeControlProps = {
  value: number;
  onChangeValue: (newValue: number) => void;
};

export const VolumeControl = memo(({ value, onChangeValue }: VolumeControlProps) => {
  const handleChange = (changeEvent: ChangeEvent<HTMLInputElement>): void => {
    onChangeValue(Number(changeEvent.currentTarget.value));
  };

  return (
    <fieldset className={styles.fieldset} aria-label="Громкость">
      <label className={styles.label} htmlFor="alarm-volume">
        Громкость
      </label>
      <input
        id="alarm-volume"
        className={styles.range}
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={handleChange}
      />
      <output className={styles.out}>{Math.round(value * 100)}%</output>
    </fieldset>
  );
});

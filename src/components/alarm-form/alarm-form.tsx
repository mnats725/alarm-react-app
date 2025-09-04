import { useState } from 'react';

import { TimeField } from './time-field';
import { LabelField } from './label-field';
import { VolumeControl } from './volume-control';
import { WeekdayPicker } from './weekday-picker';
import { FormActions } from './form-actions';
import { SoundField } from './sound-field';

import { useAlarmStore } from '@/store';

import styles from './alarm-form.module.css';

import type { FormEvent } from 'react';
import type { Weekday } from '@/types/alarm.type';
import type { SoundId } from '@/types/alarm.type';

export type AlarmFormProps = {
  compact?: boolean;
};

export const AlarmForm = ({ compact }: AlarmFormProps) => {
  const addAlarm = useAlarmStore((state) => state.addAlarm);

  const isCompact = compact === true;

  const [time, setTime] = useState('07:00');
  const [label, setLabel] = useState('');
  const [soundId, setSoundId] = useState<SoundId>('beep');
  const [volume, setVolume] = useState(1);
  const [repeat, setRepeat] = useState<Weekday[]>([]);

  const handleSubmit = (formEvent: FormEvent<HTMLFormElement>): void => {
    formEvent.preventDefault();
    addAlarm({ time, label, volume, repeat, soundId });
    setLabel('');
  };

  const handleToggleRepeat = (weekdayCode: Weekday): void => {
    const isActive = repeat.includes(weekdayCode);
    if (isActive) {
      const next = repeat.filter((code) => code !== weekdayCode);
      setRepeat(next);
      return;
    }
    const next = [...repeat, weekdayCode];
    setRepeat(next);
  };

  return (
    <section className={styles.section} aria-labelledby="create-title">
      <h2 id="create-title" className={styles.title}>
        Создать будильник
      </h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <TimeField value={time} onChangeValue={setTime} />
        <LabelField value={label} onChangeValue={setLabel} />
        <SoundField value={soundId} onChangeValue={setSoundId} />
        <VolumeControl value={volume} onChangeValue={setVolume} />
        <WeekdayPicker selected={repeat} onToggle={handleToggleRepeat} />
        <FormActions isCompact={isCompact}>
          <button type="submit" className={styles.primary}>
            Добавить
          </button>
        </FormActions>
      </form>
    </section>
  );
};

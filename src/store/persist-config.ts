export const ALARM_PERSIST_NAME = 'alarm-store';
export const ALARM_PERSIST_VERSION = 2 as const;

import type { Alarm, SoundId } from '@/types/alarm.type';
import type { AlarmPersistedState } from './alarm-store.type';

export const alarmPartialize = (state: { alarms: Alarm[] }): AlarmPersistedState => ({
  alarms: state.alarms,
});

export const migrateAlarmState = (persistedState: unknown, fromVersion: number): AlarmPersistedState => {
  if (!(typeof persistedState === 'object' && persistedState !== null)) return { alarms: [] };

  const maybeObj = persistedState as { alarms?: unknown };

  if (!Array.isArray(maybeObj.alarms)) return { alarms: [] };

  if (fromVersion < 2) {
    type PersistedV1Alarm = {
      id: string;
      time: string;
      label?: string;
      enabled?: boolean;
      repeat?: number[];
      volume?: number;
      soundId?: SoundId;
      snoozeUntilKey?: string | null;
    };

    const upgraded: Alarm[] = (maybeObj.alarms as PersistedV1Alarm[]).map((raw) => ({
      id: raw.id,
      time: raw.time,
      label: raw.label ?? '',
      enabled: Boolean(raw.enabled),
      repeat: Array.isArray(raw.repeat) ? (raw.repeat as Alarm['repeat']) : [],
      volume: typeof raw.volume === 'number' ? raw.volume : 1,
      soundId: (raw.soundId as SoundId) ?? 'beep',
      snoozeUntilKey: raw.snoozeUntilKey ?? null,
    }));

    return { alarms: upgraded };
  }

  return { alarms: maybeObj.alarms as Alarm[] };
};

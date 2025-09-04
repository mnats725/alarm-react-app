import { create, type StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid';

import { clamp01, normalizeTime } from '@/utils/time.utils';
import { addMinutes, getMinuteKey } from '@/utils/alarm.utils';

import type { Alarm, SoundId } from '@/types/alarm.type';

export type AlarmStore = {
  alarms: Alarm[];
  addAlarm: (data: {
    time: string;
    label?: string;
    repeat?: Alarm['repeat'];
    volume?: number;
    enabled?: boolean;
    soundId?: SoundId;
  }) => void;
  updateAlarm: (id: string, patch: Partial<Omit<Alarm, 'id'>>) => void;
  toggleAlarm: (id: string, on?: boolean) => void;
  removeAlarm: (id: string) => void;
  clearAll: () => void;

  snoozeAlarm: (id: string, minutes?: number) => void;
  disableAlarm: (id: string) => void;
};

const creator: StateCreator<AlarmStore, [], []> = (set, get) => ({
  alarms: [],

  addAlarm: (data) => {
    const time = normalizeTime(data.time);
    const label = data.label?.trim() ?? '';
    const repeat = Array.isArray(data.repeat) ? ([...new Set(data.repeat)].sort() as Alarm['repeat']) : [];
    const volume = typeof data.volume === 'number' ? clamp01(data.volume) : 1;
    const soundId = data.soundId || 'beep';

    const alarm: Alarm = {
      id: nanoid(12),
      time,
      label,
      enabled: data.enabled ?? true,
      repeat,
      volume,
      soundId,
      snoozeUntilKey: null,
    };

    set({ alarms: [alarm, ...get().alarms] });
  },

  updateAlarm: (id, patch) => {
    set({
      alarms: get().alarms.map((alarmItem): Alarm => {
        if (alarmItem.id !== id) {
          return alarmItem;
        }

        const time = patch.time ? normalizeTime(patch.time) : alarmItem.time;
        const label = typeof patch.label === 'string' ? patch.label : alarmItem.label;
        const enabled = typeof patch.enabled === 'boolean' ? patch.enabled : alarmItem.enabled;
        const repeat = Array.isArray(patch.repeat)
          ? ([...new Set(patch.repeat)].sort() as Alarm['repeat'])
          : alarmItem.repeat;
        const volume = typeof patch.volume === 'number' ? clamp01(patch.volume) : alarmItem.volume;
        const soundId = patch.soundId ?? alarmItem.soundId;

        const snoozeUntilKey: string | null = Object.prototype.hasOwnProperty.call(patch, 'snoozeUntilKey')
          ? patch.snoozeUntilKey ?? null
          : alarmItem.snoozeUntilKey;

        return { ...alarmItem, time, label, enabled, repeat, volume, soundId, snoozeUntilKey };
      }),
    });
  },

  toggleAlarm: (id, on) => {
    set({
      alarms: get().alarms.map((alarmItem) =>
        alarmItem.id === id ? { ...alarmItem, enabled: typeof on === 'boolean' ? on : !alarmItem.enabled } : alarmItem
      ),
    });
  },

  removeAlarm: (id) => {
    set({ alarms: get().alarms.filter((alarmItem) => alarmItem.id !== id) });
  },

  clearAll: () => {
    set({ alarms: [] });
  },

  snoozeAlarm: (id, minutes = 5) => {
    const now = new Date();
    const until = addMinutes(now, minutes);
    const minuteKey = getMinuteKey(until);

    set({
      alarms: get().alarms.map((alarmItem) =>
        alarmItem.id === id ? { ...alarmItem, snoozeUntilKey: minuteKey } : alarmItem
      ),
    });
  },

  disableAlarm: (id) => {
    set({
      alarms: get().alarms.map((alarmItem) =>
        alarmItem.id === id ? { ...alarmItem, enabled: false, snoozeUntilKey: null } : alarmItem
      ),
    });
  },
});

type AlarmPersistedState = { alarms: Alarm[] };

export const useAlarmStore = create<AlarmStore>()(
  persist<AlarmStore, [], [], AlarmPersistedState>(creator, {
    name: 'alarm-store',
    storage: createJSONStorage<AlarmPersistedState>(() => localStorage),
    version: 2,

    partialize: (state): AlarmPersistedState => ({ alarms: state.alarms }),

    migrate: (persistedState: unknown, fromVersion: number): AlarmPersistedState => {
      if (!(typeof persistedState === 'object' && persistedState !== null)) {
        return { alarms: [] };
      }

      const maybeObj = persistedState as { alarms?: unknown };

      if (!Array.isArray(maybeObj.alarms)) {
        return { alarms: [] };
      }

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
    },
  })
);

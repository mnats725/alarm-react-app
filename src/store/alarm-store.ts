import { create, type StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { nanoid } from 'nanoid';

import { clamp01, normalizeTime } from '@/utils/time.utils';

import type { Alarm } from '@/types/alarm.type';

export type AlarmStore = {
  alarms: Alarm[];
  addAlarm: (data: {
    time: string;
    label?: string;
    repeat?: Alarm['repeat'];
    volume?: number;
    enabled?: boolean;
  }) => void;
  updateAlarm: (id: string, patch: Partial<Omit<Alarm, 'id'>>) => void;
  toggleAlarm: (id: string, on?: boolean) => void;
  removeAlarm: (id: string) => void;
  clearAll: () => void;
};

type Middleware = [['zustand/persist', unknown]];

const creator: StateCreator<AlarmStore, Middleware, [], AlarmStore> = (set, get) => ({
  alarms: [],
  addAlarm: (data) => {
    const time = normalizeTime(data.time);
    const label = data.label?.trim() ?? '';
    const repeat = Array.isArray(data.repeat) ? ([...new Set(data.repeat)].sort() as Alarm['repeat']) : [];
    const volume = typeof data.volume === 'number' ? clamp01(data.volume) : 1;

    const alarm: Alarm = {
      id: nanoid(12),
      time,
      label,
      enabled: data.enabled ?? true,
      repeat,
      volume,
    };

    set({ alarms: [alarm, ...get().alarms] });
  },
  updateAlarm: (id, patch) => {
    set({
      alarms: get().alarms.map((alarmItem: Alarm) => {
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

        return { ...alarmItem, time, label, enabled, repeat, volume };
      }),
    });
  },
  toggleAlarm: (id, on) => {
    set({
      alarms: get().alarms.map((alarmItem: Alarm) =>
        alarmItem.id === id ? { ...alarmItem, enabled: typeof on === 'boolean' ? on : !alarmItem.enabled } : alarmItem
      ),
    });
  },
  removeAlarm: (id) => {
    set({ alarms: get().alarms.filter((alarmItem: Alarm) => alarmItem.id !== id) });
  },
  clearAll: () => {
    set({ alarms: [] });
  },
});

export const useAlarmStore = create<AlarmStore>()(
  persist(creator, {
    name: 'alarm-store',
    storage: createJSONStorage(() => localStorage),
    version: 1,
    partialize: (state: AlarmStore) => ({ alarms: state.alarms }),
  })
);

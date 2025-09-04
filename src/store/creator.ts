import { nanoid } from 'nanoid';

import { clamp01, normalizeTime } from '@/utils/time.utils';
import { addMinutes, getMinuteKey } from '@/utils/alarm.utils';

import type { Alarm } from '@/types/alarm.type';
import type { AlarmStore } from './alarm-store.type';
import type { StateCreator } from 'zustand';

export const creator: StateCreator<AlarmStore, [], []> = (set, get) => ({
  alarms: [],

  addAlarm: (data) => {
    const time = normalizeTime(data.time);
    const label = data.label?.trim() ?? '';
    const repeat = Array.isArray(data.repeat) ? ([...new Set(data.repeat)].sort() as Alarm['repeat']) : [];
    const volume = typeof data.volume === 'number' ? clamp01(data.volume) : 1;
    const soundId = data.soundId ?? 'beep';

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

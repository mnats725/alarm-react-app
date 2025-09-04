import type { Alarm } from '@/types/alarm.type';

export type AlarmStore = {
  alarms: Alarm[];
  addAlarm: (data: {
    time: string;
    label?: string;
    repeat?: Alarm['repeat'];
    volume?: number;
    enabled?: boolean;
    soundId?: Alarm['soundId'];
  }) => void;
  updateAlarm: (id: string, patch: Partial<Omit<Alarm, 'id'>>) => void;
  toggleAlarm: (id: string, on?: boolean) => void;
  removeAlarm: (id: string) => void;
  clearAll: () => void;

  snoozeAlarm: (id: string, minutes?: number) => void;
  disableAlarm: (id: string) => void;
};

export type AlarmPersistedState = { alarms: Alarm[] };

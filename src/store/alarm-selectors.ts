import type { AlarmStore } from './alarm-store';
import type { Alarm } from '@/types/alarm.type';

export const selectAlarms = (s: AlarmStore): Alarm[] => s.alarms;

export const selectById =
  (id: string) =>
  (s: AlarmStore): Alarm | undefined =>
    s.alarms.find((alarmItem) => alarmItem.id === id);

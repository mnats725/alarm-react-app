import type { Alarm } from '@/types/alarm.type';

export const getTimeHHmm = (date: Date = new Date()): string => {
  const h = String(date.getHours()).padStart(2, '0');
  const m = String(date.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
};

export const getMinuteKey = (date: Date = new Date()): string => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hhmm = getTimeHHmm(date);
  return `${yyyy}-${mm}-${dd}T${hhmm}`;
};

export const addMinutes = (date: Date, minutes: number): Date =>
  new Date(date.getTime() + Math.max(0, minutes) * 60_000);

export const isRepeatDayMatched = (alarm: Alarm, date: Date = new Date()): boolean => {
  const dayCode = date.getDay(); // 0..6 (вс..сб)
  if (alarm.repeat.length === 0) {
    return true;
  }
  return alarm.repeat.includes(dayCode as 0 | 1 | 2 | 3 | 4 | 5 | 6);
};

export const isAlarmDueNow = (alarm: Alarm, date: Date = new Date()): boolean => {
  if (!alarm.enabled) {
    return false;
  }
  if (!isRepeatDayMatched(alarm, date)) {
    return false;
  }
  return alarm.time === getTimeHHmm(date);
};

import type { Weekday } from '@/types/alarm.type';

export const WEEK_DAYS: ReadonlyArray<{ code: Weekday; short: string; label: string }> = [
  { code: 1, short: 'Пн', label: 'Понедельник' },
  { code: 2, short: 'Вт', label: 'Вторник' },
  { code: 3, short: 'Ср', label: 'Среда' },
  { code: 4, short: 'Чт', label: 'Четверг' },
  { code: 5, short: 'Пт', label: 'Пятница' },
  { code: 6, short: 'Сб', label: 'Суббота' },
  { code: 0, short: 'Вс', label: 'Воскресенье' },
] as const;

export const WEEKDAY_ORDER: Readonly<Weekday[]> = [1, 2, 3, 4, 5, 6, 0];

export const WEEKDAY_SHORT_BY_CODE: Readonly<Record<Weekday, string>> = Object.freeze({
  0: 'Вс',
  1: 'Пн',
  2: 'Вт',
  3: 'Ср',
  4: 'Чт',
  5: 'Пт',
  6: 'Сб',
});

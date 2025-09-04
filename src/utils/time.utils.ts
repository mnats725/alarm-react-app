export const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

export const isValidTime = (hhmm: string): boolean => /^\d{2}:\d{2}$/.test(hhmm);

export const normalizeTime = (hhmm: string): string => {
  if (!isValidTime(hhmm)) return '07:00';

  const [h, m] = hhmm.split(':');
  const hh = String(Math.min(23, Math.max(0, Number(h)))).padStart(2, '0');
  const mm = String(Math.min(59, Math.max(0, Number(m)))).padStart(2, '0');

  return `${hh}:${mm}`;
};

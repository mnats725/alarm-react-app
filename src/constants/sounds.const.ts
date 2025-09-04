import type { SoundId } from '@/types/alarm.type';

export const SOUND_OPTIONS: ReadonlyArray<{ id: SoundId; name: string; src?: string }> = [
  { id: 'beep', name: 'Beep (sine)' },
  { id: 'lo-fi', name: 'Lo-Fi', src: '../../public/sounds/lo-fi-alarm.mp3' },
  { id: 'star-dust', name: 'Star Dust', src: '../../public/sounds/star-dust-alarm.mp3' },
  { id: 'alarm-clock', name: 'Alarm Clock', src: '../../public/sounds/alarm-clock.mp3' },
  { id: 'funny', name: 'Funny', src: '../../public/sounds/funny-alarm.mp3' },
] as const;

export const SOUND_BY_ID: Readonly<Record<SoundId, { id: SoundId; name: string; src?: string }>> = Object.freeze(
  SOUND_OPTIONS.reduce((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {} as Record<SoundId, { id: SoundId; name: string; src?: string }>)
);

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type SoundId = 'beep' | 'lo-fi' | 'star-dust' | 'alarm-clock' | 'funny';

export type Alarm = {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  repeat: Weekday[];
  volume: number;
  soundId: SoundId;
  snoozeUntilKey: string | null;
};

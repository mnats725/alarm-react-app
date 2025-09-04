import { SOUND_BY_ID } from '@/constants/sounds.const';

import type { SoundId } from '@/types/alarm.type';

export type BeepController = { stop: () => void };

type AudioContextCtor = new (contextOptions?: AudioContextOptions) => AudioContext;

const getAudioContextCtor = (): AudioContextCtor | undefined => {
  if (typeof window === 'undefined') return undefined;

  const w = window as unknown as {
    AudioContext?: AudioContextCtor;
    webkitAudioContext?: AudioContextCtor;
  };

  return w.AudioContext ?? w.webkitAudioContext;
};

const playOscillator = (volume: number): BeepController => {
  const Ctor = getAudioContextCtor();
  if (!Ctor) {
    const audio = new Audio(
      'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABYAZGF0YQQAAAAA/////wAAAP///wAAAP///w=='
    );
    audio.volume = Math.max(0, Math.min(1, volume));
    audio.loop = true;
    void audio.play();
    const stop = (): void => audio.pause();
    return { stop };
  }

  const ctx = new Ctor();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = 880;
  gain.gain.value = Math.max(0, Math.min(1, volume));
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();

  const stop = (): void => {
    try {
      oscillator.stop();
      oscillator.disconnect();
      gain.disconnect();
      void ctx.close();
    } catch {
      // no-op
    }
  };
  return { stop };
};

const playAudioFile = (src: string, volume: number): BeepController => {
  const audio = new Audio(src);

  audio.volume = Math.max(0, Math.min(1, volume));
  audio.loop = true;

  void audio.play().catch(() => {});

  const stop = (): void => {
    audio.pause();
    audio.currentTime = 0;
  };

  return { stop };
};

export const playAlarmSound = (soundId: SoundId, volume: number): BeepController => {
  const sound = SOUND_BY_ID[soundId];

  if (!sound || !sound.src) return playOscillator(volume);

  return playAudioFile(sound.src, volume);
};

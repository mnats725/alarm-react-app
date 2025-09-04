export type BeepController = {
  stop: () => void;
};

type AudioContextCtor = new (contextOptions?: AudioContextOptions) => AudioContext;

export const playBeep = (volume: number, seconds: number): BeepController => {
  if (typeof window === 'undefined') {
    return { stop: () => undefined };
  }

  const w = window as unknown as {
    AudioContext?: AudioContextCtor;
    webkitAudioContext?: AudioContextCtor;
  };
  const AudioContextRef: AudioContextCtor | undefined = w.AudioContext ?? w.webkitAudioContext;

  if (!AudioContextRef) {
    const audio = new Audio(
      'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABYAZGF0YQQAAAAA/////wAAAP///wAAAP///w=='
    );
    const clampedVolume = Math.max(0, Math.min(1, volume));
    audio.volume = clampedVolume;
    audio.loop = true;
    void audio.play();
    const timeoutId = window.setTimeout(() => audio.pause(), seconds * 1000);
    const stop = (): void => {
      window.clearTimeout(timeoutId);
      audio.pause();
    };
    return { stop };
  }

  const ctx = new AudioContextRef();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = 880; // A5
  gain.gain.value = Math.max(0, Math.min(1, volume));

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();

  const stopNow = (): void => {
    try {
      oscillator.stop();
      oscillator.disconnect();
      gain.disconnect();
      void ctx.close();
    } catch {
      // no-op
    }
  };

  const timeoutId = window.setTimeout(stopNow, seconds * 1000);
  const stop = (): void => {
    window.clearTimeout(timeoutId);
    stopNow();
  };

  return { stop };
};

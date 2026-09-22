// Meow-morphism Haptic & Cozy Audio Engine

let audioCtx: AudioContext | null = null;
let isAudioMuted: boolean = typeof window !== 'undefined' 
  ? localStorage.getItem('kotokarta_sound_muted') === 'true' 
  : false;

export const isSoundMuted = (): boolean => isAudioMuted;

export const setSoundMuted = (muted: boolean) => {
  isAudioMuted = muted;
  if (typeof window !== 'undefined') {
    localStorage.setItem('kotokarta_sound_muted', muted ? 'true' : 'false');
  }
};

export const toggleSoundMuted = (): boolean => {
  setSoundMuted(!isAudioMuted);
  return isAudioMuted;
};

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined' || isAudioMuted) return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
};

/**
 * Haptic Purr: simulates a cat's 25Hz purring vibration on mobile
 * and generates a subtle, cozy low-frequency purr oscillation on desktop.
 */
export const playPurrHaptic = () => {
  // 1. Mobile Physical Vibration
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([15, 40, 18, 40, 22, 50, 15]);
    } catch {
      // Ignore vibration permission errors
    }
  }

  // 2. Synthesized Cozy Purr Audio (Web Audio API)
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Low frequency rumble oscillator (28Hz ~ 32Hz, mimicking true cat purr)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(28, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(26, now + 0.35);

    // Amplitude modulation for rhythmic throbbing purr
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.42);
  } catch {
    // Graceful degradation if audio is not allowed
  }
};

/**
 * Cute micro-meow audio chime on button interactions and nose boops.
 */
export const playMeowSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Gentle melodic sweep: meow formant
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(740, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(510, now + 0.22);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch {
    // Ignore audio errors
  }
};

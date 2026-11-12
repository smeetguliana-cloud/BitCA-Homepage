// Lightweight Web Audio API synthesizer for cinematic cyber audio feedback without external files

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playCyberGlitchSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Rapid frequency sweep mimicking chromatic digital warp
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(120, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
  osc.frequency.exponentialRampToValueAtTime(240, now + 0.18);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.22);
}

export function playPortalBreachSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Sub oscillator for bass rumble
  const subOsc = ctx.createOscillator();
  const subGain = ctx.createGain();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(55, now);
  subOsc.frequency.exponentialRampToValueAtTime(140, now + 0.4);
  subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.9);
  subGain.gain.setValueAtTime(0.18, now);
  subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
  subOsc.connect(subGain);
  subGain.connect(ctx.destination);
  subOsc.start(now);
  subOsc.stop(now + 1.0);

  // High shimmer oscillator for dimensional warp
  const shimmerOsc = ctx.createOscillator();
  const shimmerGain = ctx.createGain();
  shimmerOsc.type = 'triangle';
  shimmerOsc.frequency.setValueAtTime(587.33, now); // D5
  shimmerOsc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.3); // D6
  shimmerOsc.frequency.exponentialRampToValueAtTime(1760.00, now + 0.7); // A6
  shimmerGain.gain.setValueAtTime(0.1, now);
  shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
  shimmerOsc.connect(shimmerGain);
  shimmerGain.connect(ctx.destination);
  shimmerOsc.start(now);
  shimmerOsc.stop(now + 0.85);
}

export function playCardHoverSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);

  gain.gain.setValueAtTime(0.03, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.05);
}

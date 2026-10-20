import { useSyncExternalStore } from 'react';
import { site } from '../config/site';

/** Preferência de som compartilhada (persistida no navegador quando possível). */
const KEY = 'lc-sound';
let enabled: boolean = site.soundDefaultOn;
try {
  const v = localStorage.getItem(KEY);
  if (v !== null) enabled = v === '1';
} catch {
  /* armazenamento indisponível */
}
const subs = new Set<() => void>();

export function setSound(on: boolean) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? '1' : '0');
  } catch {
    /* ignora */
  }
  subs.forEach((f) => f());
}

export function useSound() {
  return useSyncExternalStore(
    (f) => {
      subs.add(f);
      return () => subs.delete(f);
    },
    () => enabled,
  );
}

let ctx: AudioContext | null = null;

/** Som de obturador sintetizado (espelho + cortina). Só toca após clique do visitante e com o som ligado. */
export function playShutter() {
  if (!enabled) return;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    if (ctx.state === 'suspended') void ctx.resume();
    const c = ctx;
    const t0 = c.currentTime + 0.005;

    const burst = (at: number, dur: number, freq: number, q: number, gain: number) => {
      const len = Math.ceil(c.sampleRate * dur);
      const buf = c.createBuffer(1, len, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      const src = c.createBufferSource();
      src.buffer = buf;
      const bp = c.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = freq;
      bp.Q.value = q;
      const g = c.createGain();
      g.gain.setValueAtTime(gain, at);
      g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      src.connect(bp).connect(g).connect(c.destination);
      src.start(at);
      src.stop(at + dur + 0.02);
    };

    const thump = (at: number) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(180, at);
      o.frequency.exponentialRampToValueAtTime(60, at + 0.05);
      g.gain.setValueAtTime(0.25, at);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.06);
      o.connect(g).connect(c.destination);
      o.start(at);
      o.stop(at + 0.08);
    };

    burst(t0, 0.035, 3200, 0.9, 0.55); // abertura
    thump(t0);
    burst(t0 + 0.07, 0.05, 2200, 0.7, 0.45); // fechamento
    thump(t0 + 0.07);
  } catch {
    /* áudio indisponível */
  }
}

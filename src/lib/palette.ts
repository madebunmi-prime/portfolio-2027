import type { Accent, Tone } from '@/content/schema';

/** Mirrors the accent tokens in globals.css — three.js, canvas and computed styles need raw hex. */
export const ACCENTS: Record<Accent, string> = {
  violet: '#8b5cf6',
  cyan: '#22d3ee',
  pink: '#f472b6',
  amber: '#fbbf24',
  green: '#34d399',
  blue: '#60a5fa',
};

export const TONES: Record<Tone, string> = { ...ACCENTS, white: '#ffffff', muted: '#aaa5d6' };

export const INK = {
  950: '#05041a',
  900: '#0e0c28',
  850: '#120f33',
  800: '#151236',
  700: '#221e4e',
  600: '#2a2558',
  500: '#3a3478',
} as const;

export function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/** Accent chip fill used for icon tiles. */
export const accentGradient = (hex: string) => `linear-gradient(135deg, ${hex}, ${withAlpha(hex, 0.45)})`;

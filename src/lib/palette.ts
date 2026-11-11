import type { Accent } from '@/content/schema';

/** Mirrors the accent tokens in globals.css — three.js and computed styles need raw hex. */
export const ACCENTS: Record<Accent, string> = {
  violet: '#8b5cf6',
  cyan: '#22d3ee',
  pink: '#f472b6',
  amber: '#fbbf24',
  green: '#34d399',
  blue: '#60a5fa',
};

export const INK = {
  950: '#05041a',
  900: '#0e0c28',
  700: '#221e4e',
} as const;

export function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

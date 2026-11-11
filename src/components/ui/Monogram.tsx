import { useId } from 'react';

export function Monogram({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-lilac)" />
          <stop offset="1" stopColor="var(--color-cyan)" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${id})`} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4,27 16,5 28,27" />
        <polygon points="16,15 20,20 16,25 12,20" />
      </g>
    </svg>
  );
}

'use client';

import { createElement, type CSSProperties, type HTMLAttributes, type PointerEvent } from 'react';
import { cn } from '@/lib/utils';

/** The decorative layers behind every glow surface. Safe to render from server components. */
export function GlowDecor({ spot = true, shine = false }: { spot?: boolean; shine?: boolean }) {
  return (
    <>
      {spot ? <span aria-hidden="true" className="glow-spot" /> : null}
      {shine ? <span aria-hidden="true" className="shine" /> : null}
      <span aria-hidden="true" className="glow-ring" />
      <span aria-hidden="true" className="glow-halo" />
    </>
  );
}

type Tag = 'div' | 'article' | 'aside' | 'figure' | 'li' | 'section';

type Props = HTMLAttributes<HTMLElement> & {
  as?: Tag;
  /** Accent hex for the rotating border + spotlight */
  color?: string;
  /** Lift on hover (off inside marquees) */
  lift?: boolean;
  /** Keep the ring visible at rest (selected state) */
  on?: boolean;
};

/**
 * Card surface with a definite border that, on hover, gains a rotating conic glow ring,
 * a soft halo and a cursor-following spotlight. Styles live in globals.css (.glow-*).
 */
export function Glow({ as = 'div', color, lift = true, on = false, className, style, children, onPointerMove, ...rest }: Props) {
  const move = (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const b = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - b.left}px`);
    el.style.setProperty('--my', `${e.clientY - b.top}px`);
    onPointerMove?.(e);
  };
  return createElement(
    as,
    {
      ...rest,
      className: cn('glow', lift && 'glow-lift', on && 'glow-on', className),
      style: { ...style, ...(color ? { '--glow': color } : null) } as CSSProperties,
      onPointerMove: move,
    },
    children,
    <GlowDecor key="decor" />,
  );
}

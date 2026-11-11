import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { GlowDecor } from './Glow';

type Variant = 'primary' | 'ghost';

const base = 'glow relative isolate inline-flex items-center gap-3 rounded-full px-6 py-[15px] font-semibold transition-[box-shadow,border-color] duration-300';

const variants: Record<Variant, string> = {
  primary:
    'glow-on bg-[linear-gradient(95deg,var(--color-violet),#6d5cf6_55%,var(--color-cyan))] text-fg [--glow:#ffffff] shadow-[0_10px_40px_-10px_rgb(139_92_246/0.8),inset_0_1px_0_rgb(255_255_255/0.25)] hover:shadow-[0_14px_50px_-8px_rgb(139_92_246/1),inset_0_1px_0_rgb(255_255_255/0.35)]',
  ghost: 'border border-body/30 bg-ink-900/50 font-medium text-fg hover:border-body',
};

export const buttonClass = (variant: Variant = 'primary', className?: string) => cn(base, variants[variant], className);

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; variant?: Variant; children: ReactNode };

/** Pill CTA with a moving gradient border and a shine sweep on hover. */
export function Button({ variant = 'primary', className, children, ...rest }: LinkProps) {
  return (
    <a className={buttonClass(variant, className)} {...rest}>
      {children}
      <GlowDecor spot={false} shine />
    </a>
  );
}

type SubmitProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode };

export function ActionButton({ variant = 'primary', className, children, ...rest }: SubmitProps) {
  return (
    <button className={buttonClass(variant, cn('cursor-pointer border-0', className))} {...rest}>
      {children}
      <GlowDecor spot={false} shine />
    </button>
  );
}

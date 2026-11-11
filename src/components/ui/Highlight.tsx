import { Fragment } from 'react';

type Props = { text: string; variant?: 'gradient' | 'underline' };

/** Renders `[word]` segments from content JSON as the accent highlight. */
export function Highlight({ text, variant = 'gradient' }: Props) {
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('[') && part.endsWith(']') ? (
          <span
            key={i}
            className={variant === 'gradient' ? 'text-gradient' : 'font-semibold text-fg shadow-[inset_0_-2px_0_var(--color-cyan)]'}
          >
            {part.slice(1, -1)}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

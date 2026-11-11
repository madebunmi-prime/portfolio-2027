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
            className={
              variant === 'gradient'
                ? 'text-gradient'
                : 'font-semibold text-fg underline decoration-cyan decoration-2 underline-offset-[6px]'
            }
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

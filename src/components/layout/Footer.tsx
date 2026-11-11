import type { Portfolio } from '@/content/schema';

export function Footer({ data }: { data: Portfolio['footer'] }) {
  return (
    <footer className="flex flex-wrap justify-between gap-4 border-t border-ink-700 pt-6 pb-8 font-mono text-xs tracking-[0.08em] text-faint uppercase">
      <span>{data.copyright.replace('{year}', String(new Date().getFullYear()))}</span>
      {data.note ? <span>{data.note}</span> : null}
    </footer>
  );
}

import type { Portfolio } from '@/content/schema';
import { Monogram } from '@/components/ui/Monogram';

type Props = { person: Portfolio['person']; nav: Portfolio['nav'] };

export function Navbar({ person, nav }: Props) {
  return (
    <nav
      aria-label="Primary"
      className="fixed top-4 left-1/2 z-50 w-[min(1240px,calc(100%-32px))] -translate-x-1/2 rounded-full border border-violet/20 bg-ink-900/55 backdrop-blur-xl backdrop-saturate-150"
    >
      <div className="flex items-center justify-between gap-4 py-2.5 pr-3 pl-5">
        <a href="#top" className="flex items-center gap-3" aria-label={`${person.name} — home`}>
          <Monogram className="size-[26px]" />
          <span className="font-semibold whitespace-nowrap text-fg [font-stretch:96%]">
            {person.shortName} <span className="font-normal text-muted max-sm:hidden">| {person.role}</span>
          </span>
        </a>
        <div className="flex flex-wrap items-center justify-end gap-1">
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-[15px] text-soft transition-colors hover:bg-violet/15 hover:text-fg max-sm:hidden"
            >
              {link.label}
            </a>
          ))}
          <a
            href={nav.cta.href}
            className="rounded-full bg-fg px-4 py-2 text-[15px] font-semibold text-ink-950 transition-colors hover:bg-[#e9e4ff]"
          >
            {nav.cta.label}
          </a>
        </div>
      </div>
    </nav>
  );
}

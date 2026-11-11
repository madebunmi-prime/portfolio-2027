import type { Portfolio } from '@/content/schema';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { StackCard } from './StackCard';

export function Stack({ data }: { data: Portfolio['stack'] }) {
  return (
    <section id={data.id ?? 'stack'} className="flex flex-col gap-12 pt-24 md:pt-40">
      <SectionHeading eyebrow={data.eyebrow} title={data.title} intro={data.intro} />
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))] gap-4">
        {data.roles.map((role, i) => (
          <li key={`${role.title}-${i}`}>
            <StackCard role={role} index={i} />
          </li>
        ))}
      </ul>
    </section>
  );
}

'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { Portfolio } from '@/content/schema';
import { Glow } from '@/components/ui/Glow';
import { HTrack } from '@/components/ui/HTrack';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ACCENTS, withAlpha } from '@/lib/palette';

const ModelTile = dynamic(() => import('@/components/three/ModelTile'), { ssr: false });

type Item = Portfolio['capabilities']['items'][number];

function CapabilityCard({ item }: { item: Item }) {
  const [hover, setHover] = useState(false);
  const c = ACCENTS[item.accent];
  return (
    <Glow
      as="article"
      color={c}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      className="w-[min(310px,80%)] flex-none snap-start rounded-3xl p-px select-none"
      style={{ background: `linear-gradient(160deg, ${c}, rgb(34 30 78 / 0.6) 45%)` }}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[23px]" style={{ background: `radial-gradient(120% 60% at 50% 22%, ${withAlpha(c, 0.3)}, #0e0c28 62%)` }}>
        <div className="pointer-events-none aspect-[1/0.78] w-full">
          <ModelTile model={item.model} accent={item.accent} active={hover} />
        </div>
        <div className="flex flex-col gap-3 px-[22px] pb-6">
          <h3 className="font-display text-[1.4rem] leading-[1.1] font-semibold text-fg">{item.title}</h3>
          <p className="text-[15px] text-pretty text-body">{item.line}</p>
          <div className="flex flex-wrap gap-1.5">
            {item.tools.map((t) => (
              <span key={t} className="rounded-[7px] border border-ink-600 bg-ink-950/60 px-[9px] py-1 font-mono text-[11.5px] text-[#e4e1fa]">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </Glow>
  );
}

export function Capabilities({ data }: { data: Portfolio['capabilities'] }) {
  return (
    <section id={data.id} className="flex flex-col gap-9 pt-[clamp(96px,11vw,160px)]">
      <HTrack hint="Drag / swipe" header={<SectionHeading eyebrow={data.eyebrow} title={data.title} intro={data.intro} />}>
        {data.items.map((item) => (
          <CapabilityCard key={item.title} item={item} />
        ))}
      </HTrack>
    </section>
  );
}

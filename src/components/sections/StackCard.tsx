'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import type { Portfolio } from '@/content/schema';
import { Reveal } from '@/components/motion/Reveal';
import { ACCENTS, INK, withAlpha } from '@/lib/palette';

const ModelTile = dynamic(() => import('@/components/three/ModelTile'), { ssr: false });

type Props = { role: Portfolio['stack']['roles'][number]; index: number };

export function StackCard({ role, index }: Props) {
  const [active, setActive] = useState(false);
  const c = ACCENTS[role.accent];

  return (
    <Reveal
      delay={index * 0.08}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      className="h-full rounded-3xl p-px transition-[background] duration-500"
      style={{ background: `linear-gradient(160deg, ${c}, ${c} ${active ? '20%' : '0%'}, ${withAlpha(INK[700], 0.6)} 45%)` }}
    >
      <div
        className="flex h-full flex-col overflow-hidden rounded-[23px]"
        style={{ background: `radial-gradient(120% 70% at 50% 30%, ${withAlpha(c, 0.3)}, ${INK[900]} 65%)` }}
      >
        <div className="aspect-[1/0.95] w-full">
          <ModelTile model={role.model} accent={role.accent} active={active} />
        </div>
        <div className="flex flex-col items-center gap-1.5 px-5 pb-6 text-center">
          <h3 className="text-xl leading-tight font-bold text-fg [font-stretch:94%]">{role.title}</h3>
          <p className="font-mono text-xs tracking-[0.08em] text-muted uppercase">{role.tags.join(' · ')}</p>
        </div>
      </div>
    </Reveal>
  );
}

'use client';

import { useMemo } from 'react';
import { ACCENTS } from '@/lib/palette';
import { seeded } from '@/lib/utils';
import { Box } from './Box';
import { roomMaterials } from './materials';

const BOOK_COLORS = [ACCENTS.violet, ACCENTS.cyan, ACCENTS.pink, '#2a2366', '#3b2f8a', '#e9e4ff', '#1e1a4f'];
const SHELVES = [
  { y: 1.55, until: -2.2, seed: 5 },
  { y: 2.12, until: -2.6, seed: 6 },
];

export function Shelf() {
  const m = roomMaterials();
  const books = useMemo(
    () =>
      SHELVES.flatMap(({ y, until, seed }) => {
        const r = seeded(seed);
        const out: { x: number; y: number; w: number; h: number; color: string; tilt: number }[] = [];
        let x = -3.35;
        while (x < until) {
          const w = 0.04 + r() * 0.04;
          const h = 0.22 + r() * 0.12;
          out.push({ x: x + w / 2, y: y + 0.02 + h / 2, w, h, color: BOOK_COLORS[Math.floor(r() * BOOK_COLORS.length)]!, tilt: r() < 0.15 ? 0.25 : 0 });
          x += w + 0.008;
        }
        return out;
      }),
    [],
  );

  return (
    <group>
      {SHELVES.map(({ y }) => (
        <Box key={y} size={[1.4, 0.04, 0.3]} position={[-2.7, y, -2.88]} material={m.shelf} />
      ))}
      {books.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, -2.86]} rotation={[0, 0, b.tilt]} castShadow receiveShadow>
          <boxGeometry args={[b.w, b.h, 0.2]} />
          <meshStandardMaterial color={b.color} roughness={0.7} />
        </mesh>
      ))}
      {/* Trophy + crystal */}
      <mesh position={[-2.15, 1.62, -2.86]} material={m.gold} castShadow>
        <cylinderGeometry args={[0.06, 0.05, 0.1, 6]} />
      </mesh>
      <mesh position={[-2.15, 1.71, -2.86]} material={m.gold} castShadow>
        <sphereGeometry args={[0.05, 16, 12]} />
      </mesh>
      <mesh position={[-2.25, 2.25, -2.86]} material={m.crystal} castShadow>
        <icosahedronGeometry args={[0.11, 0]} />
      </mesh>
    </group>
  );
}

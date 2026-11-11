'use client';

import { useMemo } from 'react';
import { seeded } from '@/lib/utils';
import { roomMaterials } from './materials';

export function Plant() {
  const m = roomMaterials();
  const leaves = useMemo(() => {
    const r = seeded(23);
    return Array.from({ length: 9 }, (_, i) => {
      const a = (i / 9) * Math.PI * 2;
      return {
        position: [Math.cos(a) * 0.18, 0.62 + r() * 0.65, Math.sin(a) * 0.18] as [number, number, number],
        rotation: [r(), r(), r()] as [number, number, number],
        size: 0.17 + r() * 0.12,
      };
    });
  }, []);

  return (
    <group position={[-3.7, 0, -2.45]}>
      <mesh position={[0, 0.22, 0]} material={m.pot} castShadow receiveShadow>
        <cylinderGeometry args={[0.24, 0.18, 0.44, 7]} />
      </mesh>
      {leaves.map((l, i) => (
        <mesh key={i} position={l.position} rotation={l.rotation} scale={[0.7, 1.4, 0.7]} material={m.leaf} castShadow>
          <icosahedronGeometry args={[l.size, 0]} />
        </mesh>
      ))}
    </group>
  );
}

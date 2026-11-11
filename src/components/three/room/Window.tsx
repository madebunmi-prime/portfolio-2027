'use client';

import { useMemo } from 'react';
import { createSkyTexture } from '../sky';
import { Box } from './Box';
import { roomMaterials } from './materials';

export function Window() {
  const m = roomMaterials();
  const sky = useMemo(() => createSkyTexture(), []);
  return (
    <group position={[-4.46, 0, -0.6]}>
      <mesh position={[-0.03, 1.85, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.4, 1.9]} />
        <meshBasicMaterial map={sky} toneMapped={false} fog={false} />
      </mesh>
      <Box size={[0.1, 0.07, 2.56]} position={[0, 0.88, 0]} material={m.frame} />
      <Box size={[0.1, 0.07, 2.56]} position={[0, 2.82, 0]} material={m.frame} />
      <Box size={[0.1, 2, 0.07]} position={[0, 1.85, -1.25]} material={m.frame} />
      <Box size={[0.1, 2, 0.07]} position={[0, 1.85, 1.25]} material={m.frame} />
      <Box size={[0.06, 1.9, 0.035]} position={[0, 1.85, 0]} material={m.frame} />
      <Box size={[0.06, 0.035, 2.4]} position={[0, 1.85, 0]} material={m.frame} />
      <Box size={[0.26, 0.04, 2.7]} position={[0.08, 0.84, 0]} material={m.sill} />
    </group>
  );
}

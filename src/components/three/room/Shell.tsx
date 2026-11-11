'use client';

import { ACCENTS } from '@/lib/palette';
import { Box } from './Box';
import { roomMaterials } from './materials';

/** Floor, two walls, LED cove strips and the global lighting. */
export function Shell() {
  const m = roomMaterials();
  return (
    <group>
      <Box size={[9, 0.1, 7.4]} position={[0, -0.05, 0.2]} material={m.floor} />
      {Array.from({ length: 12 }, (_, i) => (
        <Box key={i} size={[0.01, 0.002, 7.4]} position={[-4.5 + i * 0.75, 0.001, 0.2]} material={m.seam} cast={false} />
      ))}
      <Box size={[9, 3.6, 0.14]} position={[0, 1.8, -3.07]} material={m.wall} />
      <Box size={[0.14, 3.6, 7.4]} position={[-4.57, 1.8, 0.2]} material={m.wall} />
      <Box size={[9, 0.1, 0.04]} position={[0, 0.05, -2.99]} material={m.trim} />
      <Box size={[0.04, 0.1, 7.4]} position={[-4.49, 0.05, 0.2]} material={m.trim} />
      <Box size={[9, 0.025, 0.025]} position={[0, 3.55, -2.98]} material={m.neonViolet} cast={false} />
      <Box size={[0.025, 0.025, 7.4]} position={[-4.48, 3.55, 0.2]} material={m.neonIndigo} cast={false} />

      <pointLight color={ACCENTS.violet} intensity={6} distance={7} decay={1.4} position={[0.5, 3.2, -2.6]} />
      <hemisphereLight args={['#6b5cff', '#0b0820', 0.5]} />
      {/* Moonlight through the window */}
      <directionalLight
        color="#9aa6ff"
        intensity={1.6}
        position={[-9, 4.5, -0.8]}
        castShadow
        shadow-mapSize={[1536, 1536]}
        shadow-bias={-0.0008}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-near={1}
        shadow-camera-far={20}
      />
    </group>
  );
}

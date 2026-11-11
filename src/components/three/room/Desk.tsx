'use client';

import { ACCENTS } from '@/lib/palette';
import { Box } from './Box';
import { roomMaterials } from './materials';

export function Desk() {
  const m = roomMaterials();
  return (
    <group>
      <Box size={[2.7, 0.06, 0.86]} position={[0.4, 0.76, -2.55]} material={m.desk} />
      {[-0.88, 1.68].map((x) => (
        <group key={x}>
          <Box size={[0.06, 0.73, 0.06]} position={[x, 0.37, -2.2]} material={m.metal} />
          <Box size={[0.06, 0.73, 0.06]} position={[x, 0.37, -2.9]} material={m.metal} />
          <Box size={[0.06, 0.06, 0.76]} position={[x, 0.04, -2.55]} material={m.metal} />
        </group>
      ))}
      <Box size={[2.5, 0.05, 0.04]} position={[0.4, 0.7, -2.92]} material={m.metal} />
      <Box size={[0.5, 0.52, 0.74]} position={[-0.5, 0.47, -2.55]} material={m.drawer} />
      {[0.6, 0.38].map((y) => (
        <Box key={y} size={[0.42, 0.006, 0.004]} position={[-0.5, y, -2.18]} material={m.neonCyanSoft} cast={false} />
      ))}
      {/* Under-desk glow */}
      <Box size={[2.55, 0.018, 0.018]} position={[0.4, 0.715, -2.13]} material={m.neonPink} cast={false} />
      <pointLight color={ACCENTS.pink} intensity={4} distance={3} decay={1.4} position={[0.4, 0.45, -2.0]} />
    </group>
  );
}

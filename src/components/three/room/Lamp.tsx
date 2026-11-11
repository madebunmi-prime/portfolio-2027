'use client';

import { DoubleSide } from 'three';
import { Box } from './Box';
import { roomMaterials } from './materials';

/** Articulated desk lamp — the scene's only warm light, and it casts shadows. */
export function Lamp() {
  const m = roomMaterials();
  return (
    <group position={[1.52, 0, -2.8]}>
      <mesh position={[0, 0.8, 0]} material={m.lamp} castShadow>
        <cylinderGeometry args={[0.09, 0.1, 0.025, 24]} />
      </mesh>
      <Box size={[0.022, 0.55, 0.022]} position={[0, 1.06, 0.08]} rotation={[0.35, 0, 0]} material={m.lamp} />
      <Box size={[0.022, 0.45, 0.022]} position={[-0.1, 1.38, 0.38]} rotation={[1.15, 0, 0.3]} material={m.lamp} />
      <mesh position={[-0.2, 1.5, 0.55]} rotation={[0.4, 0, 0]} castShadow>
        <coneGeometry args={[0.09, 0.16, 24, 1, true]} />
        <meshStandardMaterial color="#16133a" roughness={0.3} metalness={0.8} side={DoubleSide} />
      </mesh>
      <mesh position={[-0.2, 1.46, 0.56]} material={m.bulb}>
        <sphereGeometry args={[0.035, 16, 12]} />
      </mesh>
      <pointLight
        color="#ffb86b"
        intensity={5}
        distance={3.2}
        decay={1.4}
        position={[-0.2, 1.4, 0.6]}
        castShadow
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.002}
      />
    </group>
  );
}

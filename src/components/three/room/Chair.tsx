'use client';

import { Box } from './Box';
import { roomMaterials } from './materials';

/** Task chair + round rug. */
export function Chair() {
  const m = roomMaterials();
  return (
    <group>
      <mesh position={[0.35, 0.006, -1.35]} material={m.rug} receiveShadow>
        <cylinderGeometry args={[1.7, 1.7, 0.012, 64]} />
      </mesh>
      <mesh position={[0.35, 0.014, -1.35]} rotation={[Math.PI / 2, 0, 0]} material={m.rugRing}>
        <torusGeometry args={[1.5, 0.012, 6, 96]} />
      </mesh>

      <group position={[0.4, 0, -1.45]} rotation={[0, 0.5, 0]}>
        <Box size={[0.56, 0.09, 0.52]} position={[0, 0.52, 0]} material={m.fabric} />
        <Box size={[0.52, 0.7, 0.07]} position={[0, 0.97, 0.27]} rotation={[-0.1, 0, 0]} material={m.fabric} />
        <Box size={[0.04, 0.5, 0.012]} position={[0, 0.97, 0.31]} rotation={[-0.1, 0, 0]} material={m.chairStripe} cast={false} />
        <mesh position={[0, 0.29, 0]} material={m.metal} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.4, 12]} />
        </mesh>
        {Array.from({ length: 5 }, (_, i) => {
          const a = (i / 5) * Math.PI * 2;
          return (
            <group key={i}>
              <Box size={[0.32, 0.03, 0.04]} position={[Math.cos(a) * 0.16, 0.07, Math.sin(a) * 0.16]} rotation={[0, -a, 0]} material={m.metal} />
              <mesh position={[Math.cos(a) * 0.31, 0.03, Math.sin(a) * 0.31]} material={m.black}>
                <sphereGeometry args={[0.03, 12, 8]} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}

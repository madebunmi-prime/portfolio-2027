'use client';

import type { Material } from 'three';

type Vec3 = [number, number, number];

type Props = {
  size: Vec3;
  position: Vec3;
  rotation?: Vec3;
  material: Material;
  /** Neon strips shouldn't cast shadows */
  cast?: boolean;
};

export function Box({ size, position, rotation, material, cast = true }: Props) {
  return (
    <mesh position={position} rotation={rotation} material={material} castShadow={cast} receiveShadow>
      <boxGeometry args={size} />
    </mesh>
  );
}

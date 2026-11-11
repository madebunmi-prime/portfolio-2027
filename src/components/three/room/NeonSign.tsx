'use client';

import { useMemo } from 'react';
import { CurvePath, LineCurve3, TubeGeometry, Vector3 } from 'three';
import { ACCENTS } from '@/lib/palette';
import { Box } from './Box';
import { roomMaterials } from './materials';

/** `</>` drawn as three polylines. */
const STROKES: [number, number][][] = [
  [[-0.42, 0.24], [-0.72, 0], [-0.42, -0.24]],
  [[-0.14, -0.3], [0.14, 0.3]],
  [[0.42, 0.24], [0.72, 0], [0.42, -0.24]],
];

export function NeonSign() {
  const m = roomMaterials();
  const tubes = useMemo(
    () =>
      STROKES.map((pts) => {
        const path = new CurvePath<Vector3>();
        for (let i = 1; i < pts.length; i++) {
          const [ax, ay] = pts[i - 1]!;
          const [bx, by] = pts[i]!;
          path.add(new LineCurve3(new Vector3(ax, ay, 0), new Vector3(bx, by, 0)));
        }
        return new TubeGeometry(path, 24, 0.022, 8, false);
      }),
    [],
  );

  return (
    <group position={[0.3, 2.45, -2.97]}>
      <Box size={[1.7, 0.85, 0.02]} position={[0, 0, -0.02]} material={m.frame} cast={false} />
      {tubes.map((geometry, i) => (
        <mesh key={i} geometry={geometry} material={m.neonCyan} />
      ))}
      <pointLight color={ACCENTS.cyan} intensity={4} distance={3.5} decay={1.4} position={[0, 0, 0.37]} />
    </group>
  );
}

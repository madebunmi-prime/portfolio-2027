'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, type Group, type Points } from 'three';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { ACCENTS } from '@/lib/palette';
import { seeded } from '@/lib/utils';

type Vec3 = [number, number, number];

const FLOATERS: { color: string; position: Vec3; shape: 'octa' | 'torus' | 'ico' | 'knot' | 'dodeca' }[] = [
  { color: ACCENTS.violet, position: [-1.4, 2.5, -2.2], shape: 'octa' },
  { color: ACCENTS.cyan, position: [2.1, 2.2, -2.0], shape: 'torus' },
  { color: ACCENTS.pink, position: [2.5, 1.6, -1.2], shape: 'ico' },
  { color: ACCENTS.amber, position: [-1.9, 1.6, -1.4], shape: 'knot' },
  { color: ACCENTS.green, position: [1.2, 2.75, -2.4], shape: 'dodeca' },
];

function Shape({ shape }: { shape: (typeof FLOATERS)[number]['shape'] }) {
  switch (shape) {
    case 'octa': return <octahedronGeometry args={[0.13, 0]} />;
    case 'torus': return <torusGeometry args={[0.11, 0.035, 16, 48]} />;
    case 'ico': return <icosahedronGeometry args={[0.11, 0]} />;
    case 'knot': return <torusKnotGeometry args={[0.08, 0.025, 96, 12]} />;
    case 'dodeca': return <dodecahedronGeometry args={[0.1, 0]} />;
  }
}

/** Floating glossy shapes + drifting dust motes. */
export function Atmosphere() {
  const reduced = useReducedMotion();
  const floaters = useRef<Group>(null);
  const dust = useRef<Points>(null);

  const positions = useMemo(() => {
    const r = seeded(31);
    const arr = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      arr[i * 3] = -4.4 + r() * 8.8;
      arr[i * 3 + 1] = r() * 3.4;
      arr[i * 3 + 2] = -2.9 + r() * 6;
    }
    return arr;
  }, []);

  useFrame(({ clock }, dt) => {
    if (reduced) return;
    const t = clock.elapsedTime;
    floaters.current?.children.forEach((child, i) => {
      child.position.y = FLOATERS[i]!.position[1] + Math.sin(t * 1.1 + i * 1.3) * 0.06;
      child.rotation.y += dt * 0.7;
      child.rotation.x += dt * 0.3;
    });
    if (dust.current) {
      dust.current.rotation.y = Math.sin(t * 0.05) * 0.05;
      dust.current.position.y = Math.sin(t * 0.2) * 0.04;
    }
  });

  return (
    <group>
      <group ref={floaters}>
        {FLOATERS.map((f, i) => (
          <mesh key={i} position={f.position} castShadow>
            <Shape shape={f.shape} />
            <meshPhysicalMaterial color={f.color} roughness={0.15} metalness={0.2} clearcoat={1} clearcoatRoughness={0.08} emissive={f.color} emissiveIntensity={0.35} />
          </mesh>
        ))}
      </group>
      <points ref={dust}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#c4b5fd" size={0.012} transparent opacity={0.55} blending={AdditiveBlending} depthWrite={false} />
      </points>
    </group>
  );
}

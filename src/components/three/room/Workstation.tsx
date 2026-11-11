'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instance, Instances } from '@react-three/drei';
import type { MeshStandardMaterial } from 'three';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import type { LiveScreens } from '../screens/LiveScreens';
import { Box } from './Box';
import { roomMaterials } from './materials';

/** Monitors (showing the scroll-driven live screens), laptop, backlit keyboard, mouse and mug. */
export function Workstation({ screens }: { screens: LiveScreens }) {
  const m = roomMaterials();
  const reduced = useReducedMotion();
  const screen = useRef<MeshStandardMaterial>(null);
  const tex = { code: screens.main.tex, dash: screens.side.tex, term: screens.laptop.tex };
  const keys = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let r = 0; r < 5; r++) for (let c = 0; c < 15; c++) out.push([-0.03 + c * 0.04, 0.817, -2.35 + r * 0.04]);
    return out;
  }, []);

  useFrame(({ clock }) => {
    if (!reduced && screen.current) screen.current.emissiveIntensity = 1.2 + Math.sin(clock.elapsedTime * 2.3) * 0.03;
  });

  return (
    <group>
      {/* Main monitor */}
      <group position={[0.25, 0, -2.74]}>
        <Box size={[1.16, 0.68, 0.035]} position={[0, 1.3, 0]} material={m.black} />
        <mesh position={[0, 1.3, 0.019]}>
          <planeGeometry args={[1.12, 0.63]} />
          <meshStandardMaterial ref={screen} color="#000000" emissive="#ffffff" emissiveMap={tex.code} emissiveIntensity={1.25} />
        </mesh>
        <Box size={[0.06, 0.42, 0.04]} position={[0, 0.98, -0.04]} material={m.metal} />
        <Box size={[0.32, 0.015, 0.2]} position={[0, 0.797, 0]} material={m.metal} />
      </group>

      {/* Portrait monitor */}
      <group position={[1.3, 0, -2.6]} rotation={[0, -0.45, 0]}>
        <Box size={[0.5, 0.82, 0.035]} position={[0, 1.33, 0]} material={m.black} />
        <mesh position={[0, 1.33, 0.019]}>
          <planeGeometry args={[0.47, 0.78]} />
          <meshStandardMaterial color="#000000" emissive="#ffffff" emissiveMap={tex.dash} emissiveIntensity={1.25} />
        </mesh>
        <Box size={[0.05, 0.32, 0.04]} position={[0, 0.95, -0.04]} material={m.metal} />
        <Box size={[0.24, 0.015, 0.18]} position={[0, 0.797, 0]} material={m.metal} />
      </group>
      <pointLight color="#7dd3fc" intensity={3.5} distance={3.2} decay={1.4} position={[0.45, 1.3, -2.25]} />

      {/* Laptop */}
      <group position={[-0.62, 0.795, -2.42]} rotation={[0, 0.35, 0]}>
        <Box size={[0.52, 0.018, 0.35]} position={[0, 0, 0]} material={m.metal} />
        <group position={[0, 0.01, -0.17]} rotation={[-0.32, 0, 0]}>
          <Box size={[0.52, 0.34, 0.012]} position={[0, 0.17, 0]} material={m.metal} />
          <mesh position={[0, 0.17, 0.007]}>
            <planeGeometry args={[0.48, 0.3]} />
            <meshStandardMaterial color="#000000" emissive="#ffffff" emissiveMap={tex.term} emissiveIntensity={1.25} />
          </mesh>
        </group>
      </group>

      {/* Keyboard + underglow */}
      <Box size={[0.66, 0.022, 0.22]} position={[0.25, 0.8, -2.27]} material={m.keyboard} />
      <Box size={[0.67, 0.004, 0.23]} position={[0.25, 0.788, -2.27]} material={m.keyGlow} cast={false} />
      <Instances limit={keys.length} castShadow>
        <boxGeometry args={[0.032, 0.012, 0.032]} />
        <primitive object={m.key} attach="material" />
        {keys.map((p, i) => (
          <Instance key={i} position={p} />
        ))}
      </Instances>

      {/* Mouse, pad, mug */}
      <Box size={[0.32, 0.004, 0.26]} position={[0.82, 0.792, -2.28]} material={m.pad} cast={false} />
      <mesh position={[0.82, 0.805, -2.28]} scale={[0.65, 0.35, 1]} material={m.key} castShadow>
        <sphereGeometry args={[0.05, 24, 16]} />
      </mesh>
      <mesh position={[-0.12, 0.845, -2.2]} material={m.ceramic} castShadow>
        <cylinderGeometry args={[0.045, 0.04, 0.11, 24]} />
      </mesh>
      <mesh position={[-0.07, 0.85, -2.2]} rotation={[0, Math.PI / 2, 0]} material={m.ceramic}>
        <torusGeometry args={[0.03, 0.008, 8, 20]} />
      </mesh>
    </group>
  );
}

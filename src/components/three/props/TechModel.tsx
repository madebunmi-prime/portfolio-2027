'use client';

import { useMemo, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import { LineCurve3, MathUtils, QuadraticBezierCurve3, Vector3, type Group } from 'three';
import type { Accent, ModelName } from '@/content/schema';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import { ACCENTS } from '@/lib/palette';

function Gloss({ color, glow = 0, flat = false }: { color: string; glow?: number; flat?: boolean }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.16}
      metalness={0.15}
      clearcoat={1}
      clearcoatRoughness={0.06}
      iridescence={0.25}
      emissive={color}
      emissiveIntensity={glow}
      flatShading={flat}
    />
  );
}

function Cube({ c }: { c: string }) {
  const s = 0.5;
  const o = (s + 0.04) / 2;
  const cells: ReactNode[] = [];
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) {
    const hot = x > 0 && y > 0 && z > 0;
    cells.push(
      <mesh key={`${x}${y}${z}`} position={hot ? [x * o + 0.34, y * o + 0.34, z * o + 0.34] : [x * o, y * o, z * o]} rotation={hot ? [0.4, 0.5, 0.2] : [0, 0, 0]}>
        <boxGeometry args={[s, s, s]} />
        <Gloss color={hot ? ACCENTS.cyan : c} glow={hot ? 0.4 : 0} />
      </mesh>,
    );
  }
  return <group rotation={[0.5, -0.6, 0]}>{cells}</group>;
}

function Hex({ c }: { c: string }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh><cylinderGeometry args={[0.95, 0.95, 0.4, 6]} /><Gloss color={c} flat /></mesh>
      <mesh><cylinderGeometry args={[0.48, 0.6, 0.62, 6]} /><Gloss color="#0f3b2c" flat /></mesh>
    </group>
  );
}

function Interlock({ c }: { c: string }) {
  const arc = Math.PI * 1.4;
  return (
    <group>
      <mesh position={[-0.22, 0.27, 0.08]} rotation={[0, 0, Math.PI * 0.15]}>
        <torusGeometry args={[0.5, 0.18, 32, 96, arc]} /><Gloss color={c} />
      </mesh>
      <mesh position={[0.22, -0.27, -0.08]} rotation={[0, 0, Math.PI * 1.15]}>
        <torusGeometry args={[0.5, 0.18, 32, 96, arc]} /><Gloss color={ACCENTS.amber} />
      </mesh>
    </group>
  );
}

function Orbitals({ c }: { c: string }) {
  return (
    <group>
      <mesh><sphereGeometry args={[0.22, 48, 32]} /><Gloss color={c} glow={0.5} /></mesh>
      {[0, 1, 2].map((i) => (
        <group key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
          <mesh scale={[1, 0.38, 1]}><torusGeometry args={[1, 0.055, 24, 160]} /><Gloss color={c} /></mesh>
        </group>
      ))}
    </group>
  );
}

function Branch({ c }: { c: string }) {
  const { nodes, trunk, fork } = useMemo(() => {
    const nodes = [new Vector3(-0.55, -0.85, 0), new Vector3(-0.55, 0.85, 0), new Vector3(0.6, 0.15, 0)] as const;
    return {
      nodes,
      trunk: new LineCurve3(nodes[0], nodes[1]),
      fork: new QuadraticBezierCurve3(new Vector3(-0.55, -0.45, 0), new Vector3(0.6, -0.45, 0), nodes[2]),
    };
  }, []);
  return (
    <group>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}><sphereGeometry args={[0.22, 48, 32]} /><Gloss color={i === 2 ? c : '#e9e4ff'} glow={i === 2 ? 0.4 : 0} /></mesh>
      ))}
      <mesh><tubeGeometry args={[trunk, 8, 0.08, 20]} /><Gloss color={c} /></mesh>
      <mesh><tubeGeometry args={[fork, 48, 0.08, 20]} /><Gloss color={c} /></mesh>
    </group>
  );
}

function Orb({ c }: { c: string }) {
  return (
    <group>
      <mesh><sphereGeometry args={[0.95, 96, 64]} /><meshPhysicalMaterial color={c} roughness={0.08} clearcoat={1} iridescence={0.6} emissive="#2a1670" emissiveIntensity={0.4} /></mesh>
      <mesh>
        <icosahedronGeometry args={[1.25, 1]} />
        <meshBasicMaterial transparent opacity={0} />
        <Edges color={ACCENTS.cyan} />
      </mesh>
      <mesh rotation={[1.25, 0, 0]}><torusGeometry args={[1.6, 0.03, 16, 200]} /><Gloss color={ACCENTS.pink} glow={0.6} /></mesh>
    </group>
  );
}

const MODELS: Record<ModelName, (props: { c: string }) => ReactNode> = {
  cube: Cube,
  hex: Hex,
  interlock: Interlock,
  orbitals: Orbitals,
  branch: Branch,
  orb: Orb,
};

type Props = { model: ModelName; accent: Accent; active?: boolean };

export function TechModel({ model, accent, active = false }: Props) {
  const group = useRef<Group>(null);
  const spin = useRef(0.45);
  const reduced = useReducedMotion();
  const Model = MODELS[model];

  useFrame(({ clock }, dt) => {
    const g = group.current;
    if (!g || reduced) return;
    spin.current = MathUtils.damp(spin.current, active ? 2.2 : 0.45, 4, dt);
    g.rotation.y += dt * spin.current;
    g.position.y = Math.sin(clock.elapsedTime * 1.1) * 0.06;
  });

  return (
    <group ref={group}>
      <Model c={ACCENTS[accent]} />
    </group>
  );
}

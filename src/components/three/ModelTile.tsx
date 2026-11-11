'use client';

import { Environment, Lightformer, PerspectiveCamera, View } from '@react-three/drei';
import type { Accent, ModelName } from '@/content/schema';
import { ACCENTS } from '@/lib/palette';
import { TechModel } from './props/TechModel';

type Props = { model: ModelName; accent: Accent; active?: boolean };

/** A DOM-sized slot rendered by the shared <ViewCanvas>. Fills its parent. */
export default function ModelTile({ model, accent, active = false }: Props) {
  const tint = ACCENTS[accent];
  const isOrb = model === 'orb';

  return (
    <View className="size-full">
      <PerspectiveCamera makeDefault fov={isOrb ? 30 : 33} position={[0, 0.3, isOrb ? 6 : 4.8]} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[2, 3, 4]} intensity={1.4} />
      <pointLight color={tint} intensity={30} distance={10} position={[-2, 1, -2.5]} />
      <pointLight color={ACCENTS.cyan} intensity={14} distance={10} position={[2.5, -1, -2]} />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={2.5} position={[0, 3, 3]} scale={[6, 2, 1]} />
        <Lightformer form="ring" intensity={1.5} color={tint} position={[-3, 0, -2]} scale={2} />
      </Environment>
      <TechModel model={model} accent={accent} active={active} />
    </View>
  );
}

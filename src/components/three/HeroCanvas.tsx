'use client';

import type { RefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { CameraRig } from './CameraRig';
import { RoomEnv } from './RoomEnv';
import { Room } from './room/Room';

type Props = { progress: RefObject<number>; bloom?: number };

export default function HeroCanvas({ progress, bloom = 0.85 }: Props) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 38, near: 0.05, far: 60, position: [5.6, 3.1, 6.6] }}
    >
      <color attach="background" args={['#05041a']} />
      <fogExp2 attach="fog" args={['#05041a', 0.05]} />
      <RoomEnv intensity={0.18} />
      <Room />
      <CameraRig progress={progress} />
      <EffectComposer multisampling={4}>
        <Bloom intensity={bloom} luminanceThreshold={0.78} luminanceSmoothing={0.25} mipmapBlur />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </Canvas>
  );
}

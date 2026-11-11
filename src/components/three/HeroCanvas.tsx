'use client';

import { useEffect, useMemo, type RefObject } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import type { Portfolio } from '@/content/schema';
import type { HeroProgress } from '@/lib/story';
import { CameraRig } from './CameraRig';
import { RoomEnv } from './RoomEnv';
import { Room } from './room/Room';
import { LiveScreens } from './screens/LiveScreens';

type Props = { progress: RefObject<HeroProgress>; screens: Portfolio['hero']['screens']; bloom?: number };

function ScreenDriver({ screens, progress }: { screens: LiveScreens; progress: RefObject<HeroProgress> }) {
  useFrame(({ clock }) => screens.update(progress.current?.smooth ?? 0, clock.elapsedTime));
  return null;
}

export default function HeroCanvas({ progress, screens: content, bloom = 0.85 }: Props) {
  const screens = useMemo(() => new LiveScreens(content), [content]);
  useEffect(() => () => screens.dispose(), [screens]);
  // Redraw once fonts arrive so canvas text uses Geist / Clash Display.
  useEffect(() => {
    document.fonts?.ready.then(() => screens.draw(progress.current?.smooth ?? 0, 0, true));
  }, [screens, progress]);

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
      <Room screens={screens} />
      <CameraRig progress={progress} />
      <ScreenDriver screens={screens} progress={progress} />
      <EffectComposer multisampling={4}>
        <Bloom intensity={bloom} luminanceThreshold={0.78} luminanceSmoothing={0.25} mipmapBlur />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </Canvas>
  );
}

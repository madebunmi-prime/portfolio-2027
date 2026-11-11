'use client';

import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';

/**
 * One fixed, transparent WebGL canvas that renders every <ModelTile> on the page
 * through drei's <View> scissoring — a single GPU context instead of one per card.
 */
export default function ViewCanvas() {
  return (
    <Canvas
      eventSource={document.body}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none' }}
    >
      <View.Port />
    </Canvas>
  );
}

'use client';

import { useMemo, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { CatmullRomCurve3, MathUtils, PerspectiveCamera, Vector3 } from 'three';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';
import type { HeroProgress } from '@/lib/story';

const v = (x: number, y: number, z: number) => new Vector3(x, y, z);

/** Establish → desk → shelf → right into the main monitor. Edit these to re-author the journey. */
const PATH = new CatmullRomCurve3([v(5.6, 3.1, 6.6), v(3.2, 2.2, 3.6), v(-1.6, 1.8, 2.0), v(0.25, 1.3, -1.92)]);
const LOOK = new CatmullRomCurve3([v(-0.6, 1.3, -1.6), v(0.0, 1.2, -2.0), v(0.4, 1.25, -2.4), v(0.25, 1.3, -2.74)]);

/** Damps scroll progress into `progress.smooth` (also read by the screens) and flies the camera. */
export function CameraRig({ progress }: { progress: RefObject<HeroProgress> }) {
  const reduced = useReducedMotion();
  const pos = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);

  useFrame((state, dt) => {
    const p = progress.current;
    if (!p) return;
    p.smooth = reduced ? p.target : MathUtils.damp(p.smooth, p.target, 4, dt);
    PATH.getPointAt(p.smooth, pos);
    LOOK.getPointAt(p.smooth, look);

    // Pointer parallax, fading out as we dolly into the screen.
    const k = reduced ? 0 : 1 - p.smooth * 0.8;
    state.camera.position.set(pos.x + state.pointer.x * 0.35 * k, pos.y + state.pointer.y * 0.2 * k, pos.z);
    state.camera.lookAt(look);

    const cam = state.camera as PerspectiveCamera;
    const fov = state.size.width / state.size.height < 1 ? 52 : 38;
    if (cam.fov !== fov) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}

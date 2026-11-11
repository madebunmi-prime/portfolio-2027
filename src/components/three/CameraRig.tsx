'use client';

import { useMemo, useRef, type RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { CatmullRomCurve3, MathUtils, PerspectiveCamera, Vector3 } from 'three';
import { useReducedMotion } from '@/lib/hooks/useReducedMotion';

const v = (x: number, y: number, z: number) => new Vector3(x, y, z);

/** Establish → desk → shelf → into the monitor. Edit these to re-author the journey. */
const PATH = new CatmullRomCurve3([v(5.6, 3.1, 6.6), v(3.2, 2.2, 3.6), v(-1.6, 1.8, 2.0), v(0.35, 1.32, -1.05)]);
const LOOK = new CatmullRomCurve3([v(-0.6, 1.3, -1.6), v(0.0, 1.2, -2.0), v(0.4, 1.25, -2.4), v(0.25, 1.28, -2.72)]);

export function CameraRig({ progress }: { progress: RefObject<number> }) {
  const reduced = useReducedMotion();
  const t = useRef(0);
  const pos = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);

  useFrame((state, dt) => {
    const target = progress.current ?? 0;
    t.current = reduced ? target : MathUtils.damp(t.current, target, 4, dt);
    PATH.getPointAt(t.current, pos);
    LOOK.getPointAt(t.current, look);

    // Pointer parallax, fading out as we dolly into the screen.
    const k = reduced ? 0 : 1 - t.current * 0.8;
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

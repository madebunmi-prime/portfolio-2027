import { MeshStandardMaterial, type MeshStandardMaterialParameters } from 'three';
import { ACCENTS } from '@/lib/palette';

const std = (color: string, roughness = 0.7, metalness = 0, extra: MeshStandardMaterialParameters = {}) =>
  new MeshStandardMaterial({ color, roughness, metalness, ...extra });

/** Unlit-looking emissive strip; values > 1 feed the bloom pass. */
const neon = (color: string, intensity = 3) =>
  new MeshStandardMaterial({ color: '#000000', emissive: color, emissiveIntensity: intensity, toneMapped: false });

function create() {
  return {
    floor: std('#1b1742', 0.42, 0.15),
    seam: std('#120f33', 0.5),
    wall: std('#1c1948', 0.92),
    trim: std('#100e2c', 0.6),
    frame: std('#0d0b26', 0.5, 0.4),
    sill: std('#221d52', 0.5),
    desk: std('#2a2160', 0.38, 0.05),
    drawer: std('#221b52', 0.5),
    metal: std('#1b1840', 0.3, 0.85),
    black: std('#07061a', 0.35, 0.4),
    keyboard: std('#110f2e', 0.5, 0.3),
    key: std('#2a2560', 0.45),
    pad: std('#14113a', 0.9),
    ceramic: std('#f4f1ff', 0.3),
    lamp: std('#16133a', 0.3, 0.8),
    shelf: std('#2a2160', 0.45),
    gold: std(ACCENTS.amber, 0.25, 0.9),
    crystal: std('#e9e4ff', 0.2, 0.6, { flatShading: true }),
    pot: std('#2a2160', 0.6, 0, { flatShading: true }),
    leaf: std('#2fa37a', 0.6, 0, { flatShading: true }),
    rug: std('#2c2470', 0.95),
    rugRing: std(ACCENTS.violet, 0.8),
    fabric: std('#2b245e', 0.85),
    neonViolet: neon(ACCENTS.violet, 5),
    neonIndigo: neon('#6d5cf6', 4),
    neonPink: neon(ACCENTS.pink, 5),
    neonCyan: neon(ACCENTS.cyan, 4.5),
    neonCyanSoft: neon(ACCENTS.cyan, 1.5),
    keyGlow: neon(ACCENTS.violet, 2.5),
    chairStripe: neon(ACCENTS.violet, 2),
    bulb: neon('#ffd29a', 6),
  };
}

let cache: ReturnType<typeof create> | null = null;

/** Shared material set — created once, reused by every room component. */
export function roomMaterials() {
  return (cache ??= create());
}

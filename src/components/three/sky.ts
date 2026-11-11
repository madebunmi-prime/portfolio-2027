import { CanvasTexture, SRGBColorSpace } from 'three';
import { seeded } from '@/lib/utils';
import { ACCENTS } from '@/lib/palette';

type Painter = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

function paint(w: number, h: number, fn: Painter): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (ctx) fn(ctx, w, h);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Night sky with stars, moon glow and a lit skyline. */
export const createSkyTexture = () =>
  paint(1024, 800, (x, w, h) => {
    const r = seeded(19);
    const g = x.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#0a0830');
    g.addColorStop(0.65, '#2b1670');
    g.addColorStop(1, '#6a2a8f');
    x.fillStyle = g;
    x.fillRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) {
      x.fillStyle = `rgba(255,255,255,${0.3 + r() * 0.7})`;
      const s = r() * 2.2;
      x.fillRect(r() * w, r() * h * 0.6, s, s);
    }
    const moon = x.createRadialGradient(760, 170, 10, 760, 170, 160);
    moon.addColorStop(0, 'rgba(230,225,255,1)');
    moon.addColorStop(0.28, 'rgba(200,190,255,0.9)');
    moon.addColorStop(0.3, 'rgba(160,140,255,0.35)');
    moon.addColorStop(1, 'rgba(120,90,255,0)');
    x.fillStyle = moon;
    x.fillRect(560, 0, 400, 360);
    for (let i = 0; i < 26; i++) {
      const bw = 30 + r() * 70;
      const bh = 120 + r() * 300;
      const bx = i * 40 - 20;
      const by = h - bh;
      x.fillStyle = i % 2 ? '#0b0924' : '#100c30';
      x.fillRect(bx, by, bw, bh);
      for (let yy = by + 12; yy < h - 8; yy += 16)
        for (let xx = bx + 6; xx < bx + bw - 6; xx += 12)
          if (r() < 0.22) {
            x.fillStyle = r() < 0.5 ? ACCENTS.amber : '#a5f3fc';
            x.fillRect(xx, yy, 5, 7);
          }
    }
  });

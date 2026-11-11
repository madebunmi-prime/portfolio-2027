import { CanvasTexture, SRGBColorSpace } from 'three';
import { ACCENTS } from '@/lib/palette';
import { seeded } from '@/lib/utils';

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

const { violet, cyan, pink, amber, green } = ACCENTS;

/** Abstract code editor — syntax "tokens" as coloured bars. */
export const createCodeTexture = () =>
  paint(1024, 576, (x, w, h) => {
    const r = seeded(7);
    x.fillStyle = '#0b0a22';
    x.fillRect(0, 0, w, h);
    x.fillStyle = '#16133a';
    x.fillRect(0, 0, w, 34);
    [pink, amber, green].forEach((c, i) => {
      x.fillStyle = c;
      x.beginPath();
      x.arc(22 + i * 22, 17, 6, 0, Math.PI * 2);
      x.fill();
    });
    x.fillStyle = '#211d4e';
    x.fillRect(200, 0, 180, 34);
    x.fillStyle = '#a78bfa';
    x.fillRect(220, 14, 120, 6);
    x.fillStyle = '#100e2c';
    x.fillRect(0, 34, 180, h);
    for (let i = 0; i < 16; i++) {
      x.fillStyle = i === 3 ? violet : '#3b3670';
      x.fillRect(22 + (i % 4 ? 14 : 0), 56 + i * 28, 50 + r() * 80, 8);
    }
    const tokens = [violet, cyan, pink, amber, '#d6d3f0', green, '#6b66a3'];
    let indent = 0;
    for (let l = 0; l < 19; l++) {
      const y = 56 + l * 26;
      x.fillStyle = '#3b3670';
      x.fillRect(196, y, 18, 8);
      if (r() < 0.12) {
        indent = Math.max(0, indent - 1);
        continue;
      }
      let px = 240 + indent * 30;
      const n = 2 + Math.floor(r() * 5);
      for (let k = 0; k < n; k++) {
        const tw = 20 + r() * 90;
        x.fillStyle = tokens[Math.floor(r() * tokens.length)]!;
        x.fillRect(px, y, tw, 9);
        px += tw + 12;
      }
      if (r() < 0.3) indent = Math.min(4, indent + 1);
    }
    x.fillStyle = 'rgba(139,92,246,0.18)';
    x.fillRect(180, 56 + 7 * 26 - 8, w, 26);
    x.fillStyle = '#ffffff';
    x.fillRect(560, 56 + 7 * 26 - 4, 3, 18);
  });

/** Portrait analytics dashboard. */
export const createDashboardTexture = () =>
  paint(512, 820, (x, w, h) => {
    const r = seeded(11);
    x.fillStyle = '#0b0a22';
    x.fillRect(0, 0, w, h);
    x.fillStyle = '#d6d3f0';
    x.fillRect(28, 30, 160, 12);
    x.fillStyle = '#6b66a3';
    x.fillRect(28, 54, 220, 8);
    ([[28, violet], [190, cyan], [352, pink]] as const).forEach(([px, c]) => {
      x.fillStyle = '#16133a';
      x.fillRect(px, 90, 140, 90);
      x.fillStyle = c;
      x.fillRect(px + 14, 108, 70, 22);
      x.fillStyle = '#6b66a3';
      x.fillRect(px + 14, 146, 100, 8);
    });
    x.fillStyle = '#16133a';
    x.fillRect(28, 210, 464, 250);
    x.strokeStyle = cyan;
    x.lineWidth = 4;
    x.beginPath();
    for (let i = 0; i <= 20; i++) {
      const px = 44 + i * 21.6;
      const py = 420 - (Math.sin(i * 0.6) * 0.4 + 0.5 + i * 0.02) * 150 - r() * 30;
      if (i) x.lineTo(px, py);
      else x.moveTo(px, py);
    }
    x.stroke();
    x.fillStyle = '#16133a';
    x.fillRect(28, 480, 464, 300);
    for (let i = 0; i < 12; i++) {
      const bh = 40 + r() * 200;
      x.fillStyle = i % 3 ? violet : pink;
      x.fillRect(48 + i * 36, 760 - bh, 22, bh);
    }
  });

/** Terminal output on the laptop. */
export const createTerminalTexture = () =>
  paint(512, 340, (x, w, h) => {
    const r = seeded(3);
    x.fillStyle = '#07061a';
    x.fillRect(0, 0, w, h);
    for (let l = 0; l < 12; l++) {
      x.fillStyle = green;
      x.fillRect(16, 20 + l * 26, 10, 9);
      x.fillStyle = l % 4 === 3 ? cyan : '#b9b5dd';
      x.fillRect(36, 20 + l * 26, 60 + r() * 300, 9);
    }
  });

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
            x.fillStyle = r() < 0.5 ? amber : '#a5f3fc';
            x.fillRect(xx, yy, 5, 7);
          }
    }
  });

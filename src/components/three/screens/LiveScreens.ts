import { CanvasTexture, SRGBColorSpace } from 'three';
import type { Portfolio } from '@/content/schema';
import { ACCENTS } from '@/lib/palette';
import { chapterOf } from '@/lib/story';

type Screens = Portfolio['hero']['screens'];
type Ctx = CanvasRenderingContext2D;
type Surface = { canvas: HTMLCanvasElement; x: Ctx; tex: CanvasTexture; w: number; h: number };

const { violet, cyan, pink, amber, green } = ACCENTS;
const RED = '#fb7185';
const MONO = '"Geist Mono", ui-monospace, monospace';
const SANS = '"Geist", ui-sans-serif, sans-serif';
const DISPLAY = '"Clash Display", "Geist", sans-serif';
const KEYWORDS = /^(const|let|await|async|export|function|return|if|throw|new|describe|it|ALTER|TABLE|ADD|COLUMN|CREATE|UNIQUE|INDEX|ON|flowchart)$/;

function surface(w: number, h: number): Surface {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const x = canvas.getContext('2d') as Ctx;
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 8;
  return { canvas, x, tex, w, h };
}

const chars = (lines: string[]) => lines.reduce((n, l) => n + l.length + 1, 0);

function tokenColor(tok: string): string {
  if (/^(\/\/|--|#)/.test(tok)) return '#8f8abd';
  if (/^["'`]/.test(tok)) return amber;
  if (/^\d/.test(tok)) return cyan;
  if (KEYWORDS.test(tok)) return '#c4b5fd';
  if (/^[A-Z]/.test(tok)) return green;
  return '#ece9ff';
}

/** Types `lines` up to `budget` characters with light syntax colouring; draws a caret. */
function typeCode(x: Ctx, lines: string[], budget: number, x0: number, y0: number, lh: number, size: number, caret: boolean) {
  x.font = `500 ${size}px ${MONO}`;
  x.textBaseline = 'alphabetic';
  let left = budget;
  let cx = x0;
  let cy = y0;
  for (let li = 0; li < lines.length && left > 0; li++) {
    const line = lines[li] ?? '';
    cy = y0 + li * lh;
    cx = x0;
    const comment = /^\s*(\/\/|--|#)/.test(line);
    const toks = comment ? [line] : line.split(/(\s+|[(){}[\].,;:=>|]+)/).filter(Boolean);
    for (const tk of toks) {
      if (left <= 0) break;
      const part = tk.slice(0, left);
      left -= part.length;
      x.fillStyle = comment ? '#8f8abd' : tokenColor(tk.trim() || tk);
      x.fillText(part, cx, cy);
      cx += x.measureText(part).width;
    }
    if (left > 0) left -= 1;
  }
  if (caret) {
    x.fillStyle = cyan;
    x.fillRect(cx + 3, cy - size * 0.82, Math.max(3, size * 0.12), size);
  }
}

function chrome(x: Ctx, w: number, h: number, label: string, bar = 52) {
  x.fillStyle = '#0b0a22';
  x.fillRect(0, 0, w, h);
  x.fillStyle = '#16133a';
  x.fillRect(0, 0, w, bar);
  [pink, amber, green].forEach((c, i) => {
    x.fillStyle = c;
    x.beginPath();
    x.arc(28 + i * 26, bar / 2, 7, 0, Math.PI * 2);
    x.fill();
  });
  x.fillStyle = '#221e4e';
  x.fillRect(120, 0, Math.min(420, w - 140), bar);
  x.fillStyle = '#dcd8f7';
  x.font = `500 ${Math.round(bar * 0.42)}px ${MONO}`;
  x.textBaseline = 'middle';
  x.fillText(label, 140, bar / 2);
}

/**
 * The three desk screens, drawn to canvases and used as emissive maps.
 * Content is driven by hero scroll progress, so scrolling back rewinds it.
 * All copy comes from `hero.screens` in content/portfolio.json.
 */
export class LiveScreens {
  readonly main = surface(1600, 900);
  readonly side = surface(600, 990);
  readonly laptop = surface(1000, 625);
  private last = -1;
  private lastBlink = 0;

  constructor(private readonly s: Screens) {
    this.draw(0, 0, true);
  }

  /** Redraws only when progress moved, or twice a second for the caret blink. */
  update(progress: number, time: number) {
    if (Math.abs(progress - this.last) > 0.0012 || time - this.lastBlink > 0.5) {
      this.last = progress;
      this.lastBlink = time;
      this.draw(progress, time);
    }
  }

  draw(progress: number, time: number, force = false) {
    const { ch, k } = chapterOf(progress);
    const caret = force || Math.floor(time * 2) % 2 === 0;
    this.drawMain(ch, k, caret);
    this.drawSide(ch, k, time);
    this.drawLaptop(ch, k, caret);
    this.main.tex.needsUpdate = true;
    this.side.tex.needsUpdate = true;
    this.laptop.tex.needsUpdate = true;
  }

  dispose() {
    this.main.tex.dispose();
    this.side.tex.dispose();
    this.laptop.tex.dispose();
  }

  private drawMain(ch: number, k: number, caret: boolean) {
    const { x, w, h } = this.main;
    const s = this.s;
    chrome(x, w, h, s.tabs.main[ch] ?? '');
    if (ch === 0) {
      typeCode(x, s.issue, Math.round(k * chars(s.issue)), 90, 150, 76, 40, caret);
    } else if (ch === 1) {
      x.strokeStyle = '#17143a';
      x.lineWidth = 1;
      for (let gx = 0; gx < w; gx += 40) { x.beginPath(); x.moveTo(gx, 52); x.lineTo(gx, h); x.stroke(); }
      for (let gy = 52; gy < h; gy += 40) { x.beginPath(); x.moveTo(0, gy); x.lineTo(w, gy); x.stroke(); }
      const { nodes, edges, caption } = s.diagram;
      const shown = Math.floor(k * (nodes.length + edges.length + 1));
      const bw = 230;
      const bh = 110;
      edges.forEach((e, i) => {
        const p = Math.min(1, Math.max(0, shown - nodes.length * 0.6 - i));
        const A = nodes[e.from];
        const B = nodes[e.to];
        if (p <= 0 || !A || !B) return;
        const ax = A.x + bw / 2, ay = A.y + bh / 2, bx = B.x + bw / 2, by = B.y + bh / 2;
        x.strokeStyle = e.async ? amber : '#8b7ff0';
        x.lineWidth = 4;
        x.setLineDash(e.async ? [14, 10] : []);
        x.beginPath();
        x.moveTo(ax, ay);
        x.lineTo(ax + (bx - ax) * p, ay + (by - ay) * p);
        x.stroke();
        x.setLineDash([]);
      });
      nodes.forEach((n, i) => {
        if (i > shown) return;
        x.fillStyle = '#151236';
        x.fillRect(n.x, n.y, bw, bh);
        x.strokeStyle = n.accent ? ACCENTS[n.accent] : '#aaa5d6';
        x.lineWidth = 4;
        x.strokeRect(n.x, n.y, bw, bh);
        x.textBaseline = 'alphabetic';
        x.fillStyle = '#ffffff';
        x.font = `600 34px ${SANS}`;
        x.fillText(n.label, n.x + 22, n.y + 50);
        x.fillStyle = '#aaa5d6';
        x.font = `500 22px ${MONO}`;
        x.fillText(n.sub, n.x + 22, n.y + 86);
      });
      x.fillStyle = '#8f8abd';
      x.font = `500 24px ${MONO}`;
      x.fillText(caption, 90, h - 40);
    } else if (ch === 2) {
      const pw = w / 3;
      s.agentPanes.forEach((pane, i) => {
        const px = i * pw;
        x.fillStyle = '#100e2c';
        x.fillRect(px + 8, 64, pw - 16, 50);
        x.fillStyle = ACCENTS[pane.accent];
        x.beginPath();
        x.arc(px + 34, 89, 8, 0, Math.PI * 2);
        x.fill();
        x.fillStyle = '#ffffff';
        x.font = `600 26px ${MONO}`;
        x.textBaseline = 'middle';
        x.fillText(pane.name, px + 54, 90);
        const speed = [1, 1.25, 1.5][i] ?? 1;
        x.save();
        x.beginPath();
        x.rect(px + 8, 120, pw - 16, h - 130);
        x.clip();
        typeCode(x, pane.lines, Math.round(Math.min(1, k * speed) * chars(pane.lines)), px + 26, 180, 50, 23, caret && i === 0);
        x.restore();
        if (i) { x.fillStyle = '#221e4e'; x.fillRect(px, 52, 3, h); }
      });
    } else {
      const wl = s.welcome;
      if (k < 0.62) {
        typeCode(x, wl.code, Math.round(Math.min(1, k / 0.48) * chars(wl.code)), 110, 190, 84, 48, caret);
        if (k > 0.5) {
          x.fillStyle = green;
          x.font = `500 34px ${MONO}`;
          x.fillText(wl.running, 110, 190 + 84 * (wl.code.length + 1));
        }
      } else {
        x.globalAlpha = Math.min(1, (k - 0.62) / 0.14);
        const g = x.createRadialGradient(w / 2, h * 0.5, 40, w / 2, h * 0.5, w * 0.6);
        g.addColorStop(0, 'rgba(139,92,246,0.35)');
        g.addColorStop(1, 'rgba(11,10,34,0)');
        x.fillStyle = g;
        x.fillRect(0, 52, w, h - 52);
        x.textAlign = 'center';
        x.textBaseline = 'alphabetic';
        x.fillStyle = '#ffffff';
        x.font = `600 150px ${DISPLAY}`;
        x.fillText(wl.title, w / 2, h * 0.44);
        x.fillStyle = '#dcd8f7';
        x.font = `400 50px ${SANS}`;
        x.fillText(wl.line, w / 2, h * 0.58);
        x.fillStyle = cyan;
        x.font = `500 30px ${MONO}`;
        x.fillText(wl.hint + (caret ? ' ▍' : '  '), w / 2, h * 0.7);
        x.textAlign = 'left';
        x.globalAlpha = 1;
      }
    }
  }

  private drawSide(ch: number, k: number, t: number) {
    const { x, w, h } = this.side;
    const s = this.s;
    chrome(x, w, h, s.tabs.side[ch] ?? '', 46);
    x.textBaseline = 'alphabetic';
    if (ch === 0 || ch === 3) {
      const ok = ch === 3;
      const col = ok ? green : RED;
      const m = s.metrics;
      x.fillStyle = '#aaa5d6';
      x.font = `500 24px ${MONO}`;
      x.fillText(m.label, 34, 110);
      x.fillStyle = col;
      x.font = `600 96px ${DISPLAY}`;
      x.fillText(ok ? m.good : m.bad, 34, 210);
      if (ok) { x.font = `600 40px ${SANS}`; x.fillText(m.healthy, 34, 270); }
      x.fillStyle = '#16133a';
      x.fillRect(30, 310, w - 60, 330);
      x.strokeStyle = col;
      x.lineWidth = 5;
      x.beginPath();
      const n = 40;
      const prog = ok ? 1 : 0.3 + k * 0.7;
      for (let i = 0; i <= n * prog; i++) {
        const px = 46 + (i * (w - 92)) / n;
        const base = ok ? 0.25 + 0.6 * Math.exp(-i / 6) : 0.25 + (i > n * 0.55 ? ((i - n * 0.55) / (n * 0.45)) * 0.65 : 0) + Math.sin(i * 1.7 + t) * 0.03;
        const py = 620 - base * 280;
        if (i) x.lineTo(px, py);
        else x.moveTo(px, py);
      }
      x.stroke();
      x.strokeStyle = 'rgba(251,191,36,0.7)';
      x.setLineDash([10, 10]);
      x.lineWidth = 2;
      x.beginPath();
      x.moveTo(46, 560);
      x.lineTo(w - 46, 560);
      x.stroke();
      x.setLineDash([]);
      x.fillStyle = '#aaa5d6';
      x.font = `500 22px ${MONO}`;
      x.fillText(m.budget, 34, 710);
      const burn = ok ? 0.82 : 0.82 - k * 0.6;
      x.fillStyle = '#16133a';
      x.fillRect(34, 730, w - 68, 26);
      x.fillStyle = burn > 0.4 ? green : RED;
      x.fillRect(34, 730, (w - 68) * burn, 26);
      x.fillStyle = '#ffffff';
      x.font = `600 30px ${SANS}`;
      x.fillText(Math.round(burn * 100) + m.remaining, 34, 800);
    } else if (ch === 1) {
      const off = k * 260;
      x.save();
      x.beginPath();
      x.rect(0, 46, w, h - 46);
      x.clip();
      s.adr.forEach((l, i) => {
        const head = l.startsWith('#');
        x.fillStyle = head ? (l.startsWith('##') ? cyan : '#ffffff') : '#dcd8f7';
        x.font = head ? `600 32px ${SANS}` : `400 28px ${SANS}`;
        x.fillText(l.replace(/^#+\s*/, ''), 34, 110 + i * 46 - off);
      });
      x.restore();
    } else {
      const items = s.ci;
      items.forEach((it, i) => {
        const done = k * (items.length + 1) > i + 1;
        const run = !done && k * (items.length + 1) > i;
        const y = 120 + i * 104;
        x.fillStyle = '#16133a';
        x.fillRect(30, y - 44, w - 60, 80);
        x.fillStyle = done ? green : run ? amber : '#3a3478';
        x.beginPath();
        x.arc(70, y - 4, 16, 0, Math.PI * 2);
        x.fill();
        x.fillStyle = '#05041a';
        x.font = `700 22px ${SANS}`;
        x.textAlign = 'center';
        x.fillText(done ? '✓' : run ? '…' : '', 70, y + 4);
        x.textAlign = 'left';
        x.fillStyle = done ? '#ffffff' : '#aaa5d6';
        x.font = `500 30px ${MONO}`;
        x.fillText(it, 104, y + 6);
      });
    }
  }

  private drawLaptop(ch: number, k: number, caret: boolean) {
    const { x, w, h } = this.laptop;
    const L = this.s.laptop;
    chrome(x, w, h, this.s.tabs.laptop[ch] ?? '', 44);
    if (ch === 0) {
      const off = Math.floor(k * Math.max(0, L.problem.length - 11));
      x.font = `500 26px ${MONO}`;
      x.textBaseline = 'alphabetic';
      L.problem.slice(off, off + 11).forEach((l, i) => {
        x.fillStyle = l.startsWith('[ERR]') ? RED : amber;
        x.fillText(l, 30, 96 + i * 46);
      });
      return;
    }
    const lines = ch === 1 ? L.design : ch === 2 ? L.agents : L.code;
    const kk = ch === 3 ? Math.min(1, k * 1.6) : k;
    typeCode(x, lines, Math.round(kk * chars(lines)), 30, 100, 62, 30, caret);
  }
}

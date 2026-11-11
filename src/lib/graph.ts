export type Point = { x: number; y: number };

/** Smooth cubic between two points on a 0–100 canvas; bends along the dominant axis. */
export function curve(a: Point, b: Point): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) * 0.56 >= Math.abs(dy)) {
    return `M ${a.x} ${a.y} C ${a.x + dx / 2} ${a.y}, ${b.x - dx / 2} ${b.y}, ${b.x} ${b.y}`;
  }
  return `M ${a.x} ${a.y} C ${a.x} ${a.y + dy / 2}, ${b.x} ${b.y - dy / 2}, ${b.x} ${b.y}`;
}

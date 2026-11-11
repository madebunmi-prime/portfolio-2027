export interface Span {
  start: string; // YYYY-MM
  end: string | null; // null = ongoing
}

export interface TimelineRow<T extends Span> {
  item: T;
  index: number;
  lane: number;
  /** 0–1 position on the shared axis */
  left: number;
  width: number;
  months: number;
  ongoing: boolean;
  /** how many other entries overlap this one in time */
  overlaps: number;
}

export const toMonths = (ym: string): number => {
  const [y = 0, m = 1] = ym.split('-').map(Number);
  return y * 12 + (m - 1);
};

const monthsOf = (d: Date) => d.getFullYear() * 12 + d.getMonth();

/**
 * Lays out possibly-overlapping date ranges into the fewest parallel lanes
 * (greedy interval partitioning) and returns positions on a shared axis.
 */
export function layoutTimeline<T extends Span>(items: readonly T[], now: Date = new Date()) {
  const nowM = monthsOf(now);
  const spans = items.map((item, index) => ({
    item,
    index,
    s: toMonths(item.start),
    e: item.end ? toMonths(item.end) : nowM,
  }));
  if (spans.length === 0) return { rows: [] as TimelineRow<T>[], laneCount: 0, years: [] };

  const min = Math.min(...spans.map((s) => s.s));
  const range = Math.max(1, nowM - min);

  const laneEnds: number[] = [];
  const laneOf = new Map<number, number>();
  [...spans]
    .sort((a, b) => a.s - b.s)
    .forEach((sp) => {
      let lane = laneEnds.findIndex((end) => end < sp.s);
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(0);
      }
      laneEnds[lane] = sp.e;
      laneOf.set(sp.index, lane);
    });

  const rows: TimelineRow<T>[] = spans.map((sp) => ({
    item: sp.item,
    index: sp.index,
    lane: laneOf.get(sp.index) ?? 0,
    left: (sp.s - min) / range,
    width: Math.max(0, sp.e - sp.s) / range,
    months: Math.max(0, sp.e - sp.s),
    ongoing: sp.item.end === null,
    overlaps: spans.filter((o) => o.index !== sp.index && o.s < sp.e && o.e > sp.s).length,
  }));

  const years: { label: string; left: number }[] = [];
  for (let y = Math.floor(min / 12) + 1; y * 12 <= nowM; y++) {
    years.push({ label: String(y), left: (y * 12 - min) / range });
  }

  return { rows, laneCount: laneEnds.length, years };
}

export function formatDuration(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y ? `${y} yr${y > 1 ? 's' : ''}` : '', m ? `${m} mo` : ''].filter(Boolean).join(' ') || '< 1 mo';
}

export function formatYearMonth(ym: string, locale = 'en'): string {
  const [y = 0, m = 1] = ym.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString(locale, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

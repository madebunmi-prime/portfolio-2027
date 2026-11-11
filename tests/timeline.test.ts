import { describe, expect, it } from 'vitest';
import { formatDuration, layoutTimeline, toMonths } from '@/lib/timeline';

const NOW = new Date(2026, 10, 1); // Nov 2026

describe('toMonths', () => {
  it('converts YYYY-MM to an absolute month index', () => {
    expect(toMonths('2020-01') - toMonths('2019-12')).toBe(1);
  });
});

describe('layoutTimeline', () => {
  it('keeps back-to-back roles on one lane', () => {
    const { laneCount } = layoutTimeline(
      [
        { start: '2019-01', end: '2019-12' },
        { start: '2020-01', end: '2020-06' },
      ],
      NOW,
    );
    expect(laneCount).toBe(1);
  });

  it('stacks overlapping roles into parallel lanes and counts overlaps', () => {
    const { rows, laneCount } = layoutTimeline(
      [
        { start: '2019-01', end: null },
        { start: '2020-01', end: '2021-01' },
        { start: '2020-06', end: null },
      ],
      NOW,
    );
    expect(laneCount).toBe(3);
    expect(rows[1]!.overlaps).toBe(2);
    expect(rows[0]!.ongoing).toBe(true);
  });

  it('positions entries on a 0–1 axis ending at "now"', () => {
    const { rows } = layoutTimeline([{ start: '2020-11', end: null }], NOW);
    expect(rows[0]!.left).toBe(0);
    expect(rows[0]!.width).toBeCloseTo(1);
  });

  it('handles an empty list', () => {
    expect(layoutTimeline([], NOW).laneCount).toBe(0);
  });
});

describe('formatDuration', () => {
  it('formats years and months', () => {
    expect(formatDuration(14)).toBe('1 yr 2 mo');
    expect(formatDuration(24)).toBe('2 yrs');
    expect(formatDuration(0)).toBe('< 1 mo');
  });
});

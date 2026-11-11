/**
 * The hero scroll story is split into four chapters. Chapter 4 is the longest so the
 * welcome screen can dwell before the page slides over it.
 */
export const CHAPTER_BOUNDS = [0, 0.2, 0.4, 0.6, 1] as const;

/** Maps hero scroll progress (0–1) to a chapter index and the 0–1 progress inside it. */
export function chapterOf(p: number): { ch: 0 | 1 | 2 | 3; k: number } {
  const B = CHAPTER_BOUNDS;
  let ch = 0;
  while (ch < 3 && p >= B[ch + 1]!) ch++;
  const span = B[ch + 1]! - B[ch]!;
  // Each chapter finishes its animation a little before the next begins (a short hold).
  const k = Math.min(1, Math.max(0, (p - B[ch]!) / (span * (ch === 3 ? 0.75 : 0.85))));
  return { ch: ch as 0 | 1 | 2 | 3, k };
}

/** Hero progress after which the final CTA fades in over the monitor. */
export const FINAL_CTA_AT = 0.84;

export type HeroProgress = { target: number; smooth: number };

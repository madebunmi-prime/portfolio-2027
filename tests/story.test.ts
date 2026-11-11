import { describe, expect, it } from 'vitest';
import { chapterOf } from '@/lib/story';

describe('chapterOf', () => {
  it('starts in chapter 0 at the top', () => {
    expect(chapterOf(0)).toEqual({ ch: 0, k: 0 });
  });

  it('switches chapters on the bounds', () => {
    expect(chapterOf(0.2).ch).toBe(1);
    expect(chapterOf(0.45).ch).toBe(2);
    expect(chapterOf(0.99).ch).toBe(3);
  });

  it('holds each chapter complete before the next starts', () => {
    expect(chapterOf(0.19).k).toBe(1);
    expect(chapterOf(1).k).toBe(1);
  });

  it('clamps out-of-range progress', () => {
    expect(chapterOf(-1).ch).toBe(0);
    expect(chapterOf(2)).toEqual({ ch: 3, k: 1 });
  });
});

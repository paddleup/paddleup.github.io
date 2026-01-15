import { describe, it, expect } from 'vitest';
import { getPointsForRank } from '../points';

describe('getPointsForRank', () => {
  it('returns championship points for top ranks', () => {
    expect(getPointsForRank(1)).toBe(1000);
    expect(getPointsForRank(2)).toBe(800);
    expect(getPointsForRank(3)).toBe(600);
  });
});

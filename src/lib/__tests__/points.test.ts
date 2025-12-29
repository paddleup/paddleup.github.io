import { describe, it, expect } from 'vitest';
import { getPointsForRank } from '../points';

describe('getPointsForRank', () => {
  it('returns championship points for top ranks', () => {
    expect(getPointsForRank(1)).toBe(1000);
    expect(getPointsForRank(2)).toBe(800);
    expect(getPointsForRank(4)).toBe(400);
  });

  it('returns court2 points for ranks 5-8', () => {
    expect(getPointsForRank(5)).toBe(300); // court2 rank 1
    expect(getPointsForRank(8)).toBe(120); // court2 rank 4
  });

  it('returns court3 and court4 points correctly', () => {
    expect(getPointsForRank(9)).toBe(100); // court3 rank 1
    expect(getPointsForRank(12)).toBe(40); // court3 rank 4
    expect(getPointsForRank(13)).toBe(30); // court4 rank 1
    expect(getPointsForRank(16)).toBe(12); // court4 rank 4
  });

  it('returns 0 for out-of-range ranks', () => {
    expect(getPointsForRank(0)).toBe(0);
    expect(getPointsForRank(100)).toBe(0);
  });
});

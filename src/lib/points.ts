import { rules } from '../data/rules';

/**
 * Points mapping by rank (courts).
 */
export const getPointsForRank = (rank: number): number => {
  return getPointsForRankHalfEveryTwo(rank);
};

const getPointsForRankHalfEveryTwo = (rank: number): number => {
  if (rank < 1) return 0;
  if (rank === 1) return 1000;
  if (rank === 2) return 700;
  if (rank >= 8) return Math.floor(getPointsForRank(rank - 7) / 10);
  if (rank >= 3) return Math.floor(getPointsForRank(rank - 2) / 2);
  return 0;
};

const getPointsForRankHalfEveryThree = (rank: number): number => {
  if (rank < 1) return 0;
  if (rank === 1) return 1000;
  if (rank === 2) return 800;
  if (rank === 3) return (getPointsForRank(2) * 3) / 4;
  if (rank === 4) return (getPointsForRank(2) * 3) / 5;
  if (rank >= 11) return Math.floor(getPointsForRank(rank - 10) / 10);
  if (rank >= 5) return Math.floor(getPointsForRank(rank - 3) / 2);
  return 0;
};

const getPointsForRankHalfEveryFive = (rank: number): number => {
  if (rank < 1) return 0;
  if (rank === 1) return 1000;
  if (rank === 2) return 875;
  if (rank === 3) return 750;
  if (rank === 4) return 650;
  if (rank === 5) return 575;
  if (rank >= 19) return Math.floor(getPointsForRank(rank - 18) / 10);
  if (rank >= 6) return Math.floor(getPointsForRank(rank - 5) / 2);
  return 0;
};

import { rules } from '../data/rules';

/**
 * Points mapping by rank (courts).
 */
export const getPointsForRank = (rank: number): number => {
  const { championship, court2, court3, court4 } = rules.points ?? {
    championship: {},
    court2: {},
    court3: {},
    court4: {},
  };

  // Helper to safely index readonly literal objects
  const safeLookup = (obj: Record<number, number> | undefined, key: number): number => {
    if (!obj) return 0;
    const val = obj[key];
    return typeof val === 'number' ? val : 0;
  };

  // Champ Court (1-4)
  if (rank <= 4) return safeLookup(championship, rank);

  // Court 2 (5-8)
  if (rank <= 8) return safeLookup(court2, rank - 4);

  // Court 3 (9-12)
  if (rank <= 12) return safeLookup(court3, rank - 8);

  // Court 4 (13-16)
  if (rank <= 16) return safeLookup(court4, rank - 12);

  return 0;
};

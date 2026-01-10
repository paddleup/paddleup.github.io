import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { PlayerStats } from '../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a default PlayerStats object.
 */
export const createDefaultPlayerStats = (id: string): PlayerStats => ({
  id,
  points: 0,
  wins: 0,
  losses: 0,
  pointsWon: 0,
  pointsLost: 0,
  diff: 0,
  appearances: 0,
  champCourt: 0,
  weeklyRanks: [],
});

/**
 * Ranks a list of items based on a numeric value, handling ties.
 */
export const rankItems = <T>(
  items: T[],
  getValue: (item: T) => number,
): (T & { rank: number })[] => {
  let lastValue: number | null = null;
  let rank = 0;
  let seen = 0;

  return items.map((item) => {
    const value = getValue(item);
    seen += 1;
    if (lastValue === null || value !== lastValue) {
      rank = seen;
      lastValue = value;
    }
    return { ...item, rank };
  });
};

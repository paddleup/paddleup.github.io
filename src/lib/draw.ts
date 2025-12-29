import { Player } from '../types';

/**
 * Helpers used by the calculator UI (existing logic preserved).
 */
export const getNextCourt = (
  round: number | string,
  court: number | string,
  rank: number,
): number | string => {
  const rNum = typeof round === 'string' ? parseInt(round) : round;
  const cNum = typeof court === 'string' ? parseInt(court) : court;

  if (rNum === 1) {
    // Round 1 Logic
    if (cNum === 1 || cNum === 4) {
      if (rank === 1) return 1;
      if (rank === 2) return 2;
      if (rank === 3) return 3;
      if (rank === 4) return 4;
    } else if (cNum === 2 || cNum === 3) {
      if (rank === 1) return 2;
      if (rank === 2) return 1;
      if (rank === 3) return 4;
      if (rank === 4) return 3;
    }
  } else if (rNum === 2) {
    // Round 2 Logic
    if (cNum === 1 || cNum === 2) {
      if (rank <= 2) return 1;
      return 2;
    } else if (cNum === 3 || cNum === 4) {
      if (rank <= 2) return 3;
      return 4;
    }
  } else if (rNum === 3) {
    return 'DONE';
  }
  return 'TBD';
};

export const generateSnakeDraw = (
  rankedPlayers: Player[],
): { id: number; name: string; indices: number[]; players: (Player & { seed: number })[] }[] => {
  // Snake Draw Logic
  // Court 1: 1, 8, 9, 16 (Indices: 0, 7, 8, 15)
  // Court 2: 2, 7, 10, 15 (Indices: 1, 6, 9, 14)
  // Court 3: 3, 6, 11, 14 (Indices: 2, 5, 10, 13)
  // Court 4: 4, 5, 12, 13 (Indices: 3, 4, 11, 12)

  const courts = [
    { id: 1, name: 'Court 1', indices: [0, 7, 8, 15] },
    { id: 2, name: 'Court 2', indices: [1, 6, 9, 14] },
    { id: 3, name: 'Court 3', indices: [2, 5, 10, 13] },
    { id: 4, name: 'Court 4', indices: [3, 4, 11, 12] },
  ];

  return courts.map((court) => ({
    ...court,
    players: court.indices
      .map((idx) => rankedPlayers[idx])
      .filter(Boolean) // Handle case where < 16 players selected
      .map((p, i) => ({ ...p, seed: court.indices[i] + 1 })),
  }));
};

import { describe, it, expect } from 'vitest';
import {
  getNumberOfDifferentTierRanges,
  calculateCourtDetails,
  calculatePlayerRankings,
  Court,
} from '../useCalculator';

/**
 * Table-driven specs that map the expected labels for each court count and round.
 * This reflects the league format documented in .clinerules/match-structure.md:
 *
 * - Round 1: single combined range (A–X)
 * - Round 2:
 *   - <=3 courts: single combined range (same as round 1)
 *   - >3 courts: split into two ranges (first = floor(n/2) courts)
 * - Round 3: one tier per court (A, B, C, ...)
 *
 * Note: ranges where start === end are represented as a single letter (e.g., "A").
 */
const specs = [
  {
    courts: 2,
    round1: 'A–B',
    round2: ['A–B', 'A–B'],
    round3: ['A', 'B'],
  },
  {
    courts: 3,
    round1: 'A–C',
    round2: ['A–C', 'A–C', 'A–C'],
    round3: ['A', 'B', 'C'],
  },
  {
    courts: 4,
    round1: 'A–D',
    round2: ['A–B', 'A–B', 'C–D', 'C–D'],
    round3: ['A', 'B', 'C', 'D'],
  },
  {
    courts: 5,
    round1: 'A–E',
    round2: ['A–B', 'A–B', 'C–E', 'C–E', 'C–E'],
    round3: ['A', 'B', 'C', 'D', 'E'],
  },
  {
    courts: 6,
    round1: 'A–F',
    round2: ['A–C', 'A–C', 'A–C', 'D–F', 'D–F', 'D–F'],
    round3: ['A', 'B', 'C', 'D', 'E', 'F'],
  },
];

describe('getNumberOfDifferentTierRanges (table-driven)', () => {
  it('returns expected counts for rounds 1-3', () => {
    for (const s of specs) {
      // round 1 -> always 1
      expect(getNumberOfDifferentTierRanges(s.courts, 1)).toBe(1);

      // round 2 -> 1 for <=3 courts, otherwise 2
      const expectedRound2 = s.courts <= 3 ? 1 : 2;
      expect(getNumberOfDifferentTierRanges(s.courts, 2)).toBe(expectedRound2);

      // round 3 -> one per court
      expect(getNumberOfDifferentTierRanges(s.courts, 3)).toBe(s.courts);
    }
  });

  it('throws for invalid rounds', () => {
    expect(() => getNumberOfDifferentTierRanges(4, 0)).toThrow();
    expect(() => getNumberOfDifferentTierRanges(4, 4)).toThrow();
  });
});

/* -----------------------------
 * Tests for calculateCourtDetails
 * -----------------------------
 *
 * These are table-driven to minimize redundancy: for each court-count we verify
 * the seeds and tier for rounds 1, 2 and 3 match the documented layouts.
 */

function makeCourts(n: number): Court[] {
  // each court gets 4 player names so playersPerCourt is inferred as 4
  return Array.from({ length: n }, (_, i) => ({
    courtNumber: i + 1,
    playerNames: Array.from({ length: 4 }, (__, j) => `p${i + 1}-${j + 1}`),
    matches: [],
  }));
}

const layoutSpecs: {
  courts: number;
  rounds: {
    [round: number]: { seeds: number[][]; tiers: string[] };
  };
}[] = [
  {
    courts: 2,
    rounds: {
      1: {
        seeds: [
          [1, 4, 5, 8],
          [2, 3, 6, 7],
        ],
        tiers: ['A–B', 'A–B'],
      },
      2: {
        seeds: [
          [1, 4, 5, 8],
          [2, 3, 6, 7],
        ],
        tiers: ['A–B', 'A–B'],
      },
      3: {
        seeds: [
          [1, 2, 3, 4],
          [5, 6, 7, 8],
        ],
        tiers: ['A', 'B'],
      },
    },
  },
  {
    courts: 3,
    rounds: {
      1: {
        seeds: [
          [1, 6, 7, 12],
          [2, 5, 8, 11],
          [3, 4, 9, 10],
        ],
        tiers: ['A–C', 'A–C', 'A–C'],
      },
      2: {
        seeds: [
          [1, 6, 7, 12],
          [2, 5, 8, 11],
          [3, 4, 9, 10],
        ],
        tiers: ['A–C', 'A–C', 'A–C'],
      },
      3: {
        seeds: [
          [1, 2, 3, 4],
          [5, 6, 7, 8],
          [9, 10, 11, 12],
        ],
        tiers: ['A', 'B', 'C'],
      },
    },
  },
  {
    courts: 4,
    rounds: {
      1: {
        seeds: [
          [1, 8, 9, 16],
          [2, 7, 10, 15],
          [3, 6, 11, 14],
          [4, 5, 12, 13],
        ],
        tiers: ['A–D', 'A–D', 'A–D', 'A–D'],
      },
      2: {
        seeds: [
          [1, 4, 5, 8],
          [2, 3, 6, 7],
          [9, 12, 13, 16],
          [10, 11, 14, 15],
        ],
        tiers: ['A–B', 'A–B', 'C–D', 'C–D'],
      },
      3: {
        seeds: [
          [1, 2, 3, 4],
          [5, 6, 7, 8],
          [9, 10, 11, 12],
          [13, 14, 15, 16],
        ],
        tiers: ['A', 'B', 'C', 'D'],
      },
    },
  },
  {
    courts: 5,
    rounds: {
      1: {
        seeds: [
          [1, 10, 11, 20],
          [2, 9, 12, 19],
          [3, 8, 13, 18],
          [4, 7, 14, 17],
          [5, 6, 15, 16],
        ],
        tiers: ['A–E', 'A–E', 'A–E', 'A–E', 'A–E'],
      },
      2: {
        seeds: [
          [1, 6, 7, 12],
          [2, 5, 8, 11],
          [3, 4, 9, 10],
          [13, 16, 17, 20],
          [14, 15, 18, 19],
        ],
        tiers: ['A–C', 'A–C', 'A–C', 'D–E', 'D–E'],
      },
      3: {
        seeds: [
          [1, 2, 3, 4],
          [5, 6, 7, 8],
          [9, 10, 11, 12],
          [13, 14, 15, 16],
          [17, 18, 19, 20],
        ],
        tiers: ['A', 'B', 'C', 'D', 'E'],
      },
    },
  },
  {
    courts: 6,
    rounds: {
      1: {
        seeds: [
          [1, 12, 13, 24],
          [2, 11, 14, 23],
          [3, 10, 15, 22],
          [4, 9, 16, 21],
          [5, 8, 17, 20],
          [6, 7, 18, 19],
        ],
        tiers: ['A–F', 'A–F', 'A–F', 'A–F', 'A–F', 'A–F'],
      },
      2: {
        seeds: [
          [1, 6, 7, 12],
          [2, 5, 8, 11],
          [3, 4, 9, 10],
          [13, 18, 19, 24],
          [14, 17, 20, 23],
          [15, 16, 21, 22],
        ],
        tiers: ['A–C', 'A–C', 'A–C', 'D–F', 'D–F', 'D–F'],
      },
      3: {
        seeds: [
          [1, 2, 3, 4],
          [5, 6, 7, 8],
          [9, 10, 11, 12],
          [13, 14, 15, 16],
          [17, 18, 19, 20],
          [21, 22, 23, 24],
        ],
        tiers: ['A', 'B', 'C', 'D', 'E', 'F'],
      },
    },
  },
];

describe('calculateCourtDetails (table-driven)', () => {
  for (const s of layoutSpecs) {
    describe(`${s.courts} courts`, () => {
      const courts = makeCourts(s.courts);
      for (const roundStr of Object.keys(s.rounds)) {
        const round = Number(roundStr) as 1 | 2 | 3;
        it(`round ${round}: produces expected seeds, tiers and round property`, () => {
          const details = calculateCourtDetails(courts, round);
          expect(details).toHaveLength(s.courts);

          for (let i = 0; i < s.courts; i++) {
            expect(details[i].round).toBe(round);
            expect(details[i].seeds).toEqual(s.rounds[round].seeds[i]);
            expect(details[i].tier).toBe(s.rounds[round].tiers[i]);
            // ensure courtNumber and playerNames pass-through
            expect(details[i].playerNames).toEqual(courts[i].playerNames);
          }
        });
      }
    });
  }

  it('throws when given empty courts array', () => {
    // @ts-ignore intentionally pass invalid input
    expect(() => calculateCourtDetails([], 1)).toThrow();
  });
});

/* -----------------------------
 * Tests for calculatePlayerRankings
 * ----------------------------- */

describe('calculatePlayerRankings', () => {
  it('throws for invalid input', () => {
    // @ts-ignore intentionally pass invalid input
    expect(() => calculatePlayerRankings([], 1)).toThrow();

    const courts = makeCourts(1);
    // @ts-ignore force invalid round
    expect(() => calculatePlayerRankings(courts, 0 as any)).toThrow();
  });

  it('computes rankings, roundPlace and nextCourt for round 1', () => {
    const courts = makeCourts(1);

    // Three matches: [0,1] vs [2,3], [0,2] vs [1,3], [0,3] vs [1,2]
    courts[0].matches = [
      { scoreA: 11, scoreB: 5 },
      { scoreA: 9, scoreB: 11 },
      { scoreA: 12, scoreB: 10 },
    ];

    const players = calculatePlayerRankings(courts, 1);

    // Expected ordering derived from wins, point differential and seed tiebreaker
    expect(players.map((p) => p.name)).toEqual(['p1-1', 'p1-2', 'p1-4', 'p1-3']);

    expect(players.map((p) => p.roundPlace)).toEqual([1, 2, 3, 4]);

    // For round 1, nextCourt/nextTier should be populated for the next round
    for (const p of players) {
      expect(p.nextCourt).toBe(1);
      expect(p.nextTier).toBe('A');
    }
  });

  it('does not assign nextCourt/nextTier for round 3', () => {
    const courts = makeCourts(2);
    // Provide match placeholders with null scores so scoring loop is skipped
    courts.forEach((c) => {
      c.matches = [{}, {}, {}];
    });

    const players = calculatePlayerRankings(courts, 3);

    // nextCourt and nextTier should remain their defaults for round 3
    for (const p of players) {
      expect(p.nextCourt).toBe(0);
      expect(p.nextTier).toBe('');
    }

    // With no scores, ordering falls back to tier then seed; first four should be court 1 players
    expect(players.slice(0, 4).map((p) => p.name)).toEqual(['p1-1', 'p1-2', 'p1-3', 'p1-4']);
  });
});

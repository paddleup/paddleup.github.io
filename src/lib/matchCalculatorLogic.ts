/**
 * Pure, testable match calculator helpers extracted from MatchCalculator component.
 * Keep implementations deterministic and free of UI/persistence concerns.
 */
import { getTierRangeLabel } from '../hooks/useCalculator';

export type PlayerSlot = {
  name: string;
  seed: number;
  courtIndex: number;
};

export type MatchScore = {
  a: number | null;
  b: number | null;
};

export type CourtState = {
  players: PlayerSlot[]; // P1..P4
  matches: MatchScore[]; // 3 matches
  label?: string;
};

export type PlayerStats = {
  name: string;

  // Used to determine round place in order of precidence
  tier: number;
  courtPlace: number;
  wins: number;
  losses: number;
  pointDifferential: number;
  seed: number;

  roundPlace: number;

  nextCourt: number;
  nextTier: string;
};

export function range(n: number) {
  return Array.from({ length: n }, (_, i) => i);
}

export function divisionLetter(idx: number) {
  return String.fromCharCode('A'.charCodeAt(0) + idx);
}

export function ordinal(n: number) {
  const s = String(n);
  if (!n || isNaN(n)) return `${s}`;
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

export function getDivisionsCount(playerCount: number, round: number) {
  const courtCount = Math.min(4, Math.ceil(playerCount / 4));
  if (round === 1) {
    return courtCount;
  }

  if (playerCount === 16) {
    if (round === 2) return 2;
    return 4;
  }
  if (playerCount === 12) {
    if (round === 2) return 1;
    return 3;
  }
  if (round === 2) return Math.min(2, Math.max(1, Math.floor(playerCount / 8)));
  return Math.min(4, Math.max(1, Math.floor(playerCount / 4)));
}

export function getSeedLayout(playerCount: number, round: number): number[][] {
  if (playerCount === 16) {
    if (round === 1) {
      return [
        [1, 8, 9, 16],
        [2, 7, 10, 15],
        [3, 6, 11, 14],
        [4, 5, 12, 13],
      ];
    }
    if (round === 2) {
      return [
        [1, 4, 5, 8],
        [2, 3, 6, 7],
        [9, 12, 13, 16],
        [10, 11, 14, 15],
      ];
    }
    return [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 16],
    ];
  }

  if (playerCount === 12) {
    if (round === 1) {
      return [
        [1, 6, 7, 12],
        [2, 5, 8, 11],
        [3, 4, 9, 10],
        [0, 0, 0, 0],
      ];
    }
    if (round === 2) {
      return [
        [1, 6, 7, 12],
        [2, 5, 8, 11],
        [3, 4, 9, 10],
        [0, 0, 0, 0],
      ];
    }
    return [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [0, 0, 0, 0],
    ];
  }

  const count = Math.min(4, Math.ceil(playerCount / 4));
  const layout: number[][] = [];
  for (let ci = 0; ci < count; ci++) {
    const base = ci * 4 + 1;
    layout.push(range(4).map((i) => base + i));
  }
  return layout;
}

/**
 * computeStandingsReturningStats
 * Pure function that mirrors the logic extracted from the UI component.
 * - courts: current court state (players + scores)
 * - playersCount: total players in the event
 * - round: current round number
 * - pointsTable: rules.points (pass in from data/rules)
 */
export function computeStandingsReturningStats(
  courts: CourtState[],
  playersCount: number,
  round: number,
  _pointsTable: any,
): PlayerStats[] {
  // Build initial stats and helper map
  const stats: PlayerStats[] = [];
  const temp = new Map<
    number,
    { pointsFor: number; pointsAgainst: number; wins: number; played: number; courtIndex: number }
  >();

  courts.forEach((court, ci) => {
    court.players.forEach((p) => {
      stats.push({
        name: p.name || '-',
        tier: 0,
        courtPlace: 0,
        wins: 0,
        losses: 0,
        pointDifferential: 0,
        seed: p.seed,
        roundPlace: 0,
        nextCourt: 0,
        nextTier: '',
      });
      temp.set(p.seed, { pointsFor: 0, pointsAgainst: 0, wins: 0, played: 0, courtIndex: ci });
    });
  });

  function statForSeed(seed: number) {
    return stats.find((s) => s.seed === seed)!;
  }

  // process matches to accumulate points and wins/played
  courts.forEach((court) => {
    const matchDefs = [
      { teamA: [0, 1], teamB: [2, 3], score: court.matches[0] },
      { teamA: [0, 2], teamB: [1, 3], score: court.matches[1] },
      { teamA: [0, 3], teamB: [1, 2], score: court.matches[2] },
    ];

    matchDefs.forEach((md) => {
      const s = md.score;
      if (s.a == null || s.b == null) return;
      // update points and played
      md.teamA.forEach((pi) => {
        const seed = court.players[pi].seed;
        const entry = temp.get(seed)!;
        entry.pointsFor += s.a!;
        entry.pointsAgainst += s.b!;
        entry.played += 1;
      });
      md.teamB.forEach((pi) => {
        const seed = court.players[pi].seed;
        const entry = temp.get(seed)!;
        entry.pointsFor += s.b!;
        entry.pointsAgainst += s.a!;
        entry.played += 1;
      });
      // assign wins
      if (s.a > s.b) {
        md.teamA.forEach((pi) => {
          const seed = court.players[pi].seed;
          temp.get(seed)!.wins += 1;
        });
      } else if (s.b > s.a) {
        md.teamB.forEach((pi) => {
          const seed = court.players[pi].seed;
          temp.get(seed)!.wins += 1;
        });
      }
    });
  });

  // compute court places and basic derived fields
  const courtCount = Math.min(4, Math.ceil(playersCount / 4));

  // map courts to division letter using shared UI tier logic (getTierRangeLabel)
  const courtToDivision: Record<number, string> = {};
  for (let ci = 0; ci < courtCount; ci++) {
    const label = getTierRangeLabel(courtCount, round as 1 | 2 | 3, ci + 1);
    // Use the first letter of the label as the division (e.g., 'A' from 'A–B' or 'A')
    courtToDivision[ci] = label && label.length ? label.charAt(0) : 'A';
  }

  // assign courtPlace and tier based on per-court rankings
  range(courtCount).forEach((ci) => {
    const courtSeeds = courts[ci]?.players.map((p) => p.seed) ?? [];
    const courtStats = courtSeeds
      .map((seed) => {
        const entry = temp.get(seed)!;
        return {
          seed,
          wins: entry.wins,
          diff: entry.pointsFor - entry.pointsAgainst,
        };
      })
      .sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        if (b.diff !== a.diff) return b.diff - a.diff;
        return a.seed - b.seed;
      });

    courtStats.forEach((cs, idx) => {
      const ps = statForSeed(cs.seed);
      ps.courtPlace = idx + 1;
      ps.wins = cs.wins;
      ps.losses = Math.max(0, (temp.get(cs.seed)?.played ?? 0) - cs.wins);
      ps.pointDifferential = cs.diff;
      const d = courtToDivision[ci];
      ps.tier = typeof d === 'string' && d.length ? d.charCodeAt(0) - 65 : 0;
    });
  });

  // global ranking (roundPlace)
  const globalSortedSeeds = [...stats]
    .sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.pointDifferential !== a.pointDifferential)
        return b.pointDifferential - a.pointDifferential;
      return a.seed - b.seed;
    })
    .map((s) => s.seed);

  globalSortedSeeds.forEach((seed, idx) => {
    const ps = statForSeed(seed);
    ps.roundPlace = idx + 1;
  });

  // compute next round assignments
  const nextRound = Math.min(3, round + 1);
  const layoutNext = getSeedLayout(playersCount, nextRound);
  const seedToNextCourt: Record<number, number> = {};
  layoutNext.forEach((seeds, ci) =>
    (seeds || []).forEach((s) => {
      if (s && s > 0) seedToNextCourt[s] = ci + 1;
    }),
  );

  const noScoresEntered = Array.from(temp.values()).every(
    (v) => v.wins === 0 && v.pointsFor === 0 && v.pointsAgainst === 0,
  );

  const orderedByRank = [...stats].sort((a, b) => a.roundPlace - b.roundPlace);
  orderedByRank.forEach((s) => {
    const nextCourtByRank = seedToNextCourt[s.roundPlace] ?? undefined;
    const nextCourtBySeed = seedToNextCourt[s.seed] ?? undefined;
    const nextCourt = noScoresEntered && round === 1 ? nextCourtBySeed : nextCourtByRank;
    s.nextCourt = nextCourt ?? 0;
  });

  // map next court to next tier label using shared UI tier logic (getTierRangeLabel)
  const courtToDivisionNext: Record<number, string> = {};
  for (let ci = 0; ci < courtCount; ci++) {
    const label = getTierRangeLabel(courtCount, nextRound as 1 | 2 | 3, ci + 1);
    courtToDivisionNext[ci] = label && label.length ? label.charAt(0) : 'A';
  }

  stats.forEach((s) => {
    if (typeof s.nextCourt === 'number' && s.nextCourt > 0) {
      s.nextTier = courtToDivisionNext[s.nextCourt - 1] ?? 'A';
    } else {
      s.nextTier = '';
    }
  });

  // final sort similar to previous behavior: by division then courtPlace then wins/diff/seed
  stats.sort((a, b) => {
    const da = String(a.tier ?? 'Z');
    const db = String(b.tier ?? 'Z');
    if (da !== db) return da < db ? -1 : 1;
    if ((a.courtPlace ?? 99) !== (b.courtPlace ?? 99))
      return (a.courtPlace ?? 99) - (b.courtPlace ?? 99);
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.pointDifferential !== a.pointDifferential)
      return b.pointDifferential - a.pointDifferential;
    return a.seed - b.seed;
  });

  return stats;
}

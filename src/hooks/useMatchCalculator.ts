import { useCallback, useMemo, useState } from 'react';
import { useCalculatorPersistence } from './usePersistentCalculator';
import { useRealtimeMatch } from './useRealtimeMatch';


// Always 4 players per court
export const PlayersPerCourt: number = 4;

export type Court = {
  playerNames: string[];
  matches: Match[];
};

export type CourtDetails = {
  seeds: number[];
  tier: string;
  round: number;
} & Court;

export type Match = {
  scoreA?: number;
  scoreB?: number;
};

export type PlayerDetails = {
  name: string;
  courtIndex: number;

  // Used to determine round place in order of precidence
  tier: string;
  courtPlace: number;
  wins: number;
  losses: number;
  pointDifferential: number;
  seed: number;

  roundPlace: number;

  nextCourt?: number;
  nextTier?: string;
};

// -------- Provided helper (using exactly as requested) --------
export const getNumberOfDifferentTierRanges = (
  totalNumberOfCourts: number,
  round: number,
): number => {
  if (round === 3) {
    return totalNumberOfCourts;
  }

  if (round === 2 || round === 1) {
    return Math.ceil(getNumberOfDifferentTierRanges(totalNumberOfCourts, round + 1) / 3);
  }

  throw new Error('Invalid round number');
};

// -------- Helpers --------

const toTier = (indexZeroBased: number) => String.fromCharCode('A'.charCodeAt(0) + indexZeroBased);

const tierRange = (startZero: number, endZero: number) =>
  startZero === endZero ? toTier(startZero) : `${toTier(startZero)}–${toTier(endZero)}`;

/**
 * Snake draw for a range of courts:
 * Fill rows of seeds in alternating direction; collect column-wise into court groups.
 * Example (courts=3, PlayersPerCourt=4, startSeed=1) groups:
 *  [1,6,7,12], [2,5,8,11], [3,4,9,10]
 */
function snakeDraw(courtsInRange: number, startSeed: number = 1): number[][] {
  const groups: number[][] = Array.from({ length: courtsInRange }, () => []);
  for (let row = 0; row < PlayersPerCourt; row++) {
    const rowStart = startSeed + row * courtsInRange;
    const rowSeeds = Array.from({ length: courtsInRange }, (_, i) => rowStart + i);
    const ordered = row % 2 === 0 ? rowSeeds : rowSeeds.slice().reverse();
    for (let c = 0; c < courtsInRange; c++) {
      groups[c].push(ordered[c]);
    }
  }
  return groups;
}

/**
 * Calculates CourtDetails using:
 * - getNumberOfDifferentTierRanges(totalCourts, round) to decide how many tier ranges to create,
 * - even-ish partitioning of contiguous courts across those ranges,
 * - snake draw within each range with seed starts advancing by range size * PlayersPerCourt,
 * - tiers labeled by contiguous letters (A–B, C–D, ...).
 */
export function calculateCourtDetails(courts: Court[], round: 1 | 2 | 3): CourtDetails[] {
  if (!courts?.length) throw new Error('courts array is required.');
  if (![1, 2, 3].includes(round)) throw new Error('Supported rounds are 1, 2, or 3.');

  // Stable order by court number
  const totalCourts = courts.length;

  const rangeCount = getNumberOfDifferentTierRanges(totalCourts, round);

  // Partition totalCourts into `rangeCount` contiguous blocks (as even as possible)
  const baseSize = Math.floor(totalCourts / rangeCount);
  const remainder = totalCourts % rangeCount;

  const result: CourtDetails[] = [];
  let cursorCourtIndex = 0; // absolute court index (0-based)
  let seedStart = 1; // next seed start across ranges

  for (let r = 0; r < rangeCount; r++) {
    const size = baseSize + (r < remainder ? 1 : 0); // distribute leftovers to early ranges
    const tierLabel = tierRange(cursorCourtIndex, cursorCourtIndex + size - 1);
    const groups = snakeDraw(size, seedStart);

    // Map snake groups to actual courts in this range (left-to-right)
    for (let i = 0; i < size; i++) {
      const court = courts[cursorCourtIndex + i];
      result.push({
        ...court,
        round,
        seeds: groups[i],
        tier: tierLabel,
      });
    }

    // Advance seed start and court cursor to the next range
    seedStart += size * PlayersPerCourt;
    cursorCourtIndex += size;
  }

  return result;
}

export function getTierRangeLabel(
  totalCourts: number,
  round: 1 | 2 | 3,
  courtIndexOneBased: number,
): string {
  const courts = Array.from({ length: totalCourts }, () => ({ playerNames: [], matches: [] }));
  const details = calculateCourtDetails(courts, round);
  const idx = Math.max(0, Math.min(details.length - 1, courtIndexOneBased - 1));
  return details[idx].tier;
}

export const compareTiers = (a: string, b: string): number => {
  // A < A-B < B === A-C < C === B-D, A-E, etc.
  const getAverageTierCharCode = (tier: string): number => {
    if (tier.includes('–')) {
      return (tier.charCodeAt(0) + tier.charCodeAt(2)) / 2;
    }

    return tier.charCodeAt(0);
  };

  return getAverageTierCharCode(a) - getAverageTierCharCode(b);
};

const sortPlayersForRanking = (a: PlayerDetails, b: PlayerDetails): number => {
  if (a.tier !== b.tier) return compareTiers(a.tier, b.tier);
  if (a.courtPlace !== b.courtPlace) return a.courtPlace - b.courtPlace;
  if (a.wins !== b.wins) return b.wins - a.wins;
  if (a.pointDifferential !== b.pointDifferential) return b.pointDifferential - a.pointDifferential;
  return a.seed - b.seed;
};

export function calculatePlayerRankings(courts: Court[], round: 1 | 2 | 3): PlayerDetails[] {
  if (!courts?.length) throw new Error('courts array is required.');
  if (![1, 2, 3].includes(round)) throw new Error('Supported rounds are 1, 2, or 3.');
  const courtDetails = calculateCourtDetails(courts, round);

  const playerDetails: PlayerDetails[] = courtDetails.flatMap((court) => {
    const players: PlayerDetails[] = court.playerNames.map((name, index) => ({
      name,
      courtIndex: courtDetails.indexOf(court),

      tier: court.tier,
      courtPlace: 0,
      wins: 0,
      losses: 0,
      pointDifferential: 0,
      seed: court.seeds[index],

      roundPlace: 0,
      nextCourt: 0,
      nextTier: '',
    }));

    const matchDefs = [
      { teamA: [0, 1], teamB: [2, 3], score: court.matches[0] },
      { teamA: [0, 2], teamB: [1, 3], score: court.matches[1] },
      { teamA: [0, 3], teamB: [1, 2], score: court.matches[2] },
    ];

    matchDefs.forEach((md) => {
      const { scoreA = 0, scoreB = 0 } = md.score;

      // update wins, losses, pointDifferential
      md.teamA.forEach((pi) => {
        const player = players[pi];
        player.pointDifferential += scoreA - scoreB;
        if (scoreA > scoreB) {
          player.wins += 1;
        } else {
          player.losses += 1;
        }
      });
      md.teamB.forEach((pi) => {
        const player = players[pi];
        player.pointDifferential += scoreB - scoreA;
        if (scoreB > scoreA) {
          player.wins += 1;
        } else {
          player.losses += 1;
        }
      });
    });

    return players;
  });

  // Sort players for ranking
  playerDetails.sort(sortPlayersForRanking);

  // Assign roundPlace based on sorted order
  playerDetails.forEach((pd, index) => {
    pd.roundPlace = index + 1;
  });

  const nextCourtPlace = courts.map(() => 1); // track next courtPlace per court
  for (const pd of playerDetails) {
    pd.courtPlace = nextCourtPlace[pd.courtIndex];
    nextCourtPlace[pd.courtIndex] += 1;
  }

  // Generate nextCourt and nextTier based on roundPlace
  if (round < 3) {
    const nextCourts = generateNextRoundCourts(playerDetails, round);

    playerDetails.forEach((pd) => {
      const nextCourtIndex = nextCourts.findIndex((court) => court.seeds.includes(pd.roundPlace));
      pd.nextCourt = nextCourtIndex + 1;
      pd.nextTier = nextCourts[nextCourtIndex].tier;
    });
  }

  return playerDetails;
}

export const generateNextRoundCourts = (
  playerDetails: PlayerDetails[],
  currentRound: 1 | 2 | 3,
): CourtDetails[] => {
  const nextRound = (currentRound + 1) as 1 | 2 | 3;
  const totalCourts = Math.ceil(playerDetails.length / PlayersPerCourt);
  let courtDetails = calculateCourtDetails(
    Array.from({ length: totalCourts }, () => ({ playerNames: [], matches: [] })),
    nextRound,
  );

  courtDetails = courtDetails.map((court) => ({
    ...court,
    playerNames: court.seeds.map((seed) => playerDetails[seed - 1].name),
    matches: [{}, {}, {}],
  }));

  return courtDetails;
};


type ActiveView = number | 'rankings';

export function useMatchCalculator() {
  // Persistent player count + courts + round (persisted)
  const {
    courts: localCourts,
    setCourts: setLocalCourts,
    round: localRound,
    setRound: setLocalRound,
    resetAllStorage,
  } = useCalculatorPersistence();

  // Optional realtime match integration (enabled via Vite env VITE_LIVE_MATCH_ID)
  const liveMatchId = (import.meta.env.VITE_LIVE_MATCH_ID as string) ?? null;
  const { data: remoteData, write: writeRemote } = useRealtimeMatch(liveMatchId);

  // Optimistic overlay for UI updates while remote write is pending
  const [optimisticCourts, setOptimisticCourts] = useState<Court[] | null>(null);

  // Source-of-truth: optimistic -> remote -> local
  const courts = optimisticCourts ?? remoteData?.courts ?? localCourts;
  const round = (remoteData?.round as 1 | 2 | 3) ?? localRound;

  // Unified setters: write to remote when live mode active, but always update local storage for offline
  const setCourts = useCallback(
    (updater: Court[] | ((prev: Court[]) => Court[])) => {
      const next =
        typeof updater === 'function' ? (updater as (p: Court[]) => Court[])(courts) : (updater as Court[]);

      // Always update local storage immediately
      // (debug log to help diagnose court count issues)
      // eslint-disable-next-line no-console
      console.log('[useMatchCalculator] setCourts -> next courts count:', Array.isArray(next) ? next.length : typeof next);
      setLocalCourts(next);

      // Always apply optimistic overlay so UI reflects the change immediately
      setOptimisticCourts(next);

      if (writeRemote && liveMatchId) {
        void writeRemote({ courts: next }).catch(() => {
          // on failure, clear optimistic overlay so remote/local reconcile
          setOptimisticCourts(null);
        });
      }
    },
    [writeRemote, liveMatchId, courts, setLocalCourts, setOptimisticCourts],
  );

  const setRound = useCallback(
    (r: 1 | 2 | 3) => {
      if (writeRemote && liveMatchId) {
        setLocalRound(r);
        void writeRemote({ round: r });
      } else {
        setLocalRound(r);
      }
    },
    [writeRemote, liveMatchId, setLocalRound],
  );

  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>(0);
  const [copyFeedback, setCopyFeedback] = useState(false);

  /* Persistence handled by useLocalStorageState hook */

  /* Actions */

  const setPlayerName = useCallback(
    (courtIdx: number, slotIdx: number, name: string | null) => {
      const nm = (name ?? '').toString();
      const used = new Set<string>();

      courts.forEach((c, ci) =>
        c.playerNames.forEach((p, pi) => {
          if (ci === courtIdx && pi === slotIdx) return;
          if (p) used.add(p);
        }),
      );

      if (!nm || !used.has(nm) || courts[courtIdx].playerNames[slotIdx] === nm) {
        setDuplicateError(null);
        setCourts((prev) =>
          prev.map((c, ci) =>
            ci !== courtIdx
              ? c
              : {
                  ...c,
                  playerNames: c.playerNames.map((p, pi) => (pi === slotIdx ? nm : p)),
                },
          ),
        );
      } else {
        setDuplicateError(`${nm} is already selected in another slot`);
      }
    },
    [courts, setCourts],
  );

  const setScore = useCallback(
    (courtIdx: number, matchIdx: number, team: 'scoreA' | 'scoreB', value?: number) => {
      setCourts((prev) =>
        prev.map((c, ci) =>
          ci !== courtIdx
            ? c
            : {
                ...c,
                matches: c.matches.map((m, mi) => (mi === matchIdx ? { ...m, [team]: value } : m)),
              },
        ),
      );
    },
    [setCourts],
  );

  const playerRankings = useMemo(() => calculatePlayerRankings(courts, round), [courts, round]);

  const advanceToNextRound = useCallback(() => {
    const nextCourts = generateNextRoundCourts(playerRankings, round);

    setRound((round + 1) as 2 | 3);
    setCourts(nextCourts);
  }, [playerRankings, round, setCourts, setRound]);

  const resetAll = useCallback(() => {
    if (!window.confirm('Are you sure you want to clear all data and start over?')) return;

    resetAllStorage();
    setDuplicateError(null);
  }, [resetAllStorage]);

  const copyRankingsToClipboard = useCallback(() => {
    // TODO
  }, []);

  /* Derived values */
  const totalMatches = courts.length * 3;
  const completedMatches = courts.reduce(
    (acc, c) =>
      acc + c.matches.filter((m) => m.scoreA !== undefined && m.scoreB !== undefined).length,
    0,
  );
  const progressPercent = Math.round((completedMatches / Math.max(1, totalMatches)) * 100);

  const courtDetails = useMemo(() => calculateCourtDetails(courts, round), [courts, round]);

  return {
    // state
    courtDetails,
    setCourts,
    round,
    setRound,
    duplicateError,
    activeView,
    setActiveView,
    copyFeedback,
    // realtime info (when enabled)
    connected: !!remoteData,
    pending: false,
    liveMatchId,

    // actions
    setPlayerName,
    setScore,
    advanceToNextRound,
    resetAll,
    copyRankingsToClipboard,

    // derived
    playerRankings,
    totalMatches,
    completedMatches,
    progressPercent,
  } as const;
}

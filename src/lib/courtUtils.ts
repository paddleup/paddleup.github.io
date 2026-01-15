import { Court, RoundNumber, CourtWithDrawAndGames } from '../types';

export const PlayersPerCourt: number = 4;

export type Draw = {
  seeds: number[];
  tier: string;
  // round: number;
};

export type PlayerDetails = {
  id: string;
  courtIndex: number;

  // Used to determine round place in order of precidence
  tier: string;
  courtRank: number;
  wins: number;
  losses: number;
  pointDifferential: number;
  seed: number;

  // round results
  roundPlace: number;

  // next round assignment
  nextCourt?: number;
  nextTier?: string;
};

// -------- Provided helper (using exactly as requested) --------
export const calculateTierRangeCount = (totalNumberOfCourts: number, round: number): number => {
  if (round === 3) return totalNumberOfCourts;
  if (round === 2 || round === 1) {
    return Math.ceil(calculateTierRangeCount(totalNumberOfCourts, round + 1) / 3);
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

export const calculateDraws = (totalCourts: number, round: 1 | 2 | 3): Draw[] => {
  if (totalCourts <= 0) return [];
  if (![1, 2, 3].includes(round)) return [];

  const rangeCount = calculateTierRangeCount(totalCourts, round);

  const baseSize = Math.floor(totalCourts / rangeCount);
  const remainder = totalCourts % rangeCount;

  const result: Draw[] = [];
  let cursorCourtIndex = 0; // absolute court index (0-based)
  let seedStart = 1; // next seed start across ranges
  for (let r = 0; r < rangeCount; r++) {
    const size = baseSize + (r < remainder ? 1 : 0);
    const tier = tierRange(cursorCourtIndex, cursorCourtIndex + size - 1);
    const groups = snakeDraw(size, seedStart);
    for (let i = 0; i < size; i++) {
      result.push({ seeds: groups[i], tier });
    }

    // Advance seed start and court cursor to the next range
    seedStart += size * PlayersPerCourt;
    cursorCourtIndex += size;
  }

  return result;
};

export const useDraws = (totalCourts?: number, round?: RoundNumber): Draw[] => {
  if (!totalCourts || !round || totalCourts <= 0) return [];
  return calculateDraws(totalCourts, round as 1 | 2 | 3);
};

const getAverageTierCharCode = (tier: string): number =>
  tier.includes('–') ? (tier.charCodeAt(0) + tier.charCodeAt(2)) / 2 : tier.charCodeAt(0);

// A < A-B < B === A-C < C === B-D, A-E, etc.
export const compareTiers = (a: string, b: string): number =>
  getAverageTierCharCode(a) - getAverageTierCharCode(b);

const rankPlayersByPerformance = (a: PlayerDetails, b: PlayerDetails): number => {
  if (a.tier !== b.tier) return compareTiers(a.tier, b.tier);
  if (a.courtRank !== b.courtRank) return a.courtRank - b.courtRank;
  if (a.wins !== b.wins) return b.wins - a.wins;
  if (a.pointDifferential !== b.pointDifferential) return b.pointDifferential - a.pointDifferential;
  return a.seed - b.seed;
};

export function calculatePlayerRankings(
  courts: CourtWithDrawAndGames[],
  round: 1 | 2 | 3,
): PlayerDetails[] {
  if (!courts?.length) return [];
  if (![1, 2, 3].includes(round)) return [];

  const draws = calculateDraws(courts.length, round);

  const playerDetails: PlayerDetails[] = courts.flatMap((court, courtIndex) => {
    const players: PlayerDetails[] = court.playerIds.map((playerId, index) => ({
      id: playerId,
      courtIndex,

      tier: draws[courtIndex].tier,
      courtRank: 0,
      wins: 0,
      losses: 0,
      pointDifferential: 0,
      seed: draws[courtIndex].seeds[index],

      roundPlace: 0,
      nextCourt: 0,
      nextTier: '',
    }));

    court.games.forEach((game) => {
      const {
        team1Player1Id,
        team1Player2Id,
        team2Player1Id,
        team2Player2Id,
        team1Score = 0,
        team2Score = 0,
      } = game;

      const updateWinsLossesAndDiff = (
        player: PlayerDetails,
        score: number,
        opponentScore: number,
        isTeamA: boolean,
      ) => {
        const wonGame = score > opponentScore || (score === opponentScore && isTeamA);
        player.wins += wonGame ? 1 : 0;
        player.losses += wonGame ? 0 : 1;
        player.pointDifferential += score - opponentScore;
      };

      const player1 = players.find((p) => p.id === team1Player1Id)!;
      const player2 = players.find((p) => p.id === team1Player2Id)!;
      const player3 = players.find((p) => p.id === team2Player1Id)!;
      const player4 = players.find((p) => p.id === team2Player2Id)!;

      updateWinsLossesAndDiff(player1, team1Score, team2Score, true);
      updateWinsLossesAndDiff(player2, team1Score, team2Score, true);
      updateWinsLossesAndDiff(player3, team2Score, team1Score, false);
      updateWinsLossesAndDiff(player4, team2Score, team1Score, false);
    });

    return players;
  });

  // Sort players for ranking
  playerDetails.sort(rankPlayersByPerformance);

  const courtRankCounter = courts.map(() => 1);
  for (const pd of playerDetails) {
    pd.courtRank = courtRankCounter[pd.courtIndex];
    courtRankCounter[pd.courtIndex] += 1;
  }

  playerDetails.sort(rankPlayersByPerformance);

  // Assign roundPlace based on sorted order
  playerDetails.forEach((pd, index) => {
    pd.roundPlace = index + 1;
  });

  // Generate nextCourt and nextTier based on roundPlace
  if (round < 3) {
    const draws = calculateDraws(courts.length, (round + 1) as 1 | 2 | 3);

    playerDetails.forEach((pd) => {
      const nextCourtIndex = draws.findIndex((draw) => draw.seeds.includes(pd.roundPlace));
      pd.nextCourt = nextCourtIndex + 1;
      pd.nextTier = draws[nextCourtIndex].tier;
    });
  }

  return playerDetails;
}

export const generateNextRoundCourts = (
  playerDetails: PlayerDetails[],
  currentRound: 1 | 2 | 3,
): Court[] => {
  const nextRound = (currentRound + 1) as 1 | 2 | 3;
  const totalCourts = Math.ceil(playerDetails.length / PlayersPerCourt);
  const draws = calculateDraws(totalCourts, nextRound);

  const courts = draws.map((draw, index) => ({
    playerIds: draw.seeds.map((seed) => playerDetails.find((p) => p.roundPlace === seed)?.id || ''),
    roundNumber: nextRound,
    courtNumber: index + 1,
  }));

  return courts;
};

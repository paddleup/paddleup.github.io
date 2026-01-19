import { Court, CourtWithDrawAndGames, Draw, Game, Player, RoundNumber } from '../types';

export const getNumberOfCourts = (totalPlayers: number, preferredCourtSize: 4 | 5 = 5): number => {
  const nonPreferredCourtSize = preferredCourtSize === 5 ? 4 : 5;
  // use recursion to find a valid court count, where each court has either preferredCourtSize or nonPreferredCourtSize players
  const findValidCourtCount = (playersLeft: number, courtCount: number): number => {
    if (playersLeft === 0) return courtCount;
    if (playersLeft < 0) return -1;
    if (courtCount >= 7) return -1; // limit to max 7 courts

    // try to allocate preferredCourtSize players to the next court
    const withPreferred = findValidCourtCount(playersLeft - preferredCourtSize, courtCount + 1);
    if (withPreferred !== -1) return withPreferred;
    // try to allocate nonPreferredCourtSize players to the next court
    return findValidCourtCount(playersLeft - nonPreferredCourtSize, courtCount + 1);
  };

  const courtCount = findValidCourtCount(totalPlayers, 0);
  if (courtCount <= 0) {
    throw new Error('Invalid number of players for court allocation');
  }

  return courtCount;
};

export const isValidNumberOfPlayers = (totalPlayers: number): boolean => {
  try {
    getNumberOfCourts(totalPlayers, 5);
    return true;
  } catch {
    return false;
  }
};

export const generateChallengeEventDraw = (
  totalPlayers: number,
  roundNumber: RoundNumber,
  preferredCourtSize: 4 | 5 = 5,
): Draw[] => {
  const numberOfCourts = getNumberOfCourts(totalPlayers, preferredCourtSize);
  const draws: Draw[] = Array.from({ length: numberOfCourts }, () => ({ seeds: [] }));

  // Distribute players to courts in a snake pattern for round 1
  // For round 2, we can just assign based on court rank, highest players on the highest court
  // Have higher courts get the extra player if uneven distribution
  let courtIndex = 0;
  let direction = 1; // 1 for forward, -1 for backward

  if (roundNumber === 1) {
    for (let seed = 1; seed <= totalPlayers; seed++) {
      draws[courtIndex].seeds.push(seed);
      courtIndex += direction;
      if (courtIndex === numberOfCourts || courtIndex === -1) {
        direction *= -1;
        courtIndex += direction;
      }
    }
  } else if (roundNumber === 2) {
    // Calculate base size and remainder for round 2
    const baseSize = Math.floor(totalPlayers / numberOfCourts);
    let remainder = totalPlayers % numberOfCourts;
    let currentSeed = 1;
    for (let i = 0; i < numberOfCourts; i++) {
      const courtSize = baseSize + (remainder > 0 ? 1 : 0);
      for (let j = 0; j < courtSize; j++) {
        draws[i].seeds.push(currentSeed++);
      }
      if (remainder > 0) remainder--;
    }
  }

  return draws;
};

export const generateCourts = (
  playerIds: string[],
  roundNumber: RoundNumber,
  preferredCourtSize: 4 | 5 = 5,
): Court[] => {
  const totalPlayers = playerIds.length;
  const draws = generateChallengeEventDraw(totalPlayers, roundNumber, preferredCourtSize);
  const courts: Court[] = draws.map((draw, index) => {
    const courtPlayerIds = draw.seeds.map((seed) => playerIds[seed - 1]);
    return {
      courtNumber: index + 1,
      playerIds: courtPlayerIds,
      roundNumber,
    };
  });
  return courts;
};

export const generateGames = (court: Court): Game[] => {
  const { roundNumber, playerIds } = court;
  if (playerIds.length === 4) {
    // For 4 players, create 3 games: 1,2 vs 3,4; 1,3 vs 2,4; 1,4 vs 2,3
    const [p1, p2, p3, p4] = playerIds;
    const arrangements = [
      {
        team1: { player1Id: p1, player2Id: p2 },
        team2: { player1Id: p3, player2Id: p4 },
      },
      {
        team1: { player1Id: p1, player2Id: p3 },
        team2: { player1Id: p2, player2Id: p4 },
      },
      {
        team1: { player1Id: p1, player2Id: p4 },
        team2: { player1Id: p2, player2Id: p3 },
      },
    ];

    return arrangements.map((arrangement) => ({ ...arrangement, roundNumber }));
  }

  if (playerIds.length === 5) {
    // For 5 players, create 5 games: 1,2 vs 3,4; 2,3 vs 4,5; 1,3 vs 2,5; 1,4 vs 3,5; 1,5 vs 2,4
    const [p1, p2, p3, p4, p5] = playerIds;
    const arrangements = [
      {
        team1: { player1Id: p1, player2Id: p2 },
        team2: { player1Id: p3, player2Id: p4 },
      },
      {
        team1: { player1Id: p2, player2Id: p3 },
        team2: { player1Id: p4, player2Id: p5 },
      },
      {
        team1: { player1Id: p1, player2Id: p3 },
        team2: { player1Id: p2, player2Id: p5 },
      },
      {
        team1: { player1Id: p1, player2Id: p4 },
        team2: { player1Id: p3, player2Id: p5 },
      },
      {
        team1: { player1Id: p1, player2Id: p5 },
        team2: { player1Id: p2, player2Id: p4 },
      },
    ];

    return arrangements.map((arrangement) => ({ ...arrangement, roundNumber }));
  }

  throw new Error('Invalid number of players for game generation');
};

const rankPlayersByPerformance = (
  a: PlayerDetails,
  b: PlayerDetails,
  roundNumber: RoundNumber,
): number => {
  if (roundNumber === 2 && a.courtNumber !== b.courtNumber) {
    return a.courtNumber - b.courtNumber;
  }

  if (a.pointWinRate !== b.pointWinRate) {
    return b.pointWinRate - a.pointWinRate;
  }

  // const getWinRatio = (player: PlayerDetails): number => {
  //   const totalGames = player.wins + player.losses;
  //   return totalGames === 0 ? 0 : player.wins / totalGames;
  // };

  // const winRatioA = getWinRatio(a);
  // const winRatioB = getWinRatio(b);
  // if (winRatioA !== winRatioB) return winRatioB - winRatioA;
  // if (a.pointDifferential !== b.pointDifferential) return b.pointDifferential - a.pointDifferential;
  return a.seed - b.seed;
};

export type PlayerDetails = Partial<Player> & {
  id: string;

  // Used to determine round place in order of precidence
  courtNumber: number;
  wins: number;
  losses: number;
  pointsEarned: number;
  pointsAgainst: number;

  pointWinRate: number;

  pointDifferential: number;
  seed: number;

  // round results
  roundPlace: number;

  // next round assignment
  nextCourt?: number;
  // nextSeed?: string;
};

export function calculatePlayerRankings(
  courts: CourtWithDrawAndGames[],
  roundNumber: RoundNumber,
): PlayerDetails[] {
  if (!courts?.length) return [];
  if (![1, 2, 3].includes(roundNumber)) return [];

  const totalPlayers = courts.reduce((sum, court) => sum + court.playerIds.length, 0);
  const draws = generateChallengeEventDraw(totalPlayers, roundNumber);

  const playerDetails: PlayerDetails[] = courts.flatMap((court, courtIndex) => {
    const players: PlayerDetails[] = court.playerIds.map((playerId, index) => ({
      id: playerId,

      courtNumber: court.courtNumber,
      wins: 0,
      losses: 0,
      pointDifferential: 0,
      pointsEarned: 0,
      pointsAgainst: 0,
      pointWinRate: 0,
      seed: draws[courtIndex].seeds[index],

      roundPlace: 0,
      nextCourt: 0,
    }));

    for (const game of court.games) {
      const { team1, team2, team1Score, team2Score } = game;

      const updateWinsLossesAndDiff = (
        player: PlayerDetails,
        score?: number,
        opponentScore?: number,
        isTeamA?: boolean,
      ) => {
        if (score === undefined || opponentScore === undefined) return;
        const wonGame = score > opponentScore || (score === opponentScore && isTeamA);
        player.wins += wonGame ? 1 : 0;
        player.losses += wonGame ? 0 : 1;
        player.pointsEarned += score;
        player.pointsAgainst += opponentScore;
        const totalPoints = score + opponentScore;
        player.pointWinRate = totalPoints === 0 ? 0 : player.pointsEarned / totalPoints;
        player.pointDifferential += score - opponentScore;
      };

      const team1Player1 = players.find((p) => p.id === team1.player1Id)!;
      const team1Player2 = players.find((p) => p.id === team1.player2Id)!;
      const team2Player1 = players.find((p) => p.id === team2.player1Id)!;
      const team2Player2 = players.find((p) => p.id === team2.player2Id)!;

      updateWinsLossesAndDiff(team1Player1, team1Score, team2Score, true);
      updateWinsLossesAndDiff(team1Player2, team1Score, team2Score, true);
      updateWinsLossesAndDiff(team2Player1, team2Score, team1Score, false);
      updateWinsLossesAndDiff(team2Player2, team2Score, team1Score, false);
    }

    return players;
  });

  // Sort players for ranking
  const compareFn = (a: PlayerDetails, b: PlayerDetails) =>
    rankPlayersByPerformance(a, b, roundNumber);
  playerDetails.sort(compareFn);

  // Assign roundPlace based on sorted order
  playerDetails.forEach((pd, index) => {
    pd.roundPlace = index + 1;
  });

  // Generate nextCourt and nextTier based on roundPlace
  if (roundNumber === 1) {
    const totalPlayers = courts.reduce((sum, court) => sum + court.playerIds.length, 0);
    const draws = generateChallengeEventDraw(totalPlayers, 2);

    playerDetails.forEach((pd) => {
      const nextCourtIndex = draws.findIndex((draw) => draw.seeds.includes(pd.roundPlace));
      pd.nextCourt = nextCourtIndex + 1;
    });
  }

  return playerDetails;
}

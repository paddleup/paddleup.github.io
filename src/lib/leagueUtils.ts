import { rules } from '../data/rules';
import { Season, PlayerStats, AllTimeStats, Player, Match, Week } from '../types';

/**
 * Points mapping by rank (courts).
 */
export const getPointsForRank = (rank: number): number => {
  const { championship, court2, court3, court4 } = rules.points;

  // Helper to safely index readonly literal objects
  const safeLookup = (obj: any, key: number) => {
    return (obj && (obj as any)[key]) ? (obj as any)[key] : 0;
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

/**
 * Compute per-week aggregates from matches.
 */
const aggregatesFromWeek = (week: Week): Record<string, PlayerStats> => {
  const agg: Record<string, PlayerStats> = {};

  const ensure = (pid: string) => {
    if (!agg[pid]) {
      agg[pid] = {
        id: pid,
        points: 0,
        wins: 0,
        losses: 0,
        pointsWon: 0,
        pointsLost: 0,
        diff: 0,
        appearances: 0,
        champCourt: 0,
        weeklyRanks: []
      };
    }
  };

  if (!week.matches) return agg;

  week.matches.forEach((m: Match) => {
    const { team1, team2, score1, score2 } = m;
    const team1Won = score1 > score2;
    const team2Won = score2 > score1;

    // Ensure all player entries exist and increment appearance
    team1.forEach(pid => { ensure(pid); agg[pid].appearances += 1; });
    team2.forEach(pid => { ensure(pid); agg[pid].appearances += 1; });

    // Points and diff
    team1.forEach(pid => {
      agg[pid].pointsWon += score1;
      agg[pid].pointsLost += score2;
      agg[pid].diff += (score1 - score2);
      if (team1Won) agg[pid].wins += 1;
      if (team2Won || score1 === score2) agg[pid].losses += 1;
    });
    team2.forEach(pid => {
      agg[pid].pointsWon += score2;
      agg[pid].pointsLost += score1;
      agg[pid].diff += (score2 - score1);
      if (team2Won) agg[pid].wins += 1;
      if (team1Won || score1 === score2) agg[pid].losses += 1;
    });
  });

  return agg;
};


/**
 * Compute final positions for a week based on round 3 court assignments.
 * Returns null if week is not eligible (missing round 3/court metadata or not completed).
 */
export const calculateWeekFinalPositions = (week: Week) => {
  // Use pre-computed standings when available. Expect week.standings to be
  // an array of player ids ordered by final ranking (1..N). If standings are
  // not present or the week is not completed, return null so callers skip it.
  if (!week.isCompleted || !Array.isArray((week as any).standings) || (week as any).standings.length === 0) return null;

  const standings = (week as any).standings as string[];
  const results: {
    playerId: string;
    finalCourt: number;
    finalPosition: number;
    globalRank: number;
    pointsEarned: number;
  }[] = [];

  standings.forEach((pid, idx) => {
    const globalRank = idx + 1;
    const finalCourt = Math.ceil(globalRank / 4);
    const finalPosition = ((globalRank - 1) % 4) + 1;
    const pointsEarned = getPointsForRank(globalRank);
    results.push({
      playerId: pid,
      finalCourt,
      finalPosition,
      globalRank,
      pointsEarned
    });
  });

  return results;
};

/**
 * Calculate season-level aggregated PlayerStats by deriving weekly final court positions from matches.
 * Points for a week are only awarded based on final positions after round 3 (per rules).
 */
export const calculateSeasonStats = (seasonData: Season): PlayerStats[] => {
  const cumulative: Record<string, PlayerStats> = {};

  if (!seasonData.weeks) return [];

  seasonData.weeks.forEach(week => {
    if (!week.isCompleted) return;

    const finalPositions = calculateWeekFinalPositions(week);
    if (!finalPositions) return; // require stored standings for the week

    // Only aggregate points/appearances from final standings (no per-match stats)
    finalPositions.forEach(fp => {
      const pid = fp.playerId;
      if (!cumulative[pid]) {
        cumulative[pid] = {
          id: pid,
          points: 0,
          wins: 0,
          losses: 0,
          pointsWon: 0,
          pointsLost: 0,
          diff: 0,
          appearances: 0,
          champCourt: 0,
          weeklyRanks: []
        };
      }

      cumulative[pid].points += fp.pointsEarned;
      cumulative[pid].appearances += 1; // one appearance per completed event where player appears in standings
      cumulative[pid].weeklyRanks.push(fp.globalRank);
      if (fp.globalRank <= 4) cumulative[pid].champCourt += 1;
    });
  });

  // Convert to array and sort final season standings by points (primary), wins, diff
  return Object.values(cumulative).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.wins !== a.wins) return b.wins - a.wins;
    return b.diff - a.diff;
  });
};

/**
 * Calculate all-time stats by summing season points.
 * For past seasons that provide stored standings we use them; otherwise derive from matches.
 */
export const calculateAllTimeStats = (currentSeason: Season, pastSeasons: Season[]): AllTimeStats[] => {
  const allStats: Record<string, { points: number; seasons: number }> = {};
  
  // Process current season (derive)
  const currentStats = calculateSeasonStats(currentSeason);
  currentStats.forEach(p => {
    if (!allStats[p.id]) allStats[p.id] = { points: 0, seasons: 0 };
    allStats[p.id].points += p.points;
    allStats[p.id].seasons += 1;
  });

  // Process past seasons (use stored standings if present, else derive)
  pastSeasons.forEach(season => {
    if (season.standings && season.standings.length > 0) {
      season.standings.forEach(p => {
        if (!allStats[p.playerId]) allStats[p.playerId] = { points: 0, seasons: 0 };
        allStats[p.playerId].points += p.points;
        allStats[p.playerId].seasons += 1;
      });
    } else {
      const derived = calculateSeasonStats(season);
      derived.forEach(p => {
        if (!allStats[p.id]) allStats[p.id] = { points: 0, seasons: 0 };
        allStats[p.id].points += p.points;
        allStats[p.id].seasons += 1;
      });
    }
  });

  return Object.entries(allStats)
    .map(([playerId, stats]) => ({
      playerId,
      points: stats.points,
      seasons: stats.seasons
    }))
    .sort((a, b) => b.points - a.points)
    .map((stat, index) => ({ ...stat, rank: index + 1 }));
};

/**
 * Helpers used by the calculator UI (existing logic preserved).
 */
export const getNextCourt = (round: number | string, court: number | string, rank: number): number | string => {
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
    return "DONE";
  }
  return "TBD";
};

export const generateSnakeDraw = (rankedPlayers: Player[]): { id: number; name: string; indices: number[]; players: (Player & { seed: number })[] }[] => {
  // Snake Draw Logic
  // Court 1: 1, 8, 9, 16 (Indices: 0, 7, 8, 15)
  // Court 2: 2, 7, 10, 15 (Indices: 1, 6, 9, 14)
  // Court 3: 3, 6, 11, 14 (Indices: 2, 5, 10, 13)
  // Court 4: 4, 5, 12, 13 (Indices: 3, 4, 11, 12)
  
  const courts = [
    { id: 1, name: "Court 1", indices: [0, 7, 8, 15] },
    { id: 2, name: "Court 2", indices: [1, 6, 9, 14] },
    { id: 3, name: "Court 3", indices: [2, 5, 10, 13] },
    { id: 4, name: "Court 4", indices: [3, 4, 11, 12] },
  ];

  return courts.map(court => ({
    ...court,
    players: court.indices
      .map(idx => rankedPlayers[idx])
      .filter(Boolean) // Handle case where < 16 players selected
      .map((p, i) => ({ ...p, seed: court.indices[i] + 1 }))
  }));
};

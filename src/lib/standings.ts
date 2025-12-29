import { Week, PlayerStats, Match } from '../types';
import { getPointsForRank } from './points';

/**
 * Compute per-week aggregates from matches.
 */
export const aggregatesFromWeek = (week: Week): Record<string, PlayerStats> => {
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
        weeklyRanks: [],
      };
    }
  };

  if (!week.matches) return agg;

  week.matches.forEach((m: Match) => {
    const { team1, team2, score1, score2 } = m;
    const team1Won = score1 > score2;
    const team2Won = score2 > score1;

    // Ensure all player entries exist and increment appearance
    team1.forEach((pid) => {
      ensure(pid);
      agg[pid].appearances += 1;
    });
    team2.forEach((pid) => {
      ensure(pid);
      agg[pid].appearances += 1;
    });

    // Points and diff
    team1.forEach((pid) => {
      agg[pid].pointsWon += score1;
      agg[pid].pointsLost += score2;
      agg[pid].diff += score1 - score2;
      if (team1Won) agg[pid].wins += 1;
      if (team2Won || score1 === score2) agg[pid].losses += 1;
    });
    team2.forEach((pid) => {
      agg[pid].pointsWon += score2;
      agg[pid].pointsLost += score1;
      agg[pid].diff += score2 - score1;
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
  if (
    !week.isCompleted ||
    !Array.isArray((week as any).standings) ||
    (week as any).standings.length === 0
  )
    return null;

  const standings = (week as any).standings as string[];
  const results: {
    playerId: string;
    court: number;
    position: number;
    rank: number;
    pointsEarned: number;
  }[] = [];

  standings.forEach((pid, idx) => {
    const rank = idx + 1;
    const court = Math.ceil(rank / 4);
    const position = ((rank - 1) % 4) + 1;
    const pointsEarned = getPointsForRank(rank);
    results.push({
      playerId: pid,
      court,
      position,
      rank,
      pointsEarned,
    });
  });

  return results;
};

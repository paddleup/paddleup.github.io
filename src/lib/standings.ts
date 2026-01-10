import { Week, PlayerStats, Match, Event } from '../types';
import { getPointsForRank } from './points';
import { createDefaultPlayerStats } from './utils';

/**
 * Compute per-week aggregates from matches.
 */
export const aggregatesFromWeek = (week: Week): Record<string, PlayerStats> => {
  const agg: Record<string, PlayerStats> = {};

  if (!week.matches) return agg;

  week.matches.forEach((m: Match) => {
    const { team1, team2, score1, score2 } = m;
    const team1Won = score1 > score2;
    const team2Won = score2 > score1;

    const processTeam = (team: string[], score: number, oppScore: number, won: boolean) => {
      team.forEach((pid) => {
        if (!agg[pid]) agg[pid] = createDefaultPlayerStats(pid);
        const p = agg[pid];
        p.appearances += 1;
        p.pointsWon += score;
        p.pointsLost += oppScore;
        p.diff += score - oppScore;
        if (won) p.wins += 1;
        else p.losses += 1;
      });
    };

    processTeam(team1, score1, score2, team1Won);
    processTeam(team2, score2, score1, team2Won);
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

/**
 * Aggregates player stats across multiple events.
 */
export const aggregateStatsFromEvents = (events: Event[]) => {
  const pointsByPlayer = new Map<string, { points: number; events: number; champWins: number }>();

  events.forEach((ev) => {
    // Only process events with final standings
    if (!ev.standings || ev.standings.length === 0) return;

    // Synthetic Week object for calculateWeekFinalPositions
    const weekLike: Week = {
      id: ev.id,
      date: ev.startDateTime ? ev.startDateTime.toISOString() : ev.id,
      isCompleted: true,
      standings: ev.standings,
    };

    const finals = calculateWeekFinalPositions(weekLike);
    if (!finals) return;

    finals.forEach((f) => {
      const id = f.playerId;
      const pts = f.pointsEarned || 0;
      const entry = pointsByPlayer.get(id) || { points: 0, events: 0, champWins: 0 };
      entry.points += pts;
      entry.events += 1;
      if (f.rank === 1) entry.champWins += 1;
      pointsByPlayer.set(id, entry);
    });
  });

  return pointsByPlayer;
};

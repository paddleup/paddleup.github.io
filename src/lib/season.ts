import { Season, PlayerStats, AllTimeStats } from '../types';
import { calculateWeekFinalPositions } from './standings';
import { createDefaultPlayerStats } from './utils';

/**
 * Calculate season-level aggregated PlayerStats by deriving weekly final court positions from matches.
 * Points for a week are only awarded based on final positions after round 3 (per rules).
 */
export const calculateSeasonStats = (seasonData: Season): PlayerStats[] => {
  const cumulative: Record<string, PlayerStats> = {};

  if (!seasonData.weeks) return [];

  seasonData.weeks.forEach((week) => {
    if (!week.isCompleted) return;

    const finalPositions = calculateWeekFinalPositions(week);
    if (!finalPositions) return; // require stored standings for the week

    // Only aggregate points/appearances from final standings (no per-match stats)
    finalPositions.forEach((fp) => {
      const pid = fp.playerId;
      if (!cumulative[pid]) {
        cumulative[pid] = createDefaultPlayerStats(pid);
      }

      const p = cumulative[pid];
      p.points += fp.pointsEarned;
      p.appearances += 1; // one appearance per completed event where player appears in standings
      p.weeklyRanks.push(fp.rank);
      if (fp.rank <= 4) p.champCourt += 1;
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
export const calculateAllTimeStats = (
  currentSeason: Season,
  pastSeasons: Season[],
): AllTimeStats[] => {
  const allStats: Record<string, { points: number; seasons: number }> = {};

  // Process current season (derive)
  const currentStats = calculateSeasonStats(currentSeason);
  currentStats.forEach((p) => {
    if (!allStats[p.id]) allStats[p.id] = { points: 0, seasons: 0 };
    allStats[p.id].points += p.points;
    allStats[p.id].seasons += 1;
  });

  // Process past seasons (use stored standings if present, else derive)
  pastSeasons.forEach((season) => {
    if (season.standings && season.standings.length > 0) {
      season.standings.forEach((p) => {
        if (!allStats[p.playerId]) allStats[p.playerId] = { points: 0, seasons: 0 };
        allStats[p.playerId].points += p.points;
        allStats[p.playerId].seasons += 1;
      });
    } else {
      const derived = calculateSeasonStats(season);
      derived.forEach((p) => {
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
      seasons: stats.seasons,
    }))
    .sort((a, b) => b.points - a.points)
    .map((stat, index) => ({ ...stat, rank: index + 1 }));
};

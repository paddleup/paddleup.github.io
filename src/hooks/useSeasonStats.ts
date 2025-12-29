import { useMemo } from 'react';
import type { Season, PlayerStats, AllTimeStats } from '../types';
import { calculateSeasonStats, calculateAllTimeStats } from '../lib/season';

/**
 * Hook to derive season and all-time stats.
 * - If `season` is provided, derives season stats for it.
 * - If `pastSeasons` provided, calculates all-time stats combining current + past.
 *
 * This is synchronous and memoized; callers can use it directly in components.
 */
export const useSeasonStats = (season?: Season, pastSeasons: Season[] = []) => {
  const seasonStats: PlayerStats[] = useMemo(() => {
    if (!season) return [];
    return calculateSeasonStats(season);
  }, [season]);

  const allTimeStats: AllTimeStats[] = useMemo(() => {
    if (!season) return [];
    return calculateAllTimeStats(season, pastSeasons);
  }, [season, pastSeasons]);

  return { seasonStats, allTimeStats };
};

export default useSeasonStats;

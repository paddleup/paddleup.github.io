import { useMemo } from 'react';
import { usePlayers, useEvents } from './firestoreHooks';
import { monthKey } from '../lib/dateUtils';
import { aggregateStatsFromEvents } from '../lib/standings';
import { rankItems } from '../lib/utils';

export const useLeaderboard = (selection: 'all' | string = 'all') => {
  const { data: players = [] } = usePlayers();
  const { data: events = [] } = useEvents();

  return useMemo(() => {
    // 1. Filter events based on selection (all or specific month)
    const filtered = events.filter((ev) => {
      // Only events with standings
      const hasStandings = Array.isArray(ev.standings) && ev.standings.length > 0;
      if (!hasStandings) return false;

      if (selection === 'all') return true;
      return monthKey(ev.startDateTime) === selection;
    });

    // 2. Aggregate stats
    const agg = aggregateStatsFromEvents(filtered);

    // 3. Convert to array and sort
    const rows = Array.from(agg.entries()).map(([playerId, v]) => ({
      playerId,
      points: v.points,
      eventsPlayed: v.events,
      champWins: v.champWins,
    }));

    rows.sort((a, b) => b.points - a.points);

    // 4. Assign ranks
    const rankedRows = rankItems(rows, (r) => r.points);

    // 5. Merge with player details
    return rankedRows.map((r) => {
      const p = players.find((pl) => pl.id === r.playerId);
      return {
        ...r,
        name: p?.name || 'Unknown',
        imageUrl: p?.imageUrl || '',
        dupr: p?.dupr,
        id: r.playerId,
      };
    });
  }, [events, players, selection]);
};

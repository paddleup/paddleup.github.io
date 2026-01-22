// TypeScript
import React from 'react';
import { useParams } from 'react-router-dom';
import { useEvents, usePlayersRealtime } from '../hooks/firestoreHooks';
import { calculateWeekFinalPositions } from '../lib/standings';
import PlayerProfilePageView from '../views/PlayerProfilePageView';

const PlayerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: players } = usePlayersRealtime();
  const { data: challengeEvents = [] } = useEvents();
  const player = players?.find((p) => p.id === id);

  // Aggregate leaderboard across challengeEvents to derive points and rank
  const eventFinals = challengeEvents
    .filter((ev) => Array.isArray((ev as any).standings) && (ev as any).standings.length > 0)
    .map((ev) => {
      const weekLike = {
        id: ev.id,
        date: ev.startDateTime ? ev.startDateTime.toISOString() : ev.id,
        isCompleted: true,
        standings: (ev as any).standings,
      } as any;
      const finals = calculateWeekFinalPositions(weekLike) || [];
      return { ev, finals };
    });

  // aggregate per-player totals
  const totals = new Map<string, { points: number; events: number; champWins: number }>();
  eventFinals.forEach(({ finals }) => {
    finals.forEach((f: any) => {
      const pid = f.playerId;
      const pts = f.pointsEarned || 0;
      const cur = totals.get(pid) || { points: 0, events: 0, champWins: 0 };
      cur.points += pts;
      cur.events += 1;
      if (f.rank === 1) cur.champWins += 1;
      totals.set(pid, cur);
    });
  });

  const aggregated = Array.from(totals.entries())
    .map(([playerId, v]) => ({
      playerId,
      points: v.points,
      eventsPlayed: v.events,
      champWins: v.champWins,
    }))
    .sort((a, b) => b.points - a.points);

  // Determine rank for this player
  let overallRank: number | null = null;
  aggregated.forEach((r, idx) => {
    if (r.playerId === id) overallRank = idx + 1;
  });

  const currentStats = totals.get(id || '') || { points: 0, events: 0, champWins: 0 };

  // Build weekly history from challengeEvents
  const weeklyHistory: { eventId: string; date: string; rank: number }[] = [];

  eventFinals.forEach(({ ev, finals }) => {
    // find this player's final entry for event
    const finalEntry = finals.find((f: any) => f.playerId === id);
    if (finalEntry) {
      weeklyHistory.push({
        eventId: ev.id,
        date: ev.startDateTime ? ev.startDateTime.toLocaleDateString() : (ev.id as string),
        rank: finalEntry.rank,
      });
    }
  });

  return (
    <PlayerProfilePageView
      player={player}
      overallRank={overallRank}
      currentStats={currentStats}
      weeklyHistory={weeklyHistory}
      challengeEvents={challengeEvents}
    />
  );
};

export default PlayerProfilePage;

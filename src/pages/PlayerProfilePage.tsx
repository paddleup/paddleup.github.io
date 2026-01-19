import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PlayerHistoryCardList from '../components/PlayerHistoryCardList';
import Card from '../components/ui/Card';
import RankBadge from '../components/ui/RankBadge';
import { Trophy, TrendingUp, Calendar, Activity, ArrowLeft } from 'lucide-react';
import { useEvents, usePlayersRealtime } from '../hooks/firestoreHooks';
import { calculateWeekFinalPositions } from '../lib/standings';

const PlayerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: players } = usePlayersRealtime();
  const { data: challengeEvents = [] } = useEvents();
  const player = players?.find((p) => p.id === id);

  if (!player) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-text-main mb-4">Player Not Found</h2>
        <Link to="/players" className="text-primary hover:underline">
          Back to Players
        </Link>
      </div>
    );
  }

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
    <div className="space-y-8 pb-12">
      <Link
        to="/players"
        className="inline-flex items-center text-text-muted hover:text-primary transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Players
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column: Player Image & Key Info */}
        <div className="md:col-span-1 space-y-6">
          <Card className="p-0 overflow-hidden border-border">
            <div className="aspect-square w-full relative bg-surface-highlight">
              {player.imageUrl ? (
                <img
                  src={
                    player.imageUrl.startsWith('/')
                      ? `${import.meta.env.BASE_URL}${player.imageUrl.slice(1)}`
                      : player.imageUrl
                  }
                  alt={player.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl font-bold text-text-muted opacity-20">
                    {player.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="p-6 text-center">
              <h1 className="text-3xl font-bold text-text-main mb-2">{player.name}</h1>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold border border-primary/20">
                  DUPR {player.dupr ?? 'N/A'}
                </span>
                <span className="bg-surface-highlight text-text-muted px-3 py-1 rounded-full text-sm font-medium border border-border">
                  Rank #{overallRank ?? '-'}
                </span>
              </div>
            </div>
          </Card>

          {/* Key Stats Grid (Moved to sidebar for desktop) */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 flex flex-col items-center justify-center text-center">
              <Trophy className="h-6 w-6 text-warning mb-2" />
              <span className="text-2xl font-bold text-text-main">{currentStats.points}</span>
              <span className="text-xs text-text-muted uppercase tracking-wider">Points</span>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center text-center">
              <TrendingUp className="h-6 w-6 text-success mb-2" />
              <span className="text-2xl font-bold text-text-main">{currentStats.champWins}</span>
              <span className="text-xs text-text-muted uppercase tracking-wider">Top Finishes</span>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center text-center">
              <Activity className="h-6 w-6 text-primary mb-2" />
              <span className="text-2xl font-bold text-text-main">{weeklyHistory.length}</span>
              <span className="text-xs text-text-muted uppercase tracking-wider">Events</span>
            </Card>
            <Card className="p-4 flex flex-col items-center justify-center text-center">
              <Calendar className="h-6 w-6 text-text-muted mb-2" />
              <span className="text-2xl font-bold text-text-main">{currentStats.events}</span>
              <span className="text-xs text-text-muted uppercase tracking-wider">Appearances</span>
            </Card>
          </div>
        </div>

        {/* Right Column: History & Trophies */}
        <div className="md:col-span-2 space-y-8">
          {/* Event Placements */}
          <Card>
            <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Event Placements
            </h3>
            <PlayerHistoryCardList
              history={weeklyHistory.map((week) => ({
                ...week,
                eventName: challengeEvents.find((e) => e.id === week.eventId)?.name,
              }))}
            />
          </Card>

          {/* Weekly Rankings */}
          <Card>
            <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Event Rankings
            </h3>
            <div className="space-y-2">
              {weeklyHistory.length > 0 ? (
                weeklyHistory
                  .slice()
                  .reverse()
                  .map((week, idx) => (
                    <Link
                      key={idx}
                      to={`/event/${week.eventId}`}
                      className="flex items-center justify-between p-2 border-b border-border last:border-0 hover:bg-surface-highlight transition-colors cursor-pointer group"
                    >
                      <span className="text-sm text-text-muted group-hover:text-text-main transition-colors">
                        {week.date}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-main group-hover:text-primary transition-colors">
                          Rank #{week.rank}
                        </span>
                        <RankBadge rank={week.rank} size="sm" />
                      </div>
                    </Link>
                  ))
              ) : (
                <p className="text-text-muted text-center py-4">No event data available.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfilePage;

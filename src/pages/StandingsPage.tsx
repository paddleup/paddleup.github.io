import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { calculateWeekFinalPositions } from '../lib/leagueUtils';
import { Trophy } from 'lucide-react';
import Card from '../components/ui/Card';
import PlayerAvatar from '../components/ui/PlayerAvatar';
import PageHeader from '../components/ui/PageHeader';
import RankBadge from '../components/ui/RankBadge';
import { Player } from '../types';
import { cn } from '../lib/utils';
import { useEvents, usePlayers } from '../hooks/firestoreHooks';

type LeaderboardRow = {
  playerId: string;
  points: number;
  eventsPlayed: number;
  rank?: number;
};

/* UI helper: build month options from events */
const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
const monthLabel = (d: Date) =>
  d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });

const StandingsPage: React.FC = () => {
  const [selection, setSelection] = useState<'all' | string>('all'); // 'all' or monthKey like "2025-12"
  const { data: players } = usePlayers();
  const { data: events } = useEvents();

  // Build month options from events? that contain startDateTime
  const months = useMemo(() => {
    const set = new Map<string, Date>();
    events?.forEach((ev) => {
      if (ev.startDateTime instanceof Date && !isNaN(ev.startDateTime.getTime())) {
        const key = monthKey(ev.startDateTime);
        if (!set.has(key)) set.set(key, ev.startDateTime);
      }
    });
    // sort descending (newest first)
    return Array.from(set.entries())
      .sort((a, b) => (a[1].getTime() < b[1].getTime() ? 1 : -1))
      .map(([key, d]) => ({ key, label: monthLabel(d) }));
  }, []);

  // Compute leaderboard rows from selected events
  const leaderboard = useMemo(() => {
    // Filter events: only those with final standings
    const filteredEvents = events?.filter(
      (ev) => Array.isArray(ev.standings) && ev.standings!.length > 0,
    );
    const filtered =
      selection === 'all'
        ? filteredEvents
        : filteredEvents?.filter((ev) => monthKey(ev.startDateTime) === selection);

    // aggregate points per player using calculateWeekFinalPositions on synthetic Week
    const pointsByPlayer = new Map<string, { points: number; events: number }>();

    filtered?.forEach((ev, idx) => {
      type WeekLike = {
        id: number | string;
        date: string;
        isCompleted: boolean;
        standings: string[];
      };
      const weekLike: WeekLike = {
        id: idx,
        date: ev.startDateTime ? ev.startDateTime.toISOString() : ev.id,
        isCompleted: true,
        standings: ev.standings!,
      };
      const finals = calculateWeekFinalPositions(weekLike as any);
      if (!finals) return;
      finals.forEach((f: { playerId: string; pointsEarned?: number }) => {
        const id = f.playerId;
        const pts = f.pointsEarned || 0;
        const entry = pointsByPlayer.get(id) || { points: 0, events: 0 };
        entry.points += pts;
        entry.events += 1;
        pointsByPlayer.set(id, entry);
      });
    });

    const rows: LeaderboardRow[] = Array.from(pointsByPlayer.entries()).map(([playerId, v]) => ({
      playerId,
      points: v.points,
      eventsPlayed: v.events,
    }));

    // sort desc by points
    rows.sort((a, b) => b.points - a.points);

    // assign ranks (1-based, tie -> same rank)
    let lastPoints: number | null = null;
    let rank = 0;
    let seen = 0;
    rows.forEach((r) => {
      seen += 1;
      if (lastPoints === null || r.points !== lastPoints) {
        rank = seen;
        lastPoints = r.points;
      }
      r.rank = rank;
    });

    return rows;
  }, [selection]);

  const handleSelectionChange = (v: string) => {
    setSelection(v === 'all' ? 'all' : v);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Challenge Leaderboard"
        subtitle="Leaderboard derived from Challenge events (month or all time)"
      >
        <div className="flex items-center gap-4">
          <select
            value={selection}
            onChange={(e) => handleSelectionChange(e.target.value)}
            className="appearance-none bg-surface border border-border text-text-main text-sm rounded-lg pl-3 pr-8 py-2"
          >
            <option value="all">All Time</option>
            {months.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </PageHeader>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-surface-highlight">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider pl-6">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Player
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Points
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Events
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-border">
              {leaderboard.map((row) => {
                const player =
                  players?.find((p) => p.id === row.playerId) ||
                  ({ name: 'Unknown', imageUrl: '', id: 'unknown' } as Player);
                return (
                  <tr
                    key={row.playerId}
                    className={cn(
                      'hover:bg-surface-highlight transition-colors',
                      (row.rank || 0) <= 4 ? 'bg-primary-light/10' : '',
                    )}
                  >
                    <td className="px-4 pl-6 py-4 whitespace-nowrap">
                      <RankBadge rank={row.rank ?? 0} />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <Link to={`/player/${row.playerId}`} className="flex items-center group">
                        <PlayerAvatar
                          imageUrl={player.imageUrl}
                          name={player.name}
                          className="mr-3 group-hover:ring-2 ring-primary transition-all"
                        />
                        <div className="text-sm font-medium text-text-main group-hover:text-primary transition-colors">
                          {player.name}
                        </div>
                        {row.rank === 1 && <Trophy className="ml-2 h-4 w-4 text-warning" />}
                      </Link>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-text-main">{row.points}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-muted">
                      {row.eventsPlayed}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default StandingsPage;

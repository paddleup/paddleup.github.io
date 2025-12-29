import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { challengeEvents } from '../data/challengeEvents';
import { calculateWeekFinalPositions } from '../lib/leagueUtils';
import { Trophy, TrendingUp } from 'lucide-react';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import PlayerAvatar from '../components/ui/PlayerAvatar';
import RankBadge from '../components/ui/RankBadge';
import { Player } from '../types';
import { players as playersData } from '../data/players';

const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
const monthLabel = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });

const Players: React.FC = () => {
  // Default to All Time view
  const [selection, setSelection] = useState<'all' | string>('all');

  // Build available months from challengeEvents
  const months = useMemo(() => {
    const map = new Map<string, Date>();
    challengeEvents.forEach((ev) => {
      if (ev.startDateTime instanceof Date && !isNaN(ev.startDateTime.getTime())) {
        const key = monthKey(ev.startDateTime);
        if (!map.has(key)) map.set(key, ev.startDateTime);
      }
    });
    return Array.from(map.entries())
      .sort((a, b) => (a[1].getTime() < b[1].getTime() ? 1 : -1))
      .map(([key, d]) => ({ key, label: monthLabel(d) }));
  }, []);

  // Aggregate player stats from challenge events (use only events with final standings)
  const playerStats = useMemo(() => {
    const events = challengeEvents.filter((ev) => Array.isArray((ev as any).standings) && (ev as any).standings.length > 0);
    const filtered = selection === 'all' ? events : events.filter((ev) => monthKey(ev.startDateTime) === selection);

    const agg = new Map<string, { points: number; events: number; champWins: number }>();

    filtered.forEach((ev, idx) => {
      const weekLike = {
        id: idx,
        date: ev.startDateTime ? ev.startDateTime.toISOString() : ev.id,
        isCompleted: true,
        standings: (ev as any).standings
      } as any;

      const finals = calculateWeekFinalPositions(weekLike);
      if (!finals) return;
      finals.forEach((f: any) => {
        const id = f.playerId;
        const pts = f.pointsEarned || 0;
        const cur = agg.get(id) || { points: 0, events: 0, champWins: 0 };
        cur.points += pts;
        cur.events += 1;
        if (f.globalRank === 1) cur.champWins += 1;
        agg.set(id, cur);
      });
    });

    // Convert to array and sort by points desc
    const rows = Array.from(agg.entries()).map(([playerId, v]) => ({
      playerId,
      points: v.points,
      eventsPlayed: v.events,
      champCourt: v.champWins
    }));

    rows.sort((a, b) => b.points - a.points);

    // assign ranks (ties share rank)
    let lastPoints: number | null = null;
    let rank = 0;
    let seen = 0;
    rows.forEach((r) => {
      seen += 1;
      if (lastPoints === null || r.points !== lastPoints) {
        rank = seen;
        lastPoints = r.points;
      }
      (r as any).rank = rank;
    });

    // merge with players data for display
    return rows.map((r) => {
      const p = playersData.find((pl) => pl.id === r.playerId) || ({ id: r.playerId, name: 'Unknown', imageUrl: '', dupr: undefined } as Player);
      return {
        ...r,
        ...p
      };
    });
  }, [selection]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Players"
        subtitle={`${playerStats.length} players • ${selection === 'all' ? 'All Time' : 'Month view'}`}
      >
        <div className="flex items-center gap-4">
          <select
            value={selection}
            onChange={(e) => setSelection(e.target.value === 'all' ? 'all' : e.target.value)}
            className="appearance-none bg-surface border border-border text-text-main text-sm rounded-lg pl-3 pr-8 py-2"
          >
            <option value="all">All Time</option>
            {months.map((m) => (
              <option key={m.key} value={m.key}>{m.label}</option>
            ))}
          </select>
        </div>
      </PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {playerStats.map((player: any) => (
          <Link key={player.id} to={`/player/${player.id}`} className="block group">
            <Card className="h-full overflow-hidden p-0 border-border group-hover:border-primary/50 transition-all group-hover:shadow-lg group-hover:shadow-primary/5 flex flex-col">
              <div className="aspect-square w-full relative bg-surface-highlight overflow-hidden">
                {player.imageUrl ? (
                  <img
                    src={player.imageUrl.startsWith('/') ? `${import.meta.env.BASE_URL}${player.imageUrl.slice(1)}` : player.imageUrl}
                    alt={player.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-highlight">
                    <span className="text-4xl font-bold text-text-muted opacity-20">{player.name?.charAt(0)}</span>
                  </div>
                )}

                <div className="absolute top-3 left-3">
                  <div className="bg-surface/90 backdrop-blur-sm border border-border px-3 py-1 rounded-full text-sm font-bold text-text-main shadow-sm">
                    #{player.rank ?? 0}
                  </div>
                </div>

                <div className="absolute top-3 right-3">
                  <div className="bg-surface/90 backdrop-blur-md border border-primary/30 px-3 py-1 rounded-full text-sm font-bold text-primary shadow-lg">
                    {player.points} pts
                  </div>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-lg font-bold text-text-main mb-1 group-hover:text-primary transition-colors text-center truncate">{player.name}</h2>
                <p className="text-xs text-text-muted text-center mb-3">DUPR {player.dupr ?? 'N/A'}</p>

                <div className="mt-auto grid grid-cols-3 gap-2 pt-3 border-t border-border text-center">
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wide mb-0.5">Events</p>
                    <p className="font-bold text-sm text-text-main">{player.eventsPlayed}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wide mb-0.5">Champ Ct</p>
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="h-3 w-3 text-success" />
                      <p className="font-bold text-sm text-text-main">{player.champCourt}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-wide mb-0.5">Rank</p>
                    <p className="font-bold text-sm text-text-main">{player.rank ?? '-'}</p>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Players;

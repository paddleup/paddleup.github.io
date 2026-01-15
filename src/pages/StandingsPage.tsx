import React, { useMemo, useState } from 'react';
import { Trophy, Target, Crown } from 'lucide-react';
import { useEvents, usePlayers } from '../hooks/firestoreHooks';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { getMonthOptions } from '../lib/dateUtils';
import LeaderboardTable from '../components/LeaderboardTable';

const StandingsPage: React.FC = () => {
  const [selection, setSelection] = useState<'all' | string>('all');
  const { data: players = [] } = usePlayers();
  const { data: events = [] } = useEvents();

  const months = useMemo(() => {
    return getMonthOptions(events.map((e) => e.startDateTime));
  }, [events]);

  const leaderboard = useLeaderboard(selection);

  // Get top 3 for highlight section
  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-warning/5 via-surface to-primary/5 rounded-3xl p-8 md:p-12 border border-warning/20 shadow-2xl">
          {/* Header with animated icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-warning to-warning/70 rounded-full shadow-lg mb-6 transform hover:scale-110 transition-all duration-300">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-text-main mb-4">
              🏆 Challenge Leaderboard
            </h1>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Leaderboard derived from Challenge events - track your progress month by month or all
              time
            </p>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-warning/10 to-transparent rounded-full blur-2xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-2xl -z-10"></div>
        </div>
      </div>

      {/* Top 3 Highlight */}
      {topThree.length > 0 && (
        <div className="relative overflow-hidden">
          <div className="bg-gradient-to-br from-success/5 via-surface to-text-accent/5 rounded-3xl p-8 md:p-12 border border-success/20 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-success to-success/70 rounded-full shadow-lg mb-6 transform hover:scale-110 transition-all duration-300">
                <Crown className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-text-main mb-4">
                👑 Current Champions
              </h2>
              <p className="text-xl text-text-muted max-w-2xl mx-auto">
                {selection === 'all'
                  ? 'All-time leaders'
                  : `${months.find((m) => m.key === selection)?.label || 'Monthly'} champions`}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
              {topThree.map((entry, index) => {
                const player = players.find((p) => p.id === entry.playerId);
                const colors = [
                  {
                    bg: 'from-warning/20 via-warning/10 to-warning/5',
                    border: 'border-warning/30',
                    text: 'text-warning',
                    emoji: '🥇',
                  },
                  {
                    bg: 'from-text-accent/20 via-text-accent/10 to-text-accent/5',
                    border: 'border-text-accent/30',
                    text: 'text-text-accent',
                    emoji: '🥈',
                  },
                  {
                    bg: 'from-bronze/20 via-bronze/10 to-bronze/5',
                    border: 'border-bronze/30',
                    text: 'text-bronze',
                    emoji: '🥉',
                  },
                ];
                const color = colors[index];

                return (
                  <div
                    key={entry.playerId}
                    className={`group relative overflow-hidden rounded-2xl bg-gradient-to-r ${color.bg} border-2 ${color.border} p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
                  >
                    <div className="text-center">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${
                          color.text === 'text-warning'
                            ? 'from-warning to-warning/80'
                            : color.text === 'text-text-accent'
                            ? 'from-text-accent to-text-accent/80'
                            : 'from-bronze to-bronze/80'
                        } rounded-full flex items-center justify-center shadow-lg mx-auto mb-4`}
                      >
                        <span className="text-2xl font-black text-white">{index + 1}</span>
                      </div>
                      <h3 className="text-xl font-bold text-text-main mb-2">
                        {player?.name || 'Unknown Player'}
                      </h3>
                      <div className="space-y-2">
                        <div className={`text-3xl font-black ${color.text}`}>{entry.points}</div>
                        <div className="text-text-muted font-medium">Points</div>
                        <div className="text-sm text-text-muted">{entry.eventsPlayed} Events</div>
                      </div>
                    </div>
                    <div className="text-4xl opacity-50 absolute top-6 right-6">{color.emoji}</div>
                  </div>
                );
              })}
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-success/10 to-transparent rounded-full blur-2xl -z-10"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-text-accent/10 to-transparent rounded-full blur-2xl -z-10"></div>
          </div>
        </div>
      )}

      {/* Full Leaderboard */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-primary/5 via-surface to-success/5 rounded-3xl p-8 md:p-12 border border-primary/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full shadow-lg mb-6 transform hover:scale-110 transition-all duration-300">
              <Target className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-text-main mb-4">
              🎯 Full Rankings
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto mb-8">
              Complete standings with detailed statistics for all players
            </p>

            {/* Time Period Selector */}
            <div className="inline-flex items-center gap-4 p-2 bg-surface-alt rounded-2xl border border-border shadow-lg">
              <span className="text-sm font-semibold text-text-muted px-3">View:</span>
              <select
                value={selection}
                onChange={(e) => setSelection(e.target.value === 'all' ? 'all' : e.target.value)}
                className="appearance-none bg-primary text-white text-sm font-bold rounded-xl px-4 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All Time</option>
                {months.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-surface-alt/50 to-surface/50 rounded-2xl border border-border shadow-lg overflow-hidden">
              <LeaderboardTable data={leaderboard} players={players} />
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl -z-10"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-success/10 to-transparent rounded-full blur-2xl -z-10"></div>
        </div>
      </div>
    </div>
  );
};

export default StandingsPage;

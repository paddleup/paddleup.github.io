import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, Target, Crown } from 'lucide-react';
import Card from '../components/ui/Card';
import { useEvents } from '../hooks/firestoreHooks';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { getMonthOptions } from '../lib/dateUtils';

const PlayersPage: React.FC = () => {
  const { data: events = [] } = useEvents();
  const [selection, setSelection] = useState<'all' | string>('all');

  const playerStats = useLeaderboard(selection);

  const months = useMemo(() => {
    return getMonthOptions(events.map((e) => e.startDateTime));
  }, [events]);

  // Get stats for overview cards
  const totalPlayers = playerStats.length;
  const activePlayers = playerStats.filter((p) => p.eventsPlayed > 0).length;
  const totalEvents = Math.max(...playerStats.map((p) => p.eventsPlayed), 0);
  const topPlayer = playerStats[0];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-success/5 via-surface to-primary/5 rounded-3xl p-8 md:p-12 border border-success/20 shadow-2xl">
          {/* Header with animated icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-success to-success/70 rounded-full shadow-lg mb-6 transform hover:scale-110 transition-all duration-300">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-text-main mb-4">👥 Players</h1>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Meet the competitive athletes who make our league exceptional
            </p>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-success/10 to-transparent rounded-full blur-2xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-2xl -z-10"></div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-primary/5 via-surface to-warning/5 rounded-3xl p-8 md:p-12 border border-primary/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full shadow-lg mb-6 transform hover:scale-110 transition-all duration-300">
              <Target className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-text-main mb-4">📊 League Stats</h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto mb-8">
              {selection === 'all'
                ? 'All-time statistics'
                : `${
                    months.find((m) => m.key === selection)?.label || 'Monthly'
                  } performance overview`}
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Players */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-bold text-text-main mb-3">Total Players</h3>
                <div className="space-y-2">
                  <div className="text-2xl font-black text-primary">{totalPlayers}</div>
                  <div className="text-text-muted font-medium">Registered</div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl"></div>
            </div>

            {/* Active Players */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-success/10 to-success/5 border-2 border-success/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-text-main mb-3">Active Players</h3>
                <div className="space-y-2">
                  <div className="text-2xl font-black text-success">{activePlayers}</div>
                  <div className="text-text-muted font-medium">With Events</div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-success/5 rounded-full blur-xl"></div>
            </div>

            {/* Max Events */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-warning/10 to-warning/5 border-2 border-warning/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="text-4xl mb-4">🔥</div>
                <h3 className="text-xl font-bold text-text-main mb-3">Most Events</h3>
                <div className="space-y-2">
                  <div className="text-2xl font-black text-warning">{totalEvents}</div>
                  <div className="text-text-muted font-medium">Per Player</div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-warning/5 rounded-full blur-xl"></div>
            </div>

            {/* Current Leader */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-text-accent/10 to-text-accent/5 border-2 border-text-accent/20 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="text-4xl mb-4">👑</div>
                <h3 className="text-xl font-bold text-text-main mb-3">Current Leader</h3>
                <div className="space-y-2">
                  <div className="text-lg font-black text-text-accent truncate">
                    {topPlayer?.name || 'N/A'}
                  </div>
                  <div className="text-text-muted font-medium">{topPlayer?.points || 0} pts</div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-text-accent/5 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl -z-10"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-warning/10 to-transparent rounded-full blur-2xl -z-10"></div>
        </div>
      </div>

      {/* Players Grid */}
      <div className="relative overflow-hidden">
        <div className="bg-gradient-to-br from-text-accent/5 via-surface to-success/5 rounded-3xl p-8 md:p-12 border border-text-accent/20 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-text-accent to-text-accent/70 rounded-full shadow-lg mb-6 transform hover:scale-110 transition-all duration-300">
              <Crown className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-text-main mb-4">
              🏆 Player Roster
            </h2>
            <p className="text-xl text-text-muted max-w-2xl mx-auto">
              Click on any player to view their detailed stats and match history
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {playerStats.map((player) => (
              <Link key={player.id} to={`/player/${player.id}`} className="block group">
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-alt/80 to-surface border-2 border-border p-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 flex flex-col h-full">
                  <div className="aspect-square w-full relative bg-surface-highlight overflow-hidden rounded-t-2xl">
                    {player.imageUrl ? (
                      <img
                        src={
                          player.imageUrl.startsWith('/')
                            ? `${import.meta.env.BASE_URL}${player.imageUrl.slice(1)}`
                            : player.imageUrl
                        }
                        alt={player.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-surface-highlight to-surface">
                        <span className="text-4xl font-bold text-text-muted opacity-30">
                          {player.name?.charAt(0)}
                        </span>
                      </div>
                    )}

                    <div className="absolute top-3 left-3">
                      <div className="bg-primary/90 backdrop-blur-sm border border-primary/50 px-3 py-1 rounded-full text-sm font-bold text-white shadow-lg">
                        #{player.rank ?? 0}
                      </div>
                    </div>

                    <div className="absolute top-3 right-3">
                      <div className="bg-success/90 backdrop-blur-md border border-success/50 px-3 py-1 rounded-full text-sm font-bold text-white shadow-lg">
                        {player.points} pts
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col">
                    <h2 className="text-lg font-bold text-text-main mb-1 group-hover:text-primary transition-colors text-center truncate">
                      {player.name}
                    </h2>
                    <p className="text-xs text-text-muted text-center mb-3">
                      DUPR {player.dupr ?? 'N/A'}
                    </p>

                    <div className="mt-auto grid grid-cols-3 gap-2 pt-3 border-t border-border text-center">
                      <div>
                        <p className="text-[10px] text-text-muted uppercase tracking-wide mb-0.5">
                          Events
                        </p>
                        <p className="font-bold text-sm text-text-main">{player.eventsPlayed}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-muted uppercase tracking-wide mb-0.5">
                          Champ Ct
                        </p>
                        <div className="flex items-center justify-center gap-1">
                          <TrendingUp className="h-3 w-3 text-success" />
                          <p className="font-bold text-sm text-text-main">{player.champWins}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-text-muted uppercase tracking-wide mb-0.5">
                          Rank
                        </p>
                        <p className="font-bold text-sm text-text-main">{player.rank ?? '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {playerStats.length === 0 && (
            <div className="text-center p-12">
              <div className="text-6xl mb-6 opacity-50">👥</div>
              <h3 className="text-2xl font-bold text-text-main mb-4">No Players Found</h3>
              <p className="text-text-muted">
                No players have participated in events for the selected time period.
              </p>
            </div>
          )}

          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-text-accent/10 to-transparent rounded-full blur-2xl -z-10"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-success/10 to-transparent rounded-full blur-2xl -z-10"></div>
        </div>
      </div>
    </div>
  );
};

export default PlayersPage;

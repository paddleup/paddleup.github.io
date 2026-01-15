import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, Target, Crown } from 'lucide-react';
import PremiumSection from '../components/ui/PremiumSection';
import SectionHeader from '../components/ui/SectionHeader';
import StatsCard from '../components/ui/StatsCard';
import PlayerAvatar from '../components/ui/PlayerAvatar';
import FeatureCard from '../components/ui/FeatureCard';
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
      {/* Stats Overview */}
      <PremiumSection primaryColor="primary" secondaryColor="warning">
        <SectionHeader
          icon={Users}
          title="Players Overview"
          subtitle={
            selection === 'all'
              ? 'All-time statistics'
              : `${
                  months.find((m) => m.key === selection)?.label || 'Monthly'
                } performance overview`
          }
          iconColor="success"
        />
        {/* Time Period Selector */}
        <div className="flex justify-center mb-8">
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
          <StatsCard
            emoji={<span className="text-5xl mb-4">👥</span>}
            title="Total Players"
            value={<span className="text-3xl font-black text-primary">{totalPlayers}</span>}
            description="Registered"
            color="primary"
            className="min-h-[180px]"
          />
          <StatsCard
            emoji={<span className="text-5xl mb-4">⚡</span>}
            title="Active Players"
            value={<span className="text-3xl font-black text-success">{activePlayers}</span>}
            description="With Events"
            color="success"
            className="min-h-[180px]"
          />
          <StatsCard
            emoji={<span className="text-5xl mb-4">🔥</span>}
            title="Most Events"
            value={<span className="text-3xl font-black text-warning">{totalEvents}</span>}
            description="Per Player"
            color="warning"
            className="min-h-[180px]"
          />
          <StatsCard
            emoji={<span className="text-5xl mb-4">👑</span>}
            title="Current Leader"
            value={
              <span className="text-lg font-black text-text-accent truncate">
                {topPlayer?.name || 'N/A'}
              </span>
            }
            description={
              <span className="text-text-muted font-medium">{topPlayer?.points || 0} pts</span>
            }
            color="text-accent"
            className="min-h-[180px]"
          />
        </div>
      </PremiumSection>

      {/* Players Grid */}
      <PremiumSection primaryColor="text-accent" secondaryColor="success">
        <SectionHeader
          icon={Crown}
          title="Player Roster"
          subtitle="Click on any player to view their detailed stats and match history"
          iconColor="text-accent"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {playerStats.map((player) => (
            <Link key={player.id} to={`/player/${player.id}`} className="block group">
              <FeatureCard
                badgeContent={`#${player.rank ?? 0}`}
                title={player.name}
                description={
                  <div>
                    <PlayerAvatar
                      imageUrl={player.imageUrl}
                      name={player.name}
                      size="lg"
                      className="mx-auto mb-2"
                    />
                    <div className="text-xs text-text-muted mb-1">DUPR {player.dupr ?? 'N/A'}</div>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-center">
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
                }
                emoji={player.imageUrl ? undefined : player.name?.charAt(0)}
                color="surface-alt"
              />
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
      </PremiumSection>
    </div>
  );
};

export default PlayersPage;

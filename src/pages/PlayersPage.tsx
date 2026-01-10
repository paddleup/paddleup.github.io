import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import Card from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
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

  return (
    <div className="space-y-8">
      <PageHeader
        title="Players"
        subtitle={`${playerStats.length} players • ${
          selection === 'all' ? 'All Time' : 'Month view'
        }`}
      >
        <div className="flex items-center gap-4">
          <select
            value={selection}
            onChange={(e) => setSelection(e.target.value === 'all' ? 'all' : e.target.value)}
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {playerStats.map((player) => (
          <Link key={player.id} to={`/player/${player.id}`} className="block group">
            <Card className="h-full overflow-hidden p-0 border-border group-hover:border-primary/50 transition-all group-hover:shadow-lg group-hover:shadow-primary/5 flex flex-col">
              <div className="aspect-square w-full relative bg-surface-highlight overflow-hidden">
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
                  <div className="w-full h-full flex items-center justify-center bg-surface-highlight">
                    <span className="text-4xl font-bold text-text-muted opacity-20">
                      {player.name?.charAt(0)}
                    </span>
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
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PlayersPage;

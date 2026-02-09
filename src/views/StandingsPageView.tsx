import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { Card, Avatar, Select, EmptyState } from '../components/ui';

type StandingsPageViewProps = {
  selection: string;
  setSelection: (v: string) => void;
  months: { value: string; label: string }[];
  leaderboard: any[];
  players: any[];
};

const StandingsPageView: React.FC<StandingsPageViewProps> = ({
  selection,
  setSelection,
  months,
  leaderboard,
  players,
}) => (
  <div className="space-y-6">
    {/* Period Selector */}
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
        {leaderboard.length} Players
      </span>
      <Select
        value={selection}
        onChange={(e) => setSelection(e.target.value)}
        className="min-w-[140px]"
      >
        {months.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </Select>
    </div>

    {/* Leaderboard */}
    {leaderboard.length > 0 ? (
      <Card>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {leaderboard.map((entry: any, index: number) => {
            const player = players.find((p) => p.id === entry.playerId) || {
              name: 'Unknown',
              imageUrl: '',
              id: 'unknown',
            };
            const rank = index + 1;
            
            return (
              <Link
                key={entry.playerId}
                to={`/player/${entry.playerId}`}
                className="flex items-center justify-between py-3 -mx-4 px-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <span
                    className={`
                      flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold
                      ${rank === 1 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                      ${rank === 2 ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300' : ''}
                      ${rank === 3 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                      ${rank > 3 ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' : ''}
                    `}
                  >
                    {rank}
                  </span>
                  
                  {/* Avatar & Name */}
                  <Avatar
                    src={player.imageUrl}
                    displayName={player.name}
                    userId={player.id}
                    alt={player.name}
                    size="default"
                  />
                  <div>
                    <span className="font-medium text-slate-900 dark:text-slate-100 block">
                      {player.name}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {entry.events || 0} events
                    </span>
                  </div>
                </div>
                
                {/* Points */}
                <div className="text-right">
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {entry.points}
                  </span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">
                    points
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Card>
    ) : (
      <EmptyState
        icon={Trophy}
        title="No Standings Yet"
        description="Standings will appear here once events have been completed"
      />
    )}
  </div>
);

export default StandingsPageView;
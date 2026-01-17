import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import Card from './ui/Card';
import PlayerAvatar from './ui/PlayerAvatar';
import RankBadge from './ui/RankBadge';
import { cn } from '../lib/utils';

// Flexible player type to avoid mismatches between models and UI types
interface PlayerLike {
  id?: string;
  name: string;
  imageUrl?: string;
  dupr?: number;
}

export interface LeaderboardRow {
  playerId: string;
  points?: number;
  eventsPlayed?: number;
  rank?: number;
}

interface LeaderboardTableProps {
  data: LeaderboardRow[];
  players: PlayerLike[];
  showEvents?: boolean;
  showPoints?: boolean;
  className?: string;
  pointsRenderer?: (row: LeaderboardRow, player: PlayerLike, index: number) => React.ReactNode;
  rowClassName?: (row: LeaderboardRow, index: number) => string;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  data,
  players,
  showEvents = true,
  showPoints = true,
  className,
  pointsRenderer,
  rowClassName,
}) => {
  return (
    <Card className={cn('p-0 overflow-hidden', className)}>
      <div className="overflow-x-auto w-full">
        <table className="w-full divide-y divide-border rounded-2xl bg-gradient-to-br from-surface/80 to-surface-alt/60 shadow-md">
          <thead className="bg-gradient-to-r from-primary-light/30 to-surface-highlight/60">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-text-main uppercase tracking-wider pl-6 rounded-tl-2xl">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-text-main uppercase tracking-wider">
                Player
              </th>
              {showPoints && (
                <th className="px-4 py-3 text-center text-xs font-bold text-text-main uppercase tracking-wider">
                  Points
                </th>
              )}
              {showEvents && (
                <th className="px-4 py-3 text-left text-xs font-bold text-text-main uppercase tracking-wider rounded-tr-2xl">
                  Events
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-border">
            {data.map((row, index) => {
              const player = players?.find((p) => p.id === row.playerId) || {
                name: 'Unknown',
                imageUrl: '',
                id: 'unknown',
              };

              return (
                <tr
                  key={row.playerId}
                  className={cn(
                    'hover:bg-surface-highlight/70 transition-colors',
                    rowClassName
                      ? rowClassName(row, index)
                      : (row.rank || 0) <= 4
                      ? 'bg-primary-light/10'
                      : '',
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
                      <div className="text-sm font-semibold text-text-main group-hover:text-primary transition-colors">
                        {player.name}
                      </div>
                      {row.rank === 1 && <Trophy className="ml-2 h-4 w-4 text-warning" />}
                    </Link>
                  </td>
                  {showPoints && (
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      {pointsRenderer ? (
                        pointsRenderer(row, player, index)
                      ) : (
                        <div className="text-sm font-bold text-success">{row.points ?? 0}</div>
                      )}
                    </td>
                  )}
                  {showEvents && (
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-text-muted">
                      {row.eventsPlayed ?? 0}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default LeaderboardTable;

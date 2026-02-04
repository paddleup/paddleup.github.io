import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { Avatar } from './ui';
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
    <div className={cn('overflow-hidden rounded-md border border-border', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-muted border-b border-border">
              <th className="px-4 py-3 text-left font-medium text-fg-muted">Rank</th>
              <th className="px-4 py-3 text-left font-medium text-fg-muted">Player</th>
              {showPoints && (
                <th className="px-4 py-3 text-center font-medium text-fg-muted">Points</th>
              )}
              {showEvents && (
                <th className="px-4 py-3 text-center font-medium text-fg-muted">Events</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, index) => {
              const player = players?.find((p) => p.id === row.playerId) || {
                name: 'Unknown',
                imageUrl: '',
                id: 'unknown',
              };
              const rank = row.rank ?? index + 1;

              return (
                <tr
                  key={row.playerId}
                  className={cn(
                    'transition-colors hover:bg-bg-subtle',
                    rowClassName
                      ? rowClassName(row, index)
                      : rank === 1
                        ? 'bg-warning-subtle'
                        : rank === 2
                          ? 'bg-bg-muted'
                          : rank === 3
                            ? 'bg-bg-subtle'
                            : ''
                  )}
                >
                  {/* Rank */}
                  <td className="px-4 py-3">
                    <div
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                        rank === 1 && 'bg-warning text-white',
                        rank === 2 && 'bg-fg-muted text-white',
                        rank === 3 && 'bg-fg-subtle text-white',
                        rank > 3 && 'bg-bg-muted text-fg-muted'
                      )}
                    >
                      {rank}
                    </div>
                  </td>

                  {/* Player */}
                  <td className="px-4 py-3">
                    <Link
                      to={`/player/${row.playerId}`}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <Avatar
                        src={player.imageUrl}
                        alt={player.name}
                        size="sm"
                      />
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-fg">{player.name}</span>
                        {rank === 1 && <Trophy className="h-4 w-4 text-warning" />}
                      </div>
                    </Link>
                  </td>

                  {/* Points */}
                  {showPoints && (
                    <td className="px-4 py-3 text-center">
                      {pointsRenderer ? (
                        pointsRenderer(row, player, index)
                      ) : (
                        <span className="font-semibold text-success">
                          {(row.points ?? 0).toLocaleString()}
                        </span>
                      )}
                    </td>
                  )}

                  {/* Events */}
                  {showEvents && (
                    <td className="px-4 py-3 text-center text-fg-muted">
                      {row.eventsPlayed ?? 0}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Card, CardContent, Badge, Avatar } from '../components/ui';
import { Player } from '../types';
import { cn } from '../lib/utils';

interface CourtCardViewProps {
  court: any;
  courtPlayers: Player[];
  roundNumber: 1 | 2;
  highlightedPlayerId?: string | null;
  isAdmin: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  completedGamesForCourt: number;
  totalGamesForCourt: number;
  handleScoreChange: (gameId: string, field: 'team1Score' | 'team2Score', score: number) => void;
  isEditable: boolean;
  courtPlayerStats: any[];
  players: Player[];
}

const CourtCardView: React.FC<CourtCardViewProps> = ({
  court,
  courtPlayers,
  highlightedPlayerId,
  isAdmin,
  expanded,
  onToggleExpand,
  completedGamesForCourt,
  totalGamesForCourt,
  handleScoreChange,
  isEditable,
  courtPlayerStats,
  players,
}) => {
  const isHighlighted = court.playerIds.some((pid: string) => pid === highlightedPlayerId);

  return (
    <Card id={`court-${court.id}`} className={cn(isHighlighted && 'ring-2 ring-accent')}>
      <CardContent>
        {/* Header */}
        <button
          type="button"
          className="w-full flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-left"
          onClick={onToggleExpand}
          aria-expanded={expanded}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-subtle">
              <span className="text-lg font-bold text-accent">{court.courtNumber}</span>
            </div>
            <div>
              <h3 className="font-semibold text-fg">Court {court.courtNumber}</h3>
              <div className="flex items-center gap-2 text-xs text-fg-muted">
                <span>{court.playerIds.length} players</span>
                <span>•</span>
                <span>
                  {court.playerIds.length === 4
                    ? 'First to 15, win by 1'
                    : court.playerIds.length === 5
                    ? 'First to 11, win by 1'
                    : ''}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Player Avatars */}
            <div className="flex -space-x-2">
              {courtPlayers.slice(0, 5).map((player) => (
                <Avatar
                  key={player.id}
                  src={player.imageUrl}
                  alt={player.name}
                  size="sm"
                  className="border-2 border-bg-subtle"
                />
              ))}
            </div>

            {/* Progress Badge */}
            <Badge variant={completedGamesForCourt === totalGamesForCourt ? 'success' : 'default'}>
              {completedGamesForCourt}/{totalGamesForCourt} games
            </Badge>

            {/* Expand Icon */}
            <ChevronDown
              className={cn('h-5 w-5 text-fg-muted transition-transform', expanded && 'rotate-180')}
            />
          </div>
        </button>

        {/* Expanded Content */}
        {expanded && (
          <div className="mt-4 space-y-4">
            {/* Player Stats Summary */}
            <div className="rounded-md border border-border overflow-hidden">
              <div className="bg-bg-muted px-3 py-2 text-xs font-medium text-fg-muted">
                Player Stats
              </div>
              <div className="divide-y divide-border">
                {courtPlayerStats.map((stat: any) => {
                  const player = players.find((p) => p.id === stat.id);
                  return (
                    <div key={stat.id} className="flex items-center justify-between px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Avatar src={player?.imageUrl} alt={player?.name || ''} size="sm" />
                        <span className="text-sm font-medium text-fg">{player?.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="font-medium text-fg">
                          {Math.round(stat.pointWinRate * 100)}%
                        </span>
                        <span className="text-fg-muted">
                          {stat.pointsEarned}-{stat.pointsAgainst}
                        </span>
                        <span
                          className={cn(
                            'font-medium',
                            stat.pointDifferential > 0 && 'text-success',
                            stat.pointDifferential < 0 && 'text-error',
                            stat.pointDifferential === 0 && 'text-fg-muted',
                          )}
                        >
                          {stat.pointDifferential > 0 ? '+' : ''}
                          {stat.pointDifferential}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Games */}
            <div className="space-y-3">
              {court.games.map((game: any, idx: number) => {
                const team1Player1 = players.find((p) => p.id === game.team1.player1Id);
                const team1Player2 = players.find((p) => p.id === game.team1.player2Id);
                const team2Player1 = players.find((p) => p.id === game.team2.player1Id);
                const team2Player2 = players.find((p) => p.id === game.team2.player2Id);

                const team1Won =
                  typeof game.team1Score === 'number' &&
                  typeof game.team2Score === 'number' &&
                  game.team1Score > game.team2Score;
                const team2Won =
                  typeof game.team1Score === 'number' &&
                  typeof game.team2Score === 'number' &&
                  game.team2Score > game.team1Score;

                return (
                  <div key={game.id} className="rounded-md border border-border overflow-hidden">
                    <div className="bg-bg-muted px-3 py-1.5 text-xs font-medium text-fg-muted">
                      Game {idx + 1}
                    </div>

                    {/* Team 1 */}
                    <div
                      className={cn(
                        'flex items-center justify-between px-3 py-2 border-b border-border',
                        team1Won && 'bg-success-subtle',
                      )}
                    >
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium text-fg">{team1Player1?.name}</div>
                        <div className="text-sm font-medium text-fg">{team1Player2?.name}</div>
                      </div>
                      <div className="text-right">
                        {isAdmin && isEditable ? (
                          <input
                            type="number"
                            className="w-14 rounded border border-border bg-bg px-2 py-1 text-center text-lg font-bold text-fg"
                            value={game.team1Score ?? ''}
                            onChange={(e) =>
                              handleScoreChange(game.id!, 'team1Score', Number(e.target.value))
                            }
                          />
                        ) : (
                          <span className="text-xl font-bold text-fg">
                            {game.team1Score ?? '-'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Team 2 */}
                    <div
                      className={cn(
                        'flex items-center justify-between px-3 py-2',
                        team2Won && 'bg-success-subtle',
                      )}
                    >
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium text-fg">{team2Player1?.name}</div>
                        <div className="text-sm font-medium text-fg">{team2Player2?.name}</div>
                      </div>
                      <div className="text-right">
                        {isAdmin && isEditable ? (
                          <input
                            type="number"
                            className="w-14 rounded border border-border bg-bg px-2 py-1 text-center text-lg font-bold text-fg"
                            value={game.team2Score ?? ''}
                            onChange={(e) =>
                              handleScoreChange(game.id!, 'team2Score', Number(e.target.value))
                            }
                          />
                        ) : (
                          <span className="text-xl font-bold text-fg">
                            {game.team2Score ?? '-'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourtCardView;

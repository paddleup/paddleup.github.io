import React from 'react';
import { ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import { Card, CardContent, Badge } from '../components/ui';
import { Player } from '../types';
import { PlayerDetails } from '../lib/challengeEventUtils';
import { cn } from '../lib/utils';

interface RoundRankingsPanelViewProps {
  roundNumber: number;
  playerRankings: PlayerDetails[];
  players: Player[];
  completedGames: number;
  totalGames: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  completionPercentage: number;
}

const RoundRankingsPanelView: React.FC<RoundRankingsPanelViewProps> = ({
  roundNumber,
  playerRankings,
  players,
  completedGames,
  totalGames,
  isExpanded,
  onToggleExpand,
  completionPercentage,
}) => (
  <Card>
    <CardContent>
      {/* Header */}
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-warning-subtle">
            <Trophy className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h3 className="font-semibold text-fg">Round {roundNumber} Rankings</h3>
            <p className="text-sm text-fg-muted">
              {completedGames}/{totalGames} games ({completionPercentage}%)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={completedGames === totalGames ? 'success' : 'default'}>
            {isExpanded ? 'Hide' : 'Show'}
          </Badge>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-fg-muted" />
          ) : (
            <ChevronDown className="h-5 w-5 text-fg-muted" />
          )}
        </div>
      </button>

      {/* Expanded Table */}
      {isExpanded && (
        <div className="mt-4 rounded-md border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-bg-muted border-b border-border">
                  <th className="px-3 py-2 text-left font-medium text-fg-muted">Rank</th>
                  <th className="px-3 py-2 text-left font-medium text-fg-muted">Player</th>
                  <th className="px-3 py-2 text-center font-medium text-fg-muted">Court</th>
                  {roundNumber === 1 && (
                    <th className="px-3 py-2 text-center font-medium text-fg-muted">Next Court</th>
                  )}
                  <th className="px-3 py-2 text-center font-medium text-fg-muted">Pt Win %</th>
                  <th className="px-3 py-2 text-center font-medium text-fg-muted">PF</th>
                  <th className="px-3 py-2 text-center font-medium text-fg-muted">PA</th>
                  <th className="px-3 py-2 text-center font-medium text-fg-muted">Diff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {playerRankings.map((playerStats, index) => {
                  const player = players.find((p) => p.id === playerStats.id);
                  const rank = index + 1;

                  return (
                    <tr
                      key={playerStats.id}
                      className={cn(
                        'transition-colors hover:bg-bg-subtle',
                        rank === 1 && 'bg-warning-subtle',
                        rank === 2 && 'bg-bg-muted',
                        rank === 3 && 'bg-bg-subtle',
                      )}
                    >
                      {/* Rank */}
                      <td className="px-3 py-2">
                        <div
                          className={cn(
                            'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                            rank === 1 && 'bg-warning text-white',
                            rank === 2 && 'bg-fg-muted text-white',
                            rank === 3 && 'bg-fg-subtle text-white',
                            rank > 3 && 'bg-bg-muted text-fg-muted',
                          )}
                        >
                          {rank}
                        </div>
                      </td>

                      {/* Player */}
                      <td className="px-3 py-2">
                        <div className="font-medium text-fg">
                          {player?.name || `Player ${playerStats.id}`}
                        </div>
                        <div className="text-xs text-fg-muted">Seed #{playerStats.seed}</div>
                      </td>

                      {/* Court */}
                      <td className="px-3 py-2 text-center">
                        <span className="font-medium text-fg">{playerStats.courtNumber}</span>
                      </td>

                      {/* Projected Next Court (Round 1 only) */}
                      {roundNumber === 1 && (
                        <td className="px-3 py-2 text-center">
                          <span className="font-medium text-accent">
                            {typeof playerStats.nextCourt === 'number' && playerStats.nextCourt > 0
                              ? playerStats.nextCourt
                              : '-'}
                          </span>
                        </td>
                      )}

                      {/* Point Win Rate % */}
                      <td className="px-3 py-2 text-center">
                        <span className="font-medium text-fg">
                          {(playerStats.pointWinRate * 100).toFixed(0)}%
                        </span>
                      </td>

                      {/* Points For */}
                      <td className="px-3 py-2 text-center">
                        <span className="text-fg-muted">{playerStats.pointsEarned}</span>
                      </td>

                      {/* Points Against */}
                      <td className="px-3 py-2 text-center">
                        <span className="text-fg-muted">{playerStats.pointsAgainst}</span>
                      </td>

                      {/* Diff */}
                      <td className="px-3 py-2 text-center">
                        <span
                          className={cn(
                            'font-medium',
                            playerStats.pointDifferential > 0 && 'text-success',
                            playerStats.pointDifferential < 0 && 'text-error',
                            playerStats.pointDifferential === 0 && 'text-fg-muted',
                          )}
                        >
                          {playerStats.pointDifferential > 0 ? '+' : ''}
                          {playerStats.pointDifferential}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

export default RoundRankingsPanelView;

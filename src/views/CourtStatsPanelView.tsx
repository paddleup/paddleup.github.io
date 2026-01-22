// TypeScript
import React from 'react';
import { ChevronDown, ChevronUp, BarChart3, Target } from 'lucide-react';
import { Player } from '../types';
import { PlayerDetails } from '../lib/challengeEventUtils';

interface CourtStatsPanelViewProps {
  courtNumber: number;
  sortedPlayerStats: PlayerDetails[];
  players: Player[];
  totalGamesForCourt: number;
  completedGamesForCourt: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  completionPercentage: number;
  formatWinPercentage: (wins: number, losses: number) => string;
}

const CourtStatsPanelView: React.FC<CourtStatsPanelViewProps> = ({
  courtNumber,
  sortedPlayerStats,
  players,
  totalGamesForCourt,
  completedGamesForCourt,
  isExpanded,
  onToggleExpand,
  completionPercentage,
  formatWinPercentage,
}) => (
  <div className="mt-3">
    <button
      onClick={onToggleExpand}
      className="w-full bg-gradient-to-r from-success/10 via-success/5 to-success/10 border border-success/30 rounded-lg p-3 hover:bg-success/15 transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-success to-success/70 rounded-full flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-bold text-text-main">Court {courtNumber} Stats</h4>
            <p className="text-xs text-text-muted">
              {completedGamesForCourt}/{totalGamesForCourt} games ({completionPercentage}%)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">{isExpanded ? 'Hide' : 'Show'}</span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-text-muted" />
          ) : (
            <ChevronDown className="h-4 w-4 text-text-muted" />
          )}
        </div>
      </div>
    </button>

    {isExpanded && (
      <div className="mt-2 bg-surface-alt/30 rounded-lg border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-alt/50 border-b border-border/30">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-text-main uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-text-main uppercase tracking-wider">
                  Player
                </th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-text-main uppercase tracking-wider">
                  W-L
                </th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-text-main uppercase tracking-wider">
                  Win %
                </th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-text-main uppercase tracking-wider">
                  Diff
                </th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-text-main uppercase tracking-wider">
                  Games
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {sortedPlayerStats.map((playerStats, index) => {
                const player = players.find((p) => p.id === playerStats.id);
                const courtRank = index + 1;
                return (
                  <tr
                    key={playerStats.id}
                    className={`transition-colors ${
                      courtRank === 1
                        ? 'bg-success/5 hover:bg-success/10'
                        : 'hover:bg-surface-highlight'
                    }`}
                  >
                    {/* Court Rank Column */}
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          courtRank === 1
                            ? 'bg-gradient-to-br from-success to-success/70 text-white'
                            : 'bg-surface-alt text-text-main'
                        }`}
                      >
                        {courtRank === 1 ? '👑' : courtRank}
                      </div>
                    </td>

                    {/* Player Name Column */}
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="text-sm font-semibold text-text-main">
                        {player?.name || `Player ${playerStats.id}`}
                      </div>
                      {player?.dupr && (
                        <div className="text-xs text-text-muted">DUPR: {player.dupr}</div>
                      )}
                    </td>

                    {/* Win-Loss Column */}
                    <td className="px-3 py-2 whitespace-nowrap text-center">
                      <span className="text-sm font-semibold text-text-main">
                        {playerStats.wins}-{playerStats.losses}
                      </span>
                    </td>

                    {/* Win Percentage Column */}
                    <td className="px-3 py-2 whitespace-nowrap text-center">
                      <span className="text-sm font-medium text-text-main">
                        {formatWinPercentage(playerStats.wins, playerStats.losses)}
                      </span>
                    </td>

                    {/* Point Differential Column */}
                    <td className="px-3 py-2 whitespace-nowrap text-center">
                      <span
                        className={`text-sm font-semibold ${
                          playerStats.pointDifferential > 0
                            ? 'text-success'
                            : playerStats.pointDifferential < 0
                            ? 'text-error'
                            : 'text-text-muted'
                        }`}
                      >
                        {playerStats.pointDifferential > 0 ? '+' : ''}
                        {playerStats.pointDifferential}
                      </span>
                    </td>

                    {/* Games Progress Column */}
                    <td className="px-3 py-2 whitespace-nowrap text-center">
                      <span className="text-sm font-medium text-text-main">
                        {playerStats.wins + playerStats.losses}/
                        {sortedPlayerStats.length === 5 ? 4 : totalGamesForCourt}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Court Summary */}
        {completedGamesForCourt === totalGamesForCourt && (
          <div className="p-3 border-t border-border/30 bg-surface-alt/20">
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Target className="h-4 w-4" />
              <span>Court {courtNumber} complete • Leader advances to next round</span>
            </div>
          </div>
        )}
      </div>
    )}
  </div>
);

export default CourtStatsPanelView;

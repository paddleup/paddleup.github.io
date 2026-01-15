import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trophy, ArrowUp, ArrowDown } from 'lucide-react';
import { Player } from '../../types';
import { PlayerDetails } from '../../lib/challengeEventUtils';

interface RoundRankingsPanelProps {
  roundNumber: number;
  playerRankings: PlayerDetails[];
  players: Player[];
  completedGames: number;
  totalGames: number;
  previousRoundRankings?: PlayerDetails[];
}

const RoundRankingsPanel: React.FC<RoundRankingsPanelProps> = ({
  roundNumber,
  playerRankings,
  players,
  completedGames,
  totalGames,
  previousRoundRankings,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const completionPercentage = totalGames > 0 ? Math.round((completedGames / totalGames) * 100) : 0;

  const getMovementIndicator = (currentRank: number, playerId: string) => {
    let previousRank: number | undefined;
    let tooltipText: string;
    
    if (roundNumber === 1) {
      // For Round 1, compare to initial seed
      const playerSeed = playerRankings.find(p => p.id === playerId)?.seed;
      previousRank = playerSeed;
      tooltipText = playerSeed ? `Seed #${playerSeed}` : 'No seed';
    } else if (previousRoundRankings) {
      // For Round 2, compare to Round 1 ranking
      previousRank = previousRoundRankings.find(p => p.id === playerId)?.roundPlace;
      tooltipText = previousRank ? `Round 1 #${previousRank}` : 'No previous rank';
    } else {
      return null;
    }
    
    if (!previousRank) return null;
    
    if (currentRank < previousRank) {
      return (
        <div title={`Moved up from ${tooltipText}`}>
          <ArrowUp className="h-4 w-4 text-success" />
        </div>
      );
    } else if (currentRank > previousRank) {
      return (
        <div title={`Moved down from ${tooltipText}`}>
          <ArrowDown className="h-4 w-4 text-error" />
        </div>
      );
    }
    return (
      <div title={`Same as ${tooltipText}`}>
        <div className="w-2 h-2 rounded-full bg-text-muted mx-auto"></div>
      </div>
    );
  };

  const formatWinPercentage = (wins: number, losses: number) => {
    const total = wins + losses;
    if (total === 0) return '0%';
    return `${Math.round((wins / total) * 100)}%`;
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/30 rounded-xl p-4 hover:bg-primary/15 transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-text-main">Round {roundNumber} Rankings</h3>
              <p className="text-sm text-text-muted">
                {completedGames}/{totalGames} games ({completionPercentage}%)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted">
              {isExpanded ? 'Hide' : 'Show'} Rankings
            </span>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-text-muted" />
            ) : (
              <ChevronDown className="h-5 w-5 text-text-muted" />
            )}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="mt-3 bg-surface rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-alt border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-main uppercase tracking-wider">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-text-main uppercase tracking-wider">Player</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-text-main uppercase tracking-wider">Court</th>
                  {roundNumber === 1 && (
                    <th className="px-4 py-3 text-center text-xs font-semibold text-text-main uppercase tracking-wider">Projected Next Court</th>
                  )}
                  <th className="px-4 py-3 text-center text-xs font-semibold text-text-main uppercase tracking-wider">W-L</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-text-main uppercase tracking-wider">Win %</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-text-main uppercase tracking-wider">Diff</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-text-main uppercase tracking-wider">Movement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {playerRankings.map((playerStats, index) => {
                  const player = players.find(p => p.id === playerStats.id);
                  const rank = index + 1;
                  
                  return (
                    <tr
                      key={playerStats.id}
                      className={`transition-colors ${
                        rank <= 3 
                          ? rank === 1 
                            ? 'bg-warning/5 hover:bg-warning/10'
                            : rank === 2
                            ? 'bg-text-accent/5 hover:bg-text-accent/10'
                            : 'bg-bronze/5 hover:bg-bronze/10'
                          : 'hover:bg-surface-highlight'
                      }`}
                    >
                      {/* Rank Column */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          rank === 1 
                            ? 'bg-gradient-to-br from-warning to-warning/70 text-white'
                            : rank === 2
                            ? 'bg-gradient-to-br from-text-accent to-text-accent/70 text-white'  
                            : rank === 3
                            ? 'bg-gradient-to-br from-bronze to-bronze/70 text-white'
                            : 'bg-surface-alt text-text-main'
                        }`}>
                          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                        </div>
                      </td>
                      
                      {/* Player Name Column */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-semibold text-text-main">
                          {player?.name || `Player ${playerStats.id}`}
                        </div>
                        <div className="text-xs text-text-muted">
                          Seed #{playerStats.seed}
                        </div>
                      </td>

                      {/* Court Column */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className="text-sm font-medium text-text-main">
                          {playerStats.courtNumber}
                        </span>
                      </td>
                      {/* Projected Next Court (Round 1 only) */}
                      {roundNumber === 1 && (
                        <td className="px-4 py-3 whitespace-nowrap text-center">
                          <span className="text-sm font-medium text-text-accent">
                            {typeof playerStats.nextCourt === "number" && playerStats.nextCourt > 0
                              ? playerStats.nextCourt
                              : "-"}
                          </span>
                        </td>
                      )}

                      {/* Win-Loss Column */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className="text-sm font-semibold text-text-main">
                          {playerStats.wins}-{playerStats.losses}
                        </span>
                      </td>

                      {/* Win Percentage Column */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className="text-sm font-medium text-text-main">
                          {formatWinPercentage(playerStats.wins, playerStats.losses)}
                        </span>
                      </td>

                      {/* Point Differential Column */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className={`text-sm font-semibold ${
                          playerStats.pointDifferential > 0 
                            ? 'text-success' 
                            : playerStats.pointDifferential < 0 
                            ? 'text-error' 
                            : 'text-text-muted'
                        }`}>
                          {playerStats.pointDifferential > 0 ? '+' : ''}{playerStats.pointDifferential}
                        </span>
                      </td>

                      {/* Movement Column (Both rounds) */}
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        {getMovementIndicator(rank, playerStats.id)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoundRankingsPanel;

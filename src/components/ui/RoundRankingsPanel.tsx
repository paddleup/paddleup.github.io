// TypeScript
import React, { useState } from 'react';
import RoundRankingsPanelView from '../../views/RoundRankingsPanelView';
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
      const playerSeed = playerRankings.find((p) => p.id === playerId)?.seed;
      previousRank = playerSeed;
      tooltipText = playerSeed ? `Seed #${playerSeed}` : 'No seed';
    } else if (previousRoundRankings) {
      previousRank = previousRoundRankings.find((p) => p.id === playerId)?.roundPlace;
      tooltipText = previousRank ? `Round 1 #${previousRank}` : 'No previous rank';
    } else {
      return null;
    }

    if (!previousRank) return null;

    if (currentRank < previousRank) {
      return (
        <div title={`Moved up from ${tooltipText}`}>
          <span className="sr-only">Up</span>
        </div>
      );
    } else if (currentRank > previousRank) {
      return (
        <div title={`Moved down from ${tooltipText}`}>
          <span className="sr-only">Down</span>
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
    <RoundRankingsPanelView
      roundNumber={roundNumber}
      playerRankings={playerRankings}
      players={players}
      completedGames={completedGames}
      totalGames={totalGames}
      isExpanded={isExpanded}
      onToggleExpand={() => setIsExpanded((v) => !v)}
      completionPercentage={completionPercentage}
      getMovementIndicator={getMovementIndicator}
      formatWinPercentage={formatWinPercentage}
      previousRoundRankings={previousRoundRankings}
    />
  );
};

export default RoundRankingsPanel;

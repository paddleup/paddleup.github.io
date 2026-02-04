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
}

const RoundRankingsPanel: React.FC<RoundRankingsPanelProps> = ({
  roundNumber,
  playerRankings,
  players,
  completedGames,
  totalGames,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const completionPercentage = totalGames > 0 ? Math.round((completedGames / totalGames) * 100) : 0;

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
      formatWinPercentage={formatWinPercentage}
    />
  );
};

export default RoundRankingsPanel;

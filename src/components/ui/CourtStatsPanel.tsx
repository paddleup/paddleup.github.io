// TypeScript
import React, { useState } from 'react';
import CourtStatsPanelView from '../../views/CourtStatsPanelView';
import { Player } from '../../types';
import { PlayerDetails } from '../../lib/challengeEventUtils';

interface CourtStatsPanelProps {
  courtNumber: number;
  playerStats: PlayerDetails[];
  players: Player[];
  totalGamesForCourt: number;
  completedGamesForCourt: number;
}

const CourtStatsPanel: React.FC<CourtStatsPanelProps> = ({
  courtNumber,
  playerStats,
  players,
  totalGamesForCourt,
  completedGamesForCourt,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const completionPercentage =
    totalGamesForCourt > 0 ? Math.round((completedGamesForCourt / totalGamesForCourt) * 100) : 0;

  const formatWinPercentage = (wins: number, losses: number) => {
    const total = wins + losses;
    if (total === 0) return '0%';
    return `${Math.round((wins / total) * 100)}%`;
  };

  // Sort players by performance on this court
  const sortedPlayerStats = [...playerStats].sort((a, b) => {
    if (a.wins !== b.wins) return b.wins - a.wins;
    if (a.pointDifferential !== b.pointDifferential)
      return b.pointDifferential - a.pointDifferential;
    return a.seed - b.seed;
  });

  return (
    <CourtStatsPanelView
      courtNumber={courtNumber}
      sortedPlayerStats={sortedPlayerStats}
      players={players}
      totalGamesForCourt={totalGamesForCourt}
      completedGamesForCourt={completedGamesForCourt}
      isExpanded={isExpanded}
      onToggleExpand={() => setIsExpanded((v) => !v)}
      completionPercentage={completionPercentage}
      formatWinPercentage={formatWinPercentage}
    />
  );
};

export default CourtStatsPanel;

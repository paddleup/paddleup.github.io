// TypeScript
import React, { useState } from 'react';
import CourtCardView from '../../views/CourtCardView';
import { Player } from '../../types';
import { calculatePlayerRankings } from '../../lib/challengeEventUtils';

interface CourtCardProps {
  court: any;
  players: Player[];
  roundNumber: 1 | 2;
  highlightedPlayerId?: string | null;
  isAdmin: boolean;
  handleScoreChange: (gameId: string, field: 'team1Score' | 'team2Score', score: number) => void;
}

const CourtCard: React.FC<CourtCardProps> = ({
  court,
  players,
  roundNumber,
  highlightedPlayerId,
  isAdmin,
  handleScoreChange,
}) => {
  const [expanded, setExpanded] = useState(true);

  const courtPlayerStats = calculatePlayerRankings([court], roundNumber);

  const completedGamesForCourt = court.games.filter(
    (g: any) =>
      g.roundNumber === roundNumber && g.team1Score !== undefined && g.team2Score !== undefined,
  ).length;
  const totalGamesForCourt = court.games.filter((g: any) => g.roundNumber === roundNumber).length;

  const isEditable =
    (roundNumber === 1 &&
      (typeof (window as any).areRound1UpdatesAllowed === 'boolean'
        ? (window as any).areRound1UpdatesAllowed
        : true)) ||
    (roundNumber === 2 &&
      (typeof (window as any).areRound2UpdatesAllowed === 'boolean'
        ? (window as any).areRound2UpdatesAllowed
        : true));

  const courtPlayers = court.playerIds
    .map((pid: string) => players.find((p) => p.id === pid))
    .filter(Boolean);

  return (
    <CourtCardView
      court={court}
      courtPlayers={courtPlayers}
      roundNumber={roundNumber}
      highlightedPlayerId={highlightedPlayerId}
      isAdmin={isAdmin}
      expanded={expanded}
      onToggleExpand={() => setExpanded((v) => !v)}
      completedGamesForCourt={completedGamesForCourt}
      totalGamesForCourt={totalGamesForCourt}
      handleScoreChange={handleScoreChange}
      isEditable={isEditable}
      courtPlayerStats={courtPlayerStats}
      players={players}
    />
  );
};

export default CourtCard;

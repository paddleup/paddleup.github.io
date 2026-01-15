import React, { useState } from 'react';
import Card from './Card';
import CourtStatsPanel from './CourtStatsPanel';
import TeamRow from './TeamRow';
import PlayerAvatar from './PlayerAvatar';
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
  // Only count games for the current round
  const completedGamesForCourt = court.games.filter(
    (g: any) =>
      g.roundNumber === roundNumber && g.team1Score !== undefined && g.team2Score !== undefined,
  ).length;
  const totalGamesForCourt = court.games.filter((g: any) => g.roundNumber === roundNumber).length;

  // Determine if updates are allowed for this round
  const isEditable =
    (roundNumber === 1 &&
      (typeof (window as any).areRound1UpdatesAllowed === 'boolean'
        ? (window as any).areRound1UpdatesAllowed
        : true)) ||
    (roundNumber === 2 &&
      (typeof (window as any).areRound2UpdatesAllowed === 'boolean'
        ? (window as any).areRound2UpdatesAllowed
        : true));

  // Get player objects for this court
  const courtPlayers = court.playerIds
    .map((pid: string) => players.find((p) => p.id === pid))
    .filter(Boolean);

  return (
    <div
      key={court.id}
      id={`court-${court.id}`}
      className={`relative overflow-hidden bg-gradient-to-br from-primary/5 via-surface to-success/5 rounded-3xl p-8 border border-primary/20 shadow-2xl ${
        court.playerIds.some((pid: string) => pid === highlightedPlayerId)
          ? 'ring-2 ring-primary/50 bg-primary/5'
          : ''
      }`}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-2xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-success/10 to-transparent rounded-full blur-2xl -z-10"></div>
      {/* Collapsible Header */}
      <button
        className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 focus:outline-none"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        type="button"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-text-main">Court {court.courtNumber}</h3>
          </div>
          <div className="flex flex-wrap gap-1 mt-1 sm:mt-0">
            {courtPlayers.map((player: Player | undefined) =>
              player ? (
                <span
                  key={player.id + '-name'}
                  className="inline-flex items-center gap-1 text-xs font-medium text-text-muted bg-surface-alt px-2 py-0.5 rounded"
                >
                  <PlayerAvatar
                    imageUrl={player.imageUrl}
                    name={player.name}
                    size="sm"
                    border={false}
                    className="ring-1 ring-surface"
                  />
                  {player.name}
                </span>
              ) : null,
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm px-3 py-1 bg-primary/20 text-primary rounded-lg font-semibold">
            {completedGamesForCourt}/{totalGamesForCourt} games
          </span>
          <span className="text-sm px-3 py-1 bg-success/20 text-success rounded-lg font-semibold">
            {court.playerIds.length} players
          </span>
          <span className="text-xs px-2 py-1 bg-surface-alt text-text-muted rounded font-medium border border-border">
            {court.playerIds.length === 4
              ? 'First to 15, win by 1'
              : court.playerIds.length === 5
              ? 'First to 11, win by 1'
              : ''}
          </span>
        </div>
      </button>
      {expanded && (
        <div className="space-y-4 mt-4">
          {/* Games - Condensed Vertical Stack Layout */}
          <div className="space-y-4">
            {court.games.map((game: any, idx: number) => {
              const team1Player1 = players.find((p) => p.id === game.team1.player1Id);
              const team1Player2 = players.find((p) => p.id === game.team1.player2Id);
              const team2Player1 = players.find((p) => p.id === game.team2.player1Id);
              const team2Player2 = players.find((p) => p.id === game.team2.player2Id);

              // Only highlight the winning team in completed matches, no highlight otherwise
              let team1Highlight = '';
              let team2Highlight = '';
              if (typeof game.team1Score === 'number' && typeof game.team2Score === 'number') {
                if (game.team1Score > game.team2Score) {
                  team1Highlight = 'bg-success/10';
                } else if (game.team2Score > game.team1Score) {
                  team2Highlight = 'bg-success/10';
                }
                // No highlight for tie or losing team
              }

              return (
                <div key={game.id}>
                  <div className="px-2 pt-1 pb-0">
                    <span className="text-xs text-text-muted font-semibold tracking-wide uppercase">
                      Game {idx + 1}
                    </span>
                  </div>
                  <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-surface to-success/5 rounded-2xl p-4 border border-primary/20 shadow">
                    <div className="space-y-1">
                      <div
                        className={`rounded-lg transition-all duration-200 px-4 ${team1Highlight}`}
                      >
                        <TeamRow
                          color="primary"
                          player1={team1Player1}
                          player2={team1Player2}
                          score={game.team1Score}
                          onScoreChange={(score) =>
                            handleScoreChange(game.id!, 'team1Score', score)
                          }
                          isAdmin={isAdmin}
                          isEditable={isEditable}
                        />
                      </div>
                      <div
                        className={`rounded-lg transition-all duration-200 px-4 ${team2Highlight}`}
                      >
                        <TeamRow
                          color="success"
                          player1={team2Player1}
                          player2={team2Player2}
                          score={game.team2Score}
                          onScoreChange={(score) =>
                            handleScoreChange(game.id!, 'team2Score', score)
                          }
                          isAdmin={isAdmin}
                          isEditable={isEditable}
                        />
                      </div>
                    </div>
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-xl -z-10"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-success/10 to-transparent rounded-full blur-xl -z-10"></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Court Stats Panel */}
          <CourtStatsPanel
            courtNumber={court.courtNumber}
            playerStats={courtPlayerStats}
            players={players}
            totalGamesForCourt={totalGamesForCourt}
            completedGamesForCourt={completedGamesForCourt}
          />
        </div>
      )}
    </div>
  );
};

export default CourtCard;

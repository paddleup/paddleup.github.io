import React, { useState } from 'react';
import Card from './Card';
import CourtStatsPanel from './CourtStatsPanel';
import TeamRow from './TeamRow';
import PlayerAvatar from './PlayerAvatar';
import PremiumSection from './PremiumSection';
import { ChevronDown } from 'lucide-react';
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
    <PremiumSection
      primaryColor="primary"
      secondaryColor="success"
      className={`rounded-xl p-8 ${
        court.playerIds.some((pid: string) => pid === highlightedPlayerId)
          ? 'ring-2 ring-primary/50 bg-primary/5'
          : ''
      }`}
    >
      <div id={`court-${court.id}`}>
        {/* Collapsible Header */}
        <button
          className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 focus:outline-none"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          type="button"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1">
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
            <ChevronDown
              className={`ml-2 h-6 w-6 text-text-muted transition-transform duration-200 ${
                expanded ? 'rotate-180' : 'rotate-0'
              }`}
              aria-hidden="true"
            />
          </div>
        </button>
        {expanded && (
          <div className="space-y-4 mt-4">
            {/* Games - Condensed Vertical Stack Layout */}
            <div className="space-y-3">
              {/* Court Stats Panel */}
              <CourtStatsPanel
                courtNumber={court.courtNumber}
                playerStats={courtPlayerStats}
                players={players}
                totalGamesForCourt={totalGamesForCourt}
                completedGamesForCourt={completedGamesForCourt}
              />
              {court.games.map((game: any, idx: number) => {
                const team1Player1 = players.find((p) => p.id === game.team1.player1Id);
                const team1Player2 = players.find((p) => p.id === game.team1.player2Id);
                const team2Player1 = players.find((p) => p.id === game.team2.player1Id);
                const team2Player2 = players.find((p) => p.id === game.team2.player2Id);

                return (
                  <>
                    <div className="mt-7 mb-2 mx-3">
                      <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                        Game {idx + 1}
                      </span>
                    </div>
                    <div
                      key={game.id}
                      className="border border-border bg-surface rounded-none"
                      style={{ boxShadow: 'none' }}
                    >
                      <div
                        className={`flex items-center justify-between border-b border-border px-3 py-2 ${
                          typeof game.team1Score === 'number' &&
                          typeof game.team2Score === 'number' &&
                          game.team1Score > game.team2Score
                            ? 'bg-success/10'
                            : ''
                        }`}
                      >
                        <div>
                          <div className="font-medium text-text-main">{team1Player1?.name}</div>
                          <div className="font-medium text-text-main">{team1Player2?.name}</div>
                        </div>
                        {(() => {
                          const scoreClass = 'text-black dark:text-white';
                          return (
                            <div
                              className={`text-2xl font-bold text-right min-w-[48px] ${scoreClass}`}
                            >
                              {isAdmin && isEditable ? (
                                <input
                                  type="number"
                                  className="w-12 px-1 py-0.5 border border-border rounded text-center text-lg font-bold"
                                  value={game.team1Score ?? ''}
                                  onChange={(e) =>
                                    handleScoreChange(
                                      game.id!,
                                      'team1Score',
                                      Number(e.target.value),
                                    )
                                  }
                                />
                              ) : (
                                game.team1Score ?? ''
                              )}
                            </div>
                          );
                        })()}
                      </div>
                      <div
                        className={`flex items-center justify-between px-3 py-2 ${
                          typeof game.team1Score === 'number' &&
                          typeof game.team2Score === 'number' &&
                          game.team2Score > game.team1Score
                            ? 'bg-success/10'
                            : ''
                        }`}
                      >
                        <div>
                          <div className="font-medium text-text-main">{team2Player1?.name}</div>
                          <div className="font-medium text-text-main">{team2Player2?.name}</div>
                        </div>
                        {(() => {
                          const scoreClass = 'text-black dark:text-white';
                          return (
                            <div
                              className={`text-2xl font-bold text-right min-w-[48px] ${scoreClass}`}
                            >
                              {isAdmin && isEditable ? (
                                <input
                                  type="number"
                                  className="w-12 px-1 py-0.5 border border-border rounded text-center text-lg font-bold"
                                  value={game.team2Score ?? ''}
                                  onChange={(e) =>
                                    handleScoreChange(
                                      game.id!,
                                      'team2Score',
                                      Number(e.target.value),
                                    )
                                  }
                                />
                              ) : (
                                game.team2Score ?? ''
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PremiumSection>
  );
};

export default CourtCard;

// Redesigned CourtCard — mobile-first, semantic, avatar/initials, simple

import React from 'react';
import { Game } from '../../types';
import { usePlayers } from '../../hooks/firestoreHooks';

export interface Player {
  id: string;
  name: string;
}

export interface Court {
  id?: string;
  courtNumber: number;
  tier: string;
  playerIds: string[];
  games: Game[];
}

export interface CourtCardProps {
  court: Court;
  players: Player[];
  editableScores?: boolean;
  onScoreChange?: (matchId: string, field: 'team1Score' | 'team2Score', value: number) => void;
  roundNumber: number;
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

const PlayerList: React.FC<{ playerIds: string[]; players: Player[] }> = ({
  playerIds,
  players,
}) => (
  <div className="flex flex-col gap-3">
    {playerIds.map((id, i) => {
      const player = players.find((p) => p.id === id);
      return (
        <div
          key={i}
          className="flex items-center gap-3 bg-surface-alt/60 p-3 rounded-lg border border-border"
        >
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-base">
            {player?.name ? getInitials(player.name) : '?'}
          </span>
          <span className="flex-1 text-text-main font-semibold text-base truncate">
            {player?.name ?? 'Unknown'}
          </span>
        </div>
      );
    })}
  </div>
);

const MatchList: React.FC<{
  games: Game[];
  editableScores?: boolean;
  onScoreChange?: (matchId: string, field: 'team1Score' | 'team2Score', value: number) => void;
}> = ({ games, editableScores, onScoreChange }) => {
  const { data: players } = usePlayers();
  const getPlayerName = (id: string) => {
    const player = players?.find((p) => p.id === id);
    return player ? player.name : 'Unknown';
  };

  return (
    <div className="flex flex-col gap-4">
      {games.map((game, gameIndex) => {
        const team1Name = `${getPlayerName(game.team1Player1Id)} & ${getPlayerName(
          game.team1Player2Id,
        )}`;
        const team2Name = `${getPlayerName(game.team2Player1Id)} & ${getPlayerName(
          game.team2Player2Id,
        )}`;

        return (
          <div
            key={gameIndex}
            className={`rounded-xl p-4 border transition-all duration-300 ${
              game.team1Score !== undefined && game.team2Score !== undefined
                ? 'bg-success/5 border-success/30 shadow-sm'
                : 'bg-surface-alt/50 border-border hover:border-warning/30'
            }`}
          >
            <div className="flex justify-center mb-2">
              <div
                className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
                  game.team1Score !== undefined && game.team2Score !== undefined
                    ? 'bg-success/20 text-success'
                    : 'bg-surface text-text-muted'
                }`}
              >
                Match {gameIndex + 1}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-main">{team1Name}</span>
                {editableScores && onScoreChange && game.id ? (
                  <input
                    type="number"
                    min={0}
                    max={11}
                    value={game.team1Score ?? ''}
                    onChange={(e) => onScoreChange(game.id!, 'team1Score', Number(e.target.value))}
                    className="w-16 bg-surface border border-border rounded px-2 py-1.5 text-center text-sm font-bold focus:ring-2 ring-warning/50 outline-none"
                    placeholder="Team 1"
                  />
                ) : (
                  <span className="px-2 py-1 rounded bg-success/10 text-success font-bold w-12 text-center">
                    {game.team1Score ?? '-'}
                  </span>
                )}
              </div>
              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-border" />
                <span className="flex-shrink-0 mx-2 text-[10px] font-bold text-text-muted uppercase">
                  VS
                </span>
                <div className="flex-grow border-t border-border" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-main">{team2Name}</span>
                {editableScores && onScoreChange && game.id ? (
                  <input
                    type="number"
                    min={0}
                    max={11}
                    value={game.team2Score ?? ''}
                    onChange={(e) => onScoreChange(game.id!, 'team2Score', Number(e.target.value))}
                    className="w-16 bg-surface border border-border rounded px-2 py-1.5 text-center text-sm font-bold focus:ring-2 ring-warning/50 outline-none"
                    placeholder="Team 2"
                  />
                ) : (
                  <span className="px-2 py-1 rounded bg-error/10 text-error font-bold w-12 text-center">
                    {game.team2Score ?? '-'}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CourtCard: React.FC<CourtCardProps> = ({
  court,
  players,
  editableScores = false,
  onScoreChange,
  roundNumber,
}) => (
  <div className="p-0 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300 border-t-4 border-primary bg-surface rounded-xl shadow">
    <div className="p-4 border-b border-border bg-surface-highlight/20 flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <span className="p-2 bg-primary/10 rounded-lg font-bold text-primary">
          Court {court.courtNumber}
        </span>
        <span className="text-xs font-semibold text-accent bg-surface-alt/60 rounded px-2 py-0.5">
          Tier: {court.tier}
        </span>
        <span className="ml-auto text-xs text-text-muted">Round {roundNumber}</span>
      </div>
    </div>
    <div className="p-4 space-y-6">
      <div>
        <div className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Players</div>
        <PlayerList playerIds={court.playerIds} players={players} />
      </div>
      <div>
        <div className="text-sm font-bold text-warning uppercase tracking-wider mb-2">Matches</div>
        <MatchList
          games={court.games}
          editableScores={editableScores}
          onScoreChange={onScoreChange}
        />
      </div>
    </div>
  </div>
);

export default CourtCard;

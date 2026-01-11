// src/components/eventNight/CourtCard.tsx
import React from 'react';

export interface Player {
  id: string;
  name: string;
}

export interface Match {
  id?: string;
  team1Score?: number;
  team2Score?: number;
  courtId?: string;
}

export interface Court {
  id?: string;
  courtNumber: number;
  tier: string;
  playerIds: string[];
  games: Match[];
}

export interface CourtCardProps {
  court: Court;
  players: Player[];
  editableScores?: boolean;
  onScoreChange?: (matchId: string, field: 'team1Score' | 'team2Score', value: number) => void;
  roundNumber: number;
}

const PlayerList: React.FC<{ playerIds: string[]; players: Player[] }> = ({
  playerIds,
  players,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {playerIds.map((id, i) => {
      const player = players.find((p) => p.id === id);
      return (
        <div
          key={i}
          className="flex items-center gap-3 bg-surface-alt/30 p-2 rounded-lg border border-transparent transition-colors"
        >
          <div className="w-8 text-xs text-text-muted font-mono font-bold">P{i + 1}</div>
          <div className="flex-1">{player?.name ?? 'Unknown'}</div>
        </div>
      );
    })}
  </div>
);

const MatchList: React.FC<{
  games: Match[];
  editableScores?: boolean;
  onScoreChange?: (matchId: string, field: 'team1Score' | 'team2Score', value: number) => void;
}> = ({ games, editableScores, onScoreChange }) => (
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
    {games.map((game, gameIndex) => (
      <div
        key={gameIndex}
        className={`rounded-xl p-4 border transition-all duration-300 ${
          game.team1Score !== undefined && game.team2Score !== undefined
            ? 'bg-success/5 border-success/30 shadow-sm'
            : 'bg-surface-alt/50 border-border hover:border-warning/30'
        }`}
      >
        <div className="flex justify-center mb-3">
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
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium truncate pr-2 w-2/3">Team 1</span>
            {editableScores && onScoreChange && game.id ? (
              <input
                type="number"
                min={0}
                max={11}
                value={game.team1Score ?? ''}
                onChange={(e) => onScoreChange(game.id!, 'team1Score', Number(e.target.value))}
                className="w-full bg-surface border border-border rounded px-2 py-1.5 text-center text-sm font-bold focus:ring-2 ring-warning/50 outline-none"
                placeholder="Team 1"
              />
            ) : (
              <span className="px-2 py-1 rounded bg-success/10 text-success font-bold w-16 text-center">
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
            <span className="text-sm font-medium truncate pr-2 w-2/3">Team 2</span>
            {editableScores && onScoreChange && game.id ? (
              <input
                type="number"
                min={0}
                max={11}
                value={game.team2Score ?? ''}
                onChange={(e) => onScoreChange(game.id!, 'team2Score', Number(e.target.value))}
                className="w-full bg-surface border border-border rounded px-2 py-1.5 text-center text-sm font-bold focus:ring-2 ring-warning/50 outline-none"
                placeholder="Team 2"
              />
            ) : (
              <span className="px-2 py-1 rounded bg-error/10 text-error font-bold w-16 text-center">
                {game.team2Score ?? '-'}
              </span>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const CourtCard: React.FC<CourtCardProps> = ({
  court,
  players,
  editableScores = false,
  onScoreChange,
  roundNumber,
}) => (
  <div className="p-0 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300 border-t-4 border-primary bg-surface rounded shadow-lg">
    <div className="p-6 border-b border-border bg-surface-highlight/20">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <span className="font-bold text-primary">Court {court.courtNumber}</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-main">Court {court.courtNumber}</h2>
          <p className="text-sm text-text-muted">Round {roundNumber}</p>
          <span className="inline-block mt-1 text-xs font-semibold text-accent bg-surface-alt/60 rounded px-2 py-0.5">
            Tier: {court.tier}
          </span>
        </div>
      </div>
    </div>
    <div className="p-6 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider">
          Players
        </div>
        <PlayerList playerIds={court.playerIds} players={players} />
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-warning uppercase tracking-wider">
          Matches
        </div>
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

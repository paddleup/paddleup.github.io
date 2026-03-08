import type { Player } from '../hooks/useLeaderboard';
import PlayerRow from './PlayerRow';

interface LeaderboardTableProps {
  players: Player[];
}

export default function LeaderboardTable({ players }: LeaderboardTableProps) {
  if (players.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No players in this category yet. Update categories.json to assign players.
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
        {/* Header */}
        <div className="grid grid-cols-[3.5rem_1fr_5rem] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-700/50">
          <span>Rank</span>
          <span>Player</span>
          <span className="text-right">Pts</span>
        </div>

        {/* Rows */}
        <div>
          {players.map((player, index) => (
            <PlayerRow key={player.name} player={player} rank={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

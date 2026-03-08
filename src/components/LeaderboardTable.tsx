import type { Player } from '../hooks/useLeaderboard';
import PlayerRow from './PlayerRow';

interface LeaderboardTableProps {
  players: Player[];
}

export default function LeaderboardTable({ players }: LeaderboardTableProps) {
  if (players.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No players in this category yet. Update categories.json to assign players.
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[3.5rem_1fr_5rem] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
          <span>Rank</span>
          <span>Player</span>
          <span className="text-right">Pts</span>
        </div>

        <div>
          {players.map((player, index) => (
            <PlayerRow key={player.name} player={player} rank={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

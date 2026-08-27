import type { Player } from "../hooks/useLeaderboard";
import PlayerRow from "./PlayerRow";

interface LeaderboardTableProps {
  players: Player[];
}

export default function LeaderboardTable({ players }: LeaderboardTableProps) {
  if (players.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-slate-400 dark:border-slate-800 dark:bg-slate-900">
        No rankings available yet.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full min-w-[34rem] border-collapse">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-500">
          <tr>
            <th className="w-20 px-5 py-3 text-left">Rank</th>
            <th className="w-12 px-2 py-3" aria-label="Movement" />
            <th className="px-3 py-3 text-left">Player</th>
            <th className="w-20 px-3 py-3 text-center">Events</th>
            <th className="w-28 px-5 py-3 text-right">Points</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {players.map((player, index) => (
            <PlayerRow key={player.name} player={player} rank={index + 1} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

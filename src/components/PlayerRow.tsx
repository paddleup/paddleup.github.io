import type { Player } from "../hooks/useLeaderboard";
import { ChevronUp, ChevronDown } from "lucide-react";

interface PlayerRowProps {
  player: Player;
  rank: number;
}

function getRankBadge(rank: number) {
  switch (rank) {
    case 1:
      return "bg-blue text-white";
    case 2:
      return "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200";
    case 3:
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300";
    default:
      return "bg-transparent text-slate-400 dark:text-slate-500";
  }
}

function Movement({ move }: { move: Player["move"] }) {
  if (move.dir === "none") {
    return null;
  }
  const isUp = move.dir === "up";
  const Icon = isUp ? ChevronUp : ChevronDown;
  return (
    <span
      className={`inline-flex items-center font-medium tabular-nums ${
        isUp
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-red-500 dark:text-red-400"
      }`}
      title={`Moved ${isUp ? "up" : "down"} ${move.places} ${
        move.places === 1 ? "place" : "places"
      }`}
    >
      <Icon className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden="true" />
      {move.places}
    </span>
  );
}

export default function PlayerRow({ player, rank }: PlayerRowProps) {
  const badge = getRankBadge(rank);
  const isTop3 = rank <= 3;

  return (
    <tr className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40">
      <td className="px-5 py-4">
        <span
          className={`
            inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold tabular-nums
            ${badge}
          `}
        >
          {rank}
        </span>
      </td>

      <td className="px-2 py-4 text-center text-sm">
        <Movement move={player.move} />
      </td>

      <td
        className={`px-3 py-4 font-semibold ${
          isTop3
            ? "text-ink dark:text-white"
            : "text-slate-700 dark:text-slate-300"
        }`}
      >
        {player.name}
      </td>

      <td className="px-3 py-4 text-center text-sm tabular-nums text-slate-500 dark:text-slate-400">
        {player.events}
      </td>

      <td
        className={`px-5 py-4 text-right font-bold tabular-nums ${
          isTop3
            ? "text-blue dark:text-blue-300"
            : "text-slate-600 dark:text-slate-300"
        }`}
      >
        {player.points.toLocaleString()}
      </td>
    </tr>
  );
}

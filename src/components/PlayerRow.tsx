import type { Player } from '../hooks/useLeaderboard';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface PlayerRowProps {
  player: Player;
  rank: number;
}

function getRankBadge(rank: number) {
  switch (rank) {
    case 1:
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
    case 2:
      return 'bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300';
    case 3:
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
    default:
      return 'bg-transparent text-slate-400 dark:text-slate-500';
  }
}

function Movement({ move }: { move: Player['move'] }) {
  if (move.dir === 'none') {
    return null;
  }
  const isUp = move.dir === 'up';
  const Icon = isUp ? ChevronUp : ChevronDown;
  return (
    <span
      className={`inline-flex items-center font-medium tabular-nums ${
        isUp ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
      }`}
      title={`Moved ${isUp ? 'up' : 'down'} ${move.places} ${move.places === 1 ? 'place' : 'places'}`}
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
    <div
      className={`
        grid grid-cols-[3.5rem_2rem_1fr_3.5rem_4rem] items-center px-4 py-3
        border-b border-slate-100 dark:border-slate-800 last:border-b-0
        hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors
        ${rank % 2 === 0 ? 'bg-slate-50/50 dark:bg-slate-800/20' : ''}
      `}
    >
      {/* Rank */}
      <div>
        <span
          className={`
            w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold
            ${badge}
          `}
        >
          {rank}
        </span>
      </div>

      {/* Movement */}
      <span className="text-center text-sm">
        <Movement move={player.move} />
      </span>

      {/* Name */}
      <span className={`font-medium ${isTop3 ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
        {player.name}
      </span>

      {/* Events */}
      <span className="text-center text-sm text-slate-500 dark:text-slate-400">{player.events}</span>

      {/* Points */}
      <span className={`text-right font-semibold ${isTop3 ? 'text-accent-600 dark:text-accent-400' : 'text-slate-500 dark:text-slate-400'}`}>
        {player.points}
      </span>
    </div>
  );
}

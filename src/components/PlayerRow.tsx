import type { Player } from '../hooks/useLeaderboard';

interface PlayerRowProps {
  player: Player;
  rank: number;
}

function getRankStyle(rank: number) {
  switch (rank) {
    case 1:
      return { border: 'border-l-4 border-l-gold', badge: 'bg-gold text-slate-950', glow: 'shadow-gold/10' };
    case 2:
      return { border: 'border-l-4 border-l-silver', badge: 'bg-silver text-slate-950', glow: 'shadow-silver/10' };
    case 3:
      return { border: 'border-l-4 border-l-bronze', badge: 'bg-bronze text-slate-950', glow: 'shadow-bronze/10' };
    default:
      return { border: 'border-l-4 border-l-transparent', badge: 'bg-slate-700 text-slate-300', glow: '' };
  }
}

function getMedal(rank: number): string {
  switch (rank) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return '';
  }
}

export default function PlayerRow({ player, rank }: PlayerRowProps) {
  const style = getRankStyle(rank);
  const medal = getMedal(rank);
  const isTop3 = rank <= 3;

  return (
    <div
      className={`
        grid grid-cols-[3.5rem_1fr_5rem] items-center px-4 py-3 row-glow
        ${style.border}
        ${rank % 2 === 0 ? 'bg-slate-800/30' : 'bg-transparent'}
        ${isTop3 ? `shadow-sm ${style.glow}` : ''}
      `}
    >
      {/* Rank */}
      <div className="flex items-center gap-1">
        {medal ? (
          <span className="text-lg">{medal}</span>
        ) : (
          <span
            className={`
              w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
              ${style.badge}
            `}
          >
            {rank}
          </span>
        )}
      </div>

      {/* Name */}
      <span className={`font-medium ${isTop3 ? 'text-white text-base' : 'text-slate-200'}`}>
        {player.name}
      </span>

      {/* Points */}
      <span className={`text-right font-bold ${isTop3 ? 'text-amber-400 text-lg' : 'text-amber-400/70'}`}>
        {player.points}
      </span>
    </div>
  );
}

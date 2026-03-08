import { Trophy } from 'lucide-react';
import type { Player } from '../hooks/useLeaderboard';

interface HeroProps {
  leader: Player | null;
  categoryLabel: string;
}

export default function Hero({ leader, categoryLabel }: HeroProps) {
  if (!leader) {
    return (
      <section className="py-12 flex flex-col items-center justify-center text-center">
        <p className="text-slate-400 text-lg">No players in this category yet</p>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-14 flex flex-col items-center justify-center text-center">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm px-8 py-8 md:px-12 md:py-10 max-w-md w-full">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Trophy className="w-5 h-5 text-emerald-500" />
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            {categoryLabel}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-3">
          {leader.name}
        </h2>
        <div className="inline-flex items-baseline gap-1.5">
          <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{leader.points}</span>
          <span className="text-sm text-slate-400 font-medium">pts</span>
        </div>
      </div>
    </section>
  );
}

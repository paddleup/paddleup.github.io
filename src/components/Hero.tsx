import { Trophy } from 'lucide-react';
import type { Player } from '../hooks/useLeaderboard';

interface HeroProps {
  leader: Player | null;
  categoryLabel: string;
}

export default function Hero({ leader, categoryLabel }: HeroProps) {
  if (!leader) {
    return (
      <section className="relative py-16 flex flex-col items-center justify-center text-center">
        <p className="text-slate-400 text-lg">No players in this category yet</p>
      </section>
    );
  }

  return (
    <section className="relative py-12 md:py-16 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Radial glow background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10">
        <Trophy className="w-12 h-12 md:w-16 md:h-16 text-amber-400 mx-auto mb-4" />
        <h2 className="gold-shimmer text-4xl md:text-6xl font-extrabold tracking-tight mb-2">
          {leader.name}
        </h2>
        <p className="text-slate-400 text-lg md:text-xl mb-4">
          {categoryLabel} Champion
        </p>
        <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-amber-500/30 rounded-full px-6 py-2">
          <span className="text-amber-400 font-bold text-2xl md:text-3xl">{leader.points}</span>
          <span className="text-slate-400 text-sm uppercase tracking-wider">pts</span>
        </div>
      </div>
    </section>
  );
}

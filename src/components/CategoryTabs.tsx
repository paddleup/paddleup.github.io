import { Crown } from 'lucide-react';
import type { CategorySlug, Category } from '../hooks/useLeaderboard';
import { useLeaderboard } from '../hooks/useLeaderboard';

interface CategoryTabsProps {
  categories: Category[];
  selected: CategorySlug;
  onSelect: (slug: CategorySlug) => void;
}

export default function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  const { getLeader } = useLeaderboard();

  return (
    <nav className="w-full overflow-x-auto scrollbar-hide py-2">
      <div className="flex gap-2 md:gap-3 min-w-max px-4 md:px-0 md:justify-center">
        {categories.map((cat) => {
          const isActive = cat.slug === selected;
          const leader = getLeader(cat.slug);

          return (
            <button
              key={cat.slug}
              onClick={() => onSelect(cat.slug)}
              className={`
                flex flex-col items-center px-4 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 whitespace-nowrap cursor-pointer
                ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25'
                    : 'bg-slate-800/60 text-slate-300 border border-slate-700 hover:border-amber-500/50 hover:text-white'
                }
              `}
            >
              <span className="font-semibold">{cat.label}</span>
              {leader && (
                <span
                  className={`text-xs mt-0.5 flex items-center gap-1 ${
                    isActive ? 'text-slate-800' : 'text-slate-500'
                  }`}
                >
                  <Crown className="w-3 h-3" />
                  {leader.name}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

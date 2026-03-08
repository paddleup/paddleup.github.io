import type { CategorySlug, Category } from '../hooks/useLeaderboard';

interface CategoryTabsProps {
  categories: Category[];
  selected: CategorySlug;
  onSelect: (slug: CategorySlug) => void;
}

export default function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  return (
    <nav className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-1 min-w-max px-4 md:px-0 md:justify-center border-b border-slate-200 dark:border-slate-700">
        {categories.map((cat) => {
          const isActive = cat.slug === selected;
          return (
            <button
              key={cat.slug}
              onClick={() => onSelect(cat.slug)}
              className={`
                px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer
                border-b-2 -mb-px
                ${
                  isActive
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }
              `}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

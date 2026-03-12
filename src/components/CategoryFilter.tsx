import type { CategorySlug } from '../hooks/useLeaderboard';

type Gender = 'all' | 'mens' | 'womens';

interface CategoryFilterProps {
  selected: CategorySlug;
  onSelect: (slug: CategorySlug) => void;
  unclassifiedCount: number;
  isAdmin: boolean;
}

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'mens', label: "Men's" },
  { value: 'womens', label: "Women's" },
];

const AGE_GROUPS: { slug: string; label: string }[] = [
  { slug: 'overall', label: 'Overall' },
  { slug: '50', label: '50+' },
  { slug: '60', label: '60+' },
];

function getGender(slug: CategorySlug): Gender {
  if (slug.startsWith('mens')) return 'mens';
  if (slug.startsWith('womens')) return 'womens';
  return 'all';
}

function getAge(slug: CategorySlug): string {
  if (slug.endsWith('-50')) return '50';
  if (slug.endsWith('-60')) return '60';
  return 'overall';
}

function chip(active: boolean) {
  return `px-6 py-2.5 text-base font-medium rounded-full transition-all cursor-pointer whitespace-nowrap border ${
    active
      ? 'bg-accent-500/15 text-accent-600 dark:text-accent-400 border-accent-500 dark:border-accent-400 shadow-sm'
      : 'bg-transparent text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300'
  }`;
}

export default function CategoryFilter({ selected, onSelect, unclassifiedCount, isAdmin }: CategoryFilterProps) {
  const gender = getGender(selected);
  const age = getAge(selected);
  const isUnclassified = selected === 'unclassified';

  const handleGender = (g: Gender) => {
    if (g === 'all') {
      onSelect('overall');
    } else {
      onSelect(`${g}-overall` as CategorySlug);
    }
  };

  const handleAge = (a: string) => {
    onSelect(`${gender}-${a}` as CategorySlug);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-3">
        {GENDERS.map((g) => (
          <button
            key={g.value}
            onClick={() => handleGender(g.value)}
            className={chip(!isUnclassified && gender === g.value)}
          >
            {g.label}
          </button>
        ))}
      </div>

      {gender !== 'all' && !isUnclassified && (
        <div className="flex flex-wrap justify-center gap-3">
          {AGE_GROUPS.map((a) => (
            <button
              key={a.slug}
              onClick={() => handleAge(a.slug)}
              className={chip(age === a.slug)}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}

      {isAdmin && unclassifiedCount > 0 && (
        <button
          onClick={() => onSelect('unclassified')}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all cursor-pointer whitespace-nowrap border border-dashed ${
            isUnclassified
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500 dark:border-amber-400'
              : 'text-slate-400 dark:text-slate-500 border-slate-300 dark:border-slate-600 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-400'
          }`}
        >
          Unclassified ({unclassifiedCount})
        </button>
      )}
    </div>
  );
}

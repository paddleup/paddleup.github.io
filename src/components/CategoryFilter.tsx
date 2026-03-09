import type { CategorySlug } from '../hooks/useLeaderboard';

type Gender = 'all' | 'mens' | 'womens';
type AgeGroup = 'overall' | '50' | '60';

interface CategoryFilterProps {
  selected: CategorySlug;
  onSelect: (slug: CategorySlug) => void;
}

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'mens', label: "Men's" },
  { value: 'womens', label: "Women's" },
];

const AGE_GROUPS: { value: AgeGroup; label: string }[] = [
  { value: 'overall', label: 'Overall' },
  { value: '50', label: '50+' },
  { value: '60', label: '60+' },
];

function parseSlug(slug: CategorySlug): { gender: Gender; age: AgeGroup } {
  if (slug === 'overall') return { gender: 'all', age: 'overall' };
  if (slug === 'all-50') return { gender: 'all', age: '50' };
  if (slug === 'all-60') return { gender: 'all', age: '60' };
  const [g, a] = slug.split('-') as [string, string];
  return {
    gender: g as Gender,
    age: a === 'overall' ? 'overall' : (a as AgeGroup),
  };
}

function toSlug(gender: Gender, age: AgeGroup): CategorySlug {
  if (gender === 'all') {
    if (age === '50') return 'all-50';
    if (age === '60') return 'all-60';
    return 'overall';
  }
  return `${gender}-${age}` as CategorySlug;
}

function chip(active: boolean) {
  return `px-6 py-2.5 text-base font-medium rounded-full transition-all cursor-pointer whitespace-nowrap border ${
    active
      ? 'bg-accent-500/15 text-accent-600 dark:text-accent-400 border-accent-500 dark:border-accent-400 shadow-sm'
      : 'bg-transparent text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300'
  }`;
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const { gender, age } = parseSlug(selected);

  const handleGender = (g: Gender) => {
    onSelect(toSlug(g, age));
  };

  const handleAge = (a: AgeGroup) => {
    onSelect(toSlug(gender, a));
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Gender selector */}
      <div className="flex gap-3">
        {GENDERS.map((g) => (
          <button
            key={g.value}
            onClick={() => handleGender(g.value)}
            className={chip(gender === g.value)}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Age group selector */}
      <div className="flex gap-3">
        {AGE_GROUPS.map((a) => (
          <button
            key={a.value}
            onClick={() => handleAge(a.value)}
            className={chip(age === a.value)}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

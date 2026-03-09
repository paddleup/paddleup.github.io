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

function segmentBtn(active: boolean, position: 'first' | 'middle' | 'last') {
  const rounded =
    position === 'first'
      ? 'rounded-l-lg'
      : position === 'last'
        ? 'rounded-r-lg'
        : '';
  const border = position !== 'first' ? 'border-l border-slate-200 dark:border-slate-600' : '';

  return `relative px-5 py-2 text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${rounded} ${border} ${
    active
      ? 'bg-accent-500 text-white shadow-sm z-10 border-transparent'
      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
  }`;
}

function getPosition(index: number, total: number): 'first' | 'middle' | 'last' {
  if (index === 0) return 'first';
  if (index === total - 1) return 'last';
  return 'middle';
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
      <div className="inline-flex rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 overflow-hidden">
        {GENDERS.map((g, i) => (
          <button
            key={g.value}
            onClick={() => handleGender(g.value)}
            className={segmentBtn(gender === g.value, getPosition(i, GENDERS.length))}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Age group selector */}
      <div className="inline-flex rounded-lg shadow-sm border border-slate-200 dark:border-slate-600 overflow-hidden">
        {AGE_GROUPS.map((a, i) => (
          <button
            key={a.value}
            onClick={() => handleAge(a.value)}
            className={segmentBtn(age === a.value, getPosition(i, AGE_GROUPS.length))}
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

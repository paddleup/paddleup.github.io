import type { RankingView } from '../hooks/useLeaderboard';

interface ViewTabsProps {
  selected: RankingView;
  onSelect: (view: RankingView) => void;
}

const currentMonthName = new Date().toLocaleDateString('en-US', { month: 'long' });

const VIEWS: { value: RankingView; label: string }[] = [
  { value: 'current-month', label: currentMonthName },
  { value: 'past-30-days', label: 'Past 30 Days' },
  { value: 'all-time', label: 'All Time' },
];

function chip(active: boolean) {
  return `px-6 py-2.5 text-base font-medium rounded-full transition-all cursor-pointer whitespace-nowrap border ${
    active
      ? 'bg-accent-500/15 text-accent-600 dark:text-accent-400 border-accent-500 dark:border-accent-400 shadow-sm'
      : 'bg-transparent text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300'
  }`;
}

export default function ViewTabs({ selected, onSelect }: ViewTabsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {VIEWS.map((v) => (
        <button key={v.value} onClick={() => onSelect(v.value)} className={chip(selected === v.value)}>
          {v.label}
        </button>
      ))}
    </div>
  );
}

import type { RankingView } from "../hooks/useLeaderboard";

interface ViewTabsProps {
  selected: RankingView;
  onSelect: (view: RankingView) => void;
}

const currentMonthName = new Date().toLocaleDateString("en-US", {
  month: "long",
});

const VIEWS: { value: RankingView; label: string }[] = [
  { value: "current-month", label: currentMonthName },
  { value: "past-30-days", label: "Past 30 Days" },
  { value: "all-time", label: "All Time" },
];

function chip(active: boolean) {
  return `rounded-md px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
    active
      ? "bg-white text-blue shadow-sm dark:bg-slate-700 dark:text-blue-300"
      : "text-slate-500 hover:text-ink dark:text-slate-400 dark:hover:text-white"
  }`;
}

export default function ViewTabs({ selected, onSelect }: ViewTabsProps) {
  return (
    <div className="scrollbar-hide inline-flex max-w-full gap-1 overflow-x-auto rounded-lg bg-slate-200/70 p-1 dark:bg-slate-800">
      {VIEWS.map((v) => (
        <button
          key={v.value}
          onClick={() => onSelect(v.value)}
          aria-pressed={selected === v.value}
          className={chip(selected === v.value)}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}

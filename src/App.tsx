import { useState } from 'react';
import { useLeaderboard, CATEGORIES } from './hooks/useLeaderboard';
import type { CategorySlug } from './hooks/useLeaderboard';
import CategoryTabs from './components/CategoryTabs';
import LeaderboardTable from './components/LeaderboardTable';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';

export default function App() {
  const [selected, setSelected] = useState<CategorySlug>('overall');
  const { data, loading, error, getPlayersForCategory } = useLeaderboard();

  const players = getPlayersForCategory(selected);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Paddle Up Club Leaderboard
            </h1>
            <p className="text-accent-600 dark:text-accent-400 text-sm md:text-base font-medium">
              St. Louis Club Championship
            </p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6">
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-32">
            <p className="text-red-500 text-lg mb-2">Failed to load leaderboard</p>
            <p className="text-slate-500 text-sm">{error}</p>
          </div>
        )}

        {data && (
          <>
            <div className="mb-8">
              <CategoryTabs
                categories={CATEGORIES}
                selected={selected}
                onSelect={setSelected}
              />
            </div>

            <LeaderboardTable players={players} />

            <Footer scrapedAt={data.scrapedAt} />
          </>
        )}
      </main>
    </div>
  );
}

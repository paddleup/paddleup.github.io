import { useState } from 'react';
import { useLeaderboard, CATEGORIES } from './hooks/useLeaderboard';
import type { CategorySlug } from './hooks/useLeaderboard';
import Hero from './components/Hero';
import CategoryTabs from './components/CategoryTabs';
import LeaderboardTable from './components/LeaderboardTable';
import Footer from './components/Footer';

export default function App() {
  const [selected, setSelected] = useState<CategorySlug>('mens-overall');
  const { data, loading, error, getPlayersForCategory, getLeader } = useLeaderboard();

  const currentCategory = CATEGORIES.find((c) => c.slug === selected)!;
  const players = getPlayersForCategory(selected);
  const leader = getLeader(selected);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4 md:py-5">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            PADDLE UP PICKLEBALL CLUB
          </h1>
          <p className="text-amber-400 text-sm md:text-base font-medium tracking-wide">
            ST. LOUIS CLUB CHAMPIONSHIP
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-32">
            <p className="text-red-400 text-lg mb-2">Failed to load leaderboard</p>
            <p className="text-slate-500 text-sm">{error}</p>
          </div>
        )}

        {data && (
          <>
            {/* Hero - Champion Spotlight */}
            <Hero leader={leader} categoryLabel={currentCategory.label} />

            {/* Category Tabs */}
            <div className="mb-8">
              <CategoryTabs
                categories={CATEGORIES}
                selected={selected}
                onSelect={setSelected}
              />
            </div>

            {/* Leaderboard Table */}
            <LeaderboardTable players={players} />

            {/* Footer */}
            <Footer scrapedAt={data.scrapedAt} />
          </>
        )}
      </main>
    </div>
  );
}

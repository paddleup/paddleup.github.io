import { useState } from 'react';
import { useLeaderboard } from './hooks/useLeaderboard';
import type { RankingView } from './hooks/useLeaderboard';
import ViewTabs from './components/ViewTabs';
import LeaderboardTable from './components/LeaderboardTable';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';
import PaddleUpLogo from './components/PaddleUpLogo';

export default function App() {
  const [selected, setSelected] = useState<RankingView>('current-month');
  const { data, loading, error, getPlayersForView } = useLeaderboard();

  const players = getPlayersForView(selected);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      {/* Header */}
      <header className="bg-accent-500 dark:bg-accent-700">
        <div className="max-w-4xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <PaddleUpLogo className="h-8 md:h-10 w-auto" />
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
            <h2 className="text-2xl md:text-3xl font-medium text-slate-900 dark:text-white mb-6 text-center">
              King of the Court League
            </h2>

            <div className="mb-8">
              <ViewTabs selected={selected} onSelect={setSelected} />
            </div>

            <LeaderboardTable players={players} />

            <Footer scrapedAt={data.scrapedAt} />
          </>
        )}
      </main>
    </div>
  );
}

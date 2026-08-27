import { useEffect, useState } from "react";
import { useLeaderboard } from "./hooks/useLeaderboard";
import type { RankingView } from "./hooks/useLeaderboard";
import ViewTabs from "./components/ViewTabs";
import LeaderboardTable from "./components/LeaderboardTable";
import Footer from "./components/Footer";
import LeagueDetails from "./components/LeagueDetails";
import ThemeToggle from "./components/ThemeToggle";
import PaddleUpLogo from "./components/PaddleUpLogo";

export default function App() {
  const [selected, setSelected] = useState<RankingView>("current-month");
  const [route, setRoute] = useState(window.location.hash);
  const { data, loading, error, getPlayersForView } = useLeaderboard();
  const isLeaguePage = route === "#/league";
  const homeUrl = "#/";
  const leagueUrl = "#/league";

  const players = getPlayersForView(selected);

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash);

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    document.title = isLeaguePage
      ? "KOTC League Format | Paddle Up Pickleball"
      : "Paddle Up Pickleball | Leaderboard";
  }, [isLeaguePage]);

  return (
    <div className="min-h-screen bg-slate-50 text-ink transition-colors dark:bg-slate-950 dark:text-white">
      <header className="bg-ink text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <a href={homeUrl} aria-label="PaddleUp home">
            <PaddleUpLogo className="h-9 w-auto" />
          </a>
          <div className="flex items-center gap-4">
            <nav
              className="hidden items-center gap-5 sm:flex"
              aria-label="Primary navigation"
            >
              <a
                href={homeUrl}
                aria-current={!isLeaguePage ? "page" : undefined}
                className={`text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                  !isLeaguePage
                    ? "text-white"
                    : "text-white/55 hover:text-white"
                }`}
              >
                Rankings
              </a>
              <a
                href={leagueUrl}
                aria-current={isLeaguePage ? "page" : undefined}
                className={`text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                  isLeaguePage ? "text-white" : "text-white/55 hover:text-white"
                }`}
              >
                League format
              </a>
            </nav>
            <ThemeToggle />
          </div>
        </div>
        <nav
          className="mx-auto flex max-w-5xl border-t border-white/10 px-4 sm:hidden"
          aria-label="Mobile navigation"
        >
          <a
            href={homeUrl}
            aria-current={!isLeaguePage ? "page" : undefined}
            className={`border-b-2 px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] ${
              !isLeaguePage
                ? "border-blue-400 text-white"
                : "border-transparent text-white/55"
            }`}
          >
            Rankings
          </a>
          <a
            href={leagueUrl}
            aria-current={isLeaguePage ? "page" : undefined}
            className={`border-b-2 px-3 py-3 text-xs font-semibold uppercase tracking-[0.12em] ${
              isLeaguePage
                ? "border-blue-400 text-white"
                : "border-transparent text-white/55"
            }`}
          >
            League format
          </a>
        </nav>
      </header>

      {isLeaguePage ? (
        <LeagueDetails leaderboardUrl={homeUrl} />
      ) : (
        <main>
          <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
              <div className="mb-4 flex items-center gap-3 text-blue">
                <span className="h-2 w-2 bg-blue" />
                <span className="text-xs font-bold uppercase tracking-[0.22em]">
                  King of the Court
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
                League rankings
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400">
                Follow the latest PaddleUp standings, points, and movement
                across each ranking period.
              </p>
            </div>
          </section>

          <section>
            {loading && (
              <div className="flex items-center justify-center py-32">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-ink/20 border-t-ink dark:border-white/20 dark:border-t-white" />
              </div>
            )}

            {error && (
              <div className="mx-auto max-w-5xl px-4 py-32 text-center sm:px-6">
                <p className="text-xl font-bold">Failed to load leaderboard</p>
                <p className="mt-2 text-sm text-slate-500">{error}</p>
              </div>
            )}

            {data && (
              <>
                <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                        Current standings
                      </span>
                      <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                        Player leaderboard
                      </h2>
                    </div>
                    <p className="max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                      Rankings reflect points earned through league events.
                    </p>
                  </div>

                  <div className="py-7">
                    <ViewTabs selected={selected} onSelect={setSelected} />
                  </div>

                  <LeaderboardTable players={players} />
                </div>

                <Footer scrapedAt={data.scrapedAt} />
              </>
            )}
          </section>
        </main>
      )}
    </div>
  );
}

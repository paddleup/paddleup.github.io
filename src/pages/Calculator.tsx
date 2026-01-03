import React, { useCallback } from 'react';
import {
  Users,
  Trophy,
  ClipboardList,
  LayoutGrid,
  Activity,
  Save,
  CheckCircle2,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import TierPill from '../components/ui/TierPill';
import RankBadge from '../components/ui/RankBadge';

/**
 * Refactored MatchCalculator
 *
 * Improvements introduced:
 * - Split computation into smaller helper functions for readability
 * - Use useCallback / useMemo to avoid recreating functions on each render
 * - Clearer naming and reduced inline IIFEs in JSX
 * - Preserved original behavior and UI while improving maintainability
 */

/* ----------------------------- Types ------------------------------ */

/* -------------------------- Small helpers ------------------------- */

const ordinal = (n: number) => {
  if (!n || isNaN(n)) return String(n);
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
};

import PlayerCombobox from '../components/calculator/PlayerCombobox';

/* --------------------- Seed layout & tier helpers --------------------- */

/**
 * Keep the original seed layout logic intact (mirrors previous behavior).
 * This function purposefully mirrors existing mapping for 12/16 player special cases.
 */

import { useMatchCalculator } from '../hooks/useMatchCalculator';
import { compareTiers, PlayerDetails, PlayersPerCourt } from '../hooks/useCalculator';

/* ------------------------ Main component -------------------------- */

export default function Calculator(): React.ReactElement {
  const {
    courtDetails,
    round,
    setRound,
    results,
    duplicateError,
    activeView,
    setActiveView,
    copyFeedback,

    // actions
    setPlayerName,
    setScore,
    advanceToNextRound,
    resetAll,
    copyRankingsToClipboard,

    // derived
    totalMatches,
    completedMatches,
    progressPercent,
    playerRankings,
  } = useMatchCalculator();


  /* ------------------------ Movement icon helper ------------------------ */

  const movementIconFor = useCallback((isUp: boolean, isDown: boolean) => {
    if (isUp) {
      return (
        <span className="inline-flex items-center">
          <ArrowUp className="mx-1 h-4 w-4 text-success" />
        </span>
      );
    }
    
    if (isDown) {
      return (
        <span className="inline-flex items-center">
          <ArrowDown className="mx-1 h-4 w-4 text-error" />
        </span>
      );
    }

    // display dot/circle for no movement
    return (
      <span className="inline-flex items-center">
        <span className="mx-2 h-2 w-2 bg-text-muted rounded-full" />
      </span>
    );
  }, []);

  const movementIconForTier = useCallback(({tier, nextTier}: PlayerDetails) => {
    const isUp = compareTiers(tier, nextTier!) > 0;
    const isDown = compareTiers(tier, nextTier!) < 0;

    return movementIconFor(isUp, isDown);
  }, [movementIconFor]);

    const movementIconForRank = useCallback(({seed, roundPlace}: PlayerDetails) => {
      const isUp = seed > roundPlace!;
      const isDown = seed < roundPlace!;
      return movementIconFor(isUp, isDown);
    }, [movementIconFor]);

  /* ------------------------ Render ------------------------ */

  const nextDisabled = completedMatches < totalMatches;
  const nextButtonClass = nextDisabled
    ? 'w-full bg-surface text-text-muted shadow-none cursor-not-allowed'
    : 'w-full bg-success text-white hover:bg-success/90 shadow-lg shadow-success/20';

  return (
    <div className="space-y-8">
      <div className="min-h-[60vh] bg-background text-text-main p-4 sm:p-6">
        <div className="mx-auto">
          <header className="mb-4 text-center">
            <h1 className="text-3xl sm:text-2xl font-extrabold tracking-tight">Match Calculator</h1>
            <p className="text-sm text-text-muted mt-1 max-w-prose mx-auto">
              Enter scores to compute round rankings and next courts.
            </p>
            <div className="mt-3 h-0.5 bg-gradient-to-r from-primary via-text-accent to-success rounded" />
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            <div className="lg:col-span-1 space-y-4 sticky top-4 z-20">
              <Card className="p-2 bg-surface shadow-md">
                <div className="flex p-1 bg-surface-alt rounded-lg">
                  {[1, 2, 3].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRound(r as 1 | 2 | 3);
                      }}
                      className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                        round === r
                          ? 'bg-surface-highlight text-text-main shadow-sm'
                          : 'text-text-muted hover:text-text-main'
                      }`}
                    >
                      Round {r}
                    </button>
                  ))}
                </div>
              </Card>

              <div className="lg:hidden overflow-x-auto pb-2">
                <div className="flex gap-2 min-w-max">
                  {courtDetails.map((court, ci) => (
                    <button
                      key={ci}
                      onClick={() => setActiveView(ci)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeView === ci
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-surface text-text-main border border-border hover:bg-surface-highlight'
                      }`}
                    >
                      <span>Court {ci + 1}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          activeView === ci
                            ? 'bg-white/20 text-white'
                            : 'bg-surface-highlight text-text-muted'
                        }`}
                      >
                        {court.tier}
                      </span>
                    </button>
                  ))}
                  <div className="w-px bg-border mx-1" />
                  <button
                    onClick={() => setActiveView('rankings')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeView === 'rankings'
                        ? 'bg-warning text-surface shadow-md'
                        : 'bg-surface text-text-main border border-border hover:bg-surface-highlight'
                    }`}
                  >
                    Rankings
                  </button>
                </div>
              </div>

              <div className="hidden lg:flex flex-col gap-2">
                {courtDetails.map((court, ci) => (
                  <button
                    key={ci}
                    onClick={() => setActiveView(ci)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all text-left group ${
                      activeView === ci
                        ? 'bg-primary/10 text-primary border-l-4 border-primary shadow-sm'
                        : 'bg-surface text-text-muted border-l-4 border-transparent hover:bg-surface-highlight hover:text-text-main'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <LayoutGrid className="h-4 w-4 opacity-70" />
                      Court {ci + 1}
                    </span>

                      <TierPill
                        tierId={court.tier}
                        size="xs"
                      />
                  </button>
                ))}
                <div className="h-px bg-border my-2" />
                <button
                  onClick={() => setActiveView('rankings')}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all text-left ${
                    activeView === 'rankings'
                      ? 'bg-warning/10 text-warning border-l-4 border-warning shadow-sm'
                      : 'bg-surface text-text-muted border-l-4 border-transparent hover:bg-surface-highlight hover:text-text-main'
                  }`}
                >
                  <Trophy className="h-4 w-4 opacity-70" />
                  Round Rankings
                </button>
              </div>

              <div className="hidden lg:block pt-4 space-y-4">
                <div className="bg-surface p-3 rounded-lg border border-border">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-muted font-medium">Round Progress</span>
                    <span className="text-primary font-bold">{progressPercent}%</span>
                  </div>
                  <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-text-muted mt-1 text-center">
                    {completedMatches} / {totalMatches} Matches
                  </div>
                </div>

                <div className="text-xs text-text-muted text-center">
                  {courtDetails.length * PlayersPerCourt} Players • {courtDetails.length} Courts
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={resetAll}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs text-error hover:bg-error/10 flex items-center gap-2"
                  >
                    <Trash2 className="h-3 w-3" /> Reset All Data
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-1 text-[10px] text-text-muted opacity-60">
                  <Save className="h-3 w-3" /> Auto-saving enabled
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-4">
              {activeView === 'rankings' ? (
                <Card className="p-0 overflow-hidden animate-in fade-in duration-300 border-t-4 border-warning">
                  <div className="p-6 border-b border-border bg-surface-highlight/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-warning/10 rounded-lg">
                        <Trophy className="h-6 w-6 text-warning" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-text-main">Round {round} Rankings</h2>
                        <p className="text-sm text-text-muted">
                          Overall standings and next round assignments
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={copyRankingsToClipboard}
                        variant="secondary"
                        size="sm"
                        className="bg-surface border border-border flex items-center gap-1"
                      >
                        {copyFeedback ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {copyFeedback ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-text-muted border-b border-border bg-surface-alt/50">
                          <th className="py-3 pl-6">{round === 3 ? 'Final Rank' : 'Rank'}</th>
                          <th className="py-3">Player</th>
                          {round === 3 && <th className="py-3">Pts</th>}
                          {round !== 3 && <th className="py-3">Next court</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {playerRankings.map((player, idx) => {
                          return (
                            <tr
                              key={idx}
                              className="border-b border-border last:border-0 hover:bg-surface-highlight/50 transition-colors"
                            >
                              <td className="py-4 pl-6 text-text-main font-bold">
                                {round === 3 ? (
                                  <div className="flex items-center gap-3 whitespace-nowrap">
                                    {movementIconForRank(player)}
                                    <RankBadge rank={idx + 1} size="md" />
                                  </div>
                                ) : (<> 
                                  {movementIconForRank(player)}
                                  {ordinal(idx + 1)}
                                </>
                                )}
                              </td>
                              <td className="py-4 text-text-main font-medium">{player.name}</td>
                              {round === 3 ? (
                                <td className="py-4 text-text-main font-medium">
                                  {
                                    [
                                      1000, 800, 600, 400, 300, 240, 180, 120, 100, 80, 60, 40, 30,
                                      24, 18, 12,
                                    ][idx]
                                  }
                                </td>
                              ) : null}
                              <td className="py-4 text-text-muted text-sm">
                                {round === 3 ? (
                                  <></>
                                ) : (
                                  <div className="flex items-center gap-2 whitespace-nowrap">
                                    {movementIconForTier(player)}
                                    <span className="px-2 py-0.5 rounded text-xs">
                                      <TierPill
                                        tierId={player.nextTier ?? player.tier}
                                        size="xs"
                                        label={player.nextTier ?? undefined}
                                      />
                                    </span>

                                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary text-white ml-2">{`Court ${player.nextCourt}`}</span>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ) : (
                courtDetails.map((court, ci) => {
                  if (ci !== activeView) return null;
                  return (
                    <Card
                      key={ci}
                      className="p-0 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300 border-t-4 border-primary"
                    >
                      <div className="p-6 border-b border-border bg-surface-highlight/20">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <LayoutGrid className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-text-main">Court {ci + 1}</h2>
                            <p className="text-sm text-text-muted">
                              Tier {court.tier} • Round {round}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 space-y-8">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider">
                            <Users className="h-4 w-4" /> Players
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {court.playerNames.map((name, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 bg-surface-alt/30 p-2 rounded-lg border border-transparent focus-within:border-primary/30 transition-colors"
                              >
                                <div className="w-8 text-xs text-text-muted font-mono font-bold">
                                  P{i + 1}
                                </div>
                                <div className="flex-1">
                                  <PlayerCombobox
                                    value={name}
                                    seed={court.seeds[i]}
                                    placeholder={`Select Player ${i + 1}`}
                                    onSelect={(val) => setPlayerName(ci, i, val)}
                                  />
                                </div>
                                <div className="text-right text-xs text-text-muted bg-surface px-2 py-1 rounded">
                                  Seed {court.seeds[i]}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm font-bold text-warning uppercase tracking-wider">
                            <Activity className="h-4 w-4" /> Matches
                          </div>
                          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                            {court.matches.map((m, mi) => {
                              const p1 = court.playerNames[0] || 'P1';
                              const p2 = court.playerNames[1] || 'P2';
                              const p3 = court.playerNames[2] || 'P3';
                              const p4 = court.playerNames[3] || 'P4';
                              const teamA_names =
                                mi === 0 ? [p1, p2] : mi === 1 ? [p1, p3] : [p1, p4];
                              const teamB_names =
                                mi === 0 ? [p3, p4] : mi === 1 ? [p2, p4] : [p2, p3];
                              const isComplete = m.scoreA !== null && m.scoreB !== null;

                              return (
                                <div
                                  key={mi}
                                  className={`rounded-xl p-4 border transition-all duration-300 ${
                                    isComplete
                                      ? 'bg-success/5 border-success/30 shadow-sm'
                                      : 'bg-surface-alt/50 border-border hover:border-warning/30'
                                  }`}
                                >
                                  <div className="flex justify-center mb-3">
                                    <div
                                      className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
                                        isComplete
                                          ? 'bg-success/20 text-success'
                                          : 'bg-surface text-text-muted'
                                      }`}
                                    >
                                      {isComplete && <CheckCircle2 className="h-3 w-3" />} Match{' '}
                                      {mi + 1}
                                    </div>
                                  </div>

                                  <div className="flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                      <span
                                        className="text-sm font-medium truncate pr-2 w-2/3"
                                        title={teamA_names.join(' & ')}
                                      >
                                        {teamA_names.join(' & ')}
                                      </span>
                                      <div className="w-20">
                                        <input
                                          type="number"
                                          min={0}
                                          max={11}
                                          inputMode="numeric"
                                          pattern="[0-9]*"
                                          className="w-full bg-surface border border-border rounded px-2 py-1.5 text-center text-sm font-bold focus:ring-2 ring-warning/50 outline-none"
                                          value={m.scoreA ?? ''}
                                          onChange={(e) => {
                                            const v = e.target.value;
                                            const n =
                                              v === ''
                                                ? undefined
                                                : Math.max(0, Math.min(11, parseInt(v, 10) || 0));
                                            setScore(ci, mi, 'scoreA', n);
                                          }}
                                          onBlur={(e) => {
                                            if (e.currentTarget.value === '')
                                              setScore(ci, mi, 'scoreA', undefined);
                                          }}
                                        />
                                      </div>
                                    </div>

                                    <div className="relative flex items-center py-1">
                                      <div className="flex-grow border-t border-border" />
                                      <span className="flex-shrink-0 mx-2 text-[10px] font-bold text-text-muted uppercase">
                                        VS
                                      </span>
                                      <div className="flex-grow border-t border-border" />
                                    </div>

                                    <div className="flex items-center justify-between">
                                      <span
                                        className="text-sm font-medium truncate pr-2 w-2/3"
                                        title={teamB_names.join(' & ')}
                                      >
                                        {teamB_names.join(' & ')}
                                      </span>
                                      <div className="w-20">
                                        <input
                                          type="number"
                                          min={0}
                                          max={11}
                                          inputMode="numeric"
                                          pattern="[0-9]*"
                                          className="w-full bg-surface border border-border rounded px-2 py-1.5 text-center text-sm font-bold focus:ring-2 ring-warning/50 outline-none"
                                          value={m.scoreB ?? ''}
                                          onChange={(e) => {
                                            const v = e.target.value;
                                            const n =
                                              v === ''
                                                ? undefined
                                                : Math.max(0, Math.min(11, parseInt(v, 10) || 0));
                                            setScore(ci, mi, 'scoreB', n);
                                          }}
                                          onBlur={(e) => {
                                            if (e.currentTarget.value === '')
                                              setScore(ci, mi, 'scoreB', undefined);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 text-sm font-bold text-success uppercase tracking-wider mb-3">
                            <ClipboardList className="h-4 w-4" /> Court Standings
                          </div>
                          <div className="overflow-x-auto rounded-lg border border-border">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-left text-xs text-text-muted bg-surface-alt">
                                  <th className="p-3 font-bold">Place</th>
                                  <th className="p-3 font-bold">Player</th>
                                  <th className="p-3 font-bold">W-L</th>
                                  <th className="p-3 font-bold">Diff</th>
                                </tr>
                              </thead>
                              <tbody>
                                {playerRankings
                                  .filter((player) => player.courtIndex === ci)
                                  .map((player) => {
                                    const wins = player.wins ?? 0;
                                    const losses = Math.max(0, 3 - wins);
                                    const diff = `${player.pointDifferential >= 0 ? '+' : ''}${
                                      player.pointDifferential
                                    }`;
                                    return (
                                      <tr
                                        key={player.seed}
                                        className="border-b border-border last:border-0 hover:bg-surface-highlight/20"
                                      >
                                        <td className="p-3 font-bold text-text-main">
                                          {player.courtPlace ? ordinal(player.courtPlace) : '-'}
                                        </td>
                                        <td className="p-3 text-text-main font-medium truncate max-w-[150px]">
                                          {player.name}
                                        </td>
                                        <td className="p-3 text-text-muted">{`${player.wins}-${losses}`}</td>
                                        <td
                                          className={`p-3 font-bold ${
                                            (player.pointDifferential ?? 0) > 0
                                              ? 'text-success'
                                              : (player.pointDifferential ?? 0) < 0
                                              ? 'text-error'
                                              : 'text-text-muted'
                                          }`}
                                        >
                                          {diff}
                                        </td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}

              <div className="sticky bottom-4 z-10">
                {duplicateError && (
                  <div className="bg-error/10 border border-error/20 text-error text-sm p-3 rounded-lg mb-3 text-center animate-in slide-in-from-bottom-2 shadow-lg backdrop-blur-md">
                    {duplicateError}
                  </div>
                )}
                {round < 3 && (
                  <div className="flex gap-4 p-4 bg-surface/80 backdrop-blur-md border border-border rounded-2xl shadow-xl">
                    <Button
                      onClick={() => {
                        advanceToNextRound();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      variant="primary"
                      size="lg"
                      className={nextButtonClass}
                      disabled={nextDisabled}
                    >
                      Next Round
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

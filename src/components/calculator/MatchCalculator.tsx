import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Combobox } from '@headlessui/react';
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
import { rules } from '../../data/rules';
import RankBadge from '../ui/RankBadge';
import TierPill from '../ui/TierPill';
import { useLocalStorageState } from '../../hooks/useLocalStorage';

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

type PlayerSlot = {
  name: string;
  seed: number;
  courtIndex: number;
};

type MatchScore = {
  a: number | null;
  b: number | null;
};

type CourtState = {
  players: PlayerSlot[]; // P1..P4
  matches: MatchScore[]; // 3 matches
  label?: string;
};

type PlayerStats = {
  name: string;
  seed: number;
  courtIndex: number;
  courtPlace?: number;
  wins: number;
  pointsFor: number;
  pointsAgainst: number;
  diff: number;
  nextCourt?: number;
  nextDivision?: string;
  division?: string;
  tierId?: number;
  nextTierId?: number;
  predictedTierId?: number;
  predictedRange?: string;
  prevRangeLabel?: string;
  prevRangeMin?: number;
  prevRangeMax?: number;
  pointsEarned?: number;
};

/* -------------------------- Small helpers ------------------------- */

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

const divisionLetter = (idx: number) => String.fromCharCode('A'.charCodeAt(0) + idx);

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

const defaultEmptyPlayer = (seed: number, courtIndex: number): PlayerSlot => ({
  name: '',
  seed,
  courtIndex,
});

/* --------------------------- Demo roster -------------------------- */
/* Keep this local so the combobox remains snappy in demos */
const demoRoster = Array.from({ length: 32 }).map((_, i) => `Player ${i + 1}`);

/* ------------------------ Player Combobox ------------------------- */

const PlayerCombobox = React.memo(function PlayerCombobox({
  value,
  seed,
  placeholder,
  onSelect,
}: {
  value: string;
  seed: number;
  placeholder?: string;
  onSelect: (v: string | null) => void;
}) {
  const [inputValue, setInputValue] = useState<string>(value ?? '');
  const [suggests, setSuggests] = useState<string[]>([]);
  const debounceRef = React.useRef<number | null>(null);

  useEffect(() => {
    setInputValue(value ?? '');
  }, [value]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, []);

  function persistValueImmediate(v: string) {
    const normalized = v?.trim() ?? '';
    onSelect(normalized ? normalized : null);
    setSuggests([]);
  }

  function schedulePersist(v: string, delay = 250) {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      persistValueImmediate(v);
      debounceRef.current = null;
    }, delay);
  }

  return (
    <Combobox
      value={value}
      onChange={(v: string | null) => {
        if (debounceRef.current) {
          window.clearTimeout(debounceRef.current);
          debounceRef.current = null;
        }
        onSelect(v);
        setSuggests([]);
      }}
    >
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full px-3 py-2 rounded bg-surface border border-border text-text-main"
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const v = e.target.value;
            setInputValue(v);
            setSuggests(demoRoster.filter((d) => d.toLowerCase().includes(v.toLowerCase())));
            schedulePersist(v);
          }}
          onBlur={() => {
            if (debounceRef.current) window.clearTimeout(debounceRef.current);
            persistValueImmediate(inputValue);
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' || e.key === 'Tab') {
              if (debounceRef.current) window.clearTimeout(debounceRef.current);
              persistValueImmediate(inputValue);
            }
          }}
          placeholder={placeholder}
        />
        {suggests.length > 0 && (
          <Combobox.Options className="absolute mt-1 w-full bg-surface border border-border rounded-md shadow-lg max-h-56 overflow-auto z-10">
            {suggests.map((name) => (
              <Combobox.Option
                key={name}
                value={name}
                className={({ active }) =>
                  `px-3 py-2 cursor-pointer ${active ? 'bg-surface-highlight' : ''}`
                }
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{name}</span>
                  <span className="text-xs text-text-muted">seed {seed}</span>
                </div>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
});
PlayerCombobox.displayName = 'PlayerCombobox';

/* --------------------- Seed layout & division helpers --------------------- */

/**
 * Keep the original seed layout logic intact (mirrors previous behavior).
 * This function purposefully mirrors existing mapping for 12/16 player special cases.
 */
function getSeedLayout(playerCount: number, round: number): number[][] {
  if (playerCount === 16) {
    if (round === 1)
      return [
        [1, 8, 9, 16],
        [2, 7, 10, 15],
        [3, 6, 11, 14],
        [4, 5, 12, 13],
      ];
    if (round === 2)
      return [
        [1, 4, 5, 8],
        [2, 3, 6, 7],
        [9, 12, 13, 16],
        [10, 11, 14, 15],
      ];
    return [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 16],
    ];
  }

  if (playerCount === 12) {
    if (round === 1 || round === 2)
      return [
        [1, 6, 7, 12],
        [2, 5, 8, 11],
        [3, 4, 9, 10],
        [0, 0, 0, 0],
      ];
    return [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [0, 0, 0, 0],
    ];
  }

  const count = Math.min(4, Math.ceil(playerCount / 4));
  const layout: number[][] = [];
  for (let ci = 0; ci < count; ci++) {
    const base = ci * 4 + 1;
    layout.push(range(4).map((i) => base + i));
  }
  return layout;
}

/* ------------------------ Main component -------------------------- */

export default function MatchCalculator(): React.ReactElement {
  // --- Persistent state with localStorage defaults ---
  const [playersCount, setPlayersCount] = useLocalStorageState<number>(
    'paddleup_calc_playersCount',
    16,
  );

  const courtCount = useMemo(() => Math.min(4, Math.ceil(playersCount / 4)), [playersCount]);

  const [courts, setCourts, removeCourts] = useLocalStorageState<CourtState[]>(
    'paddleup_calc_courts',
    () => {
      const layout = getSeedLayout(playersCount, 1);
      const localCourtCount = Math.min(4, Math.ceil(playersCount / 4));
      return range(localCourtCount).map((ci) => {
        const seeds = layout[ci] || [];
        const players = range(4).map((i) =>
          seeds[i]
            ? { name: '', seed: seeds[i], courtIndex: ci }
            : defaultEmptyPlayer(10000 + ci * 4 + i, ci),
        );
        return {
          players,
          matches: [
            { a: null, b: null },
            { a: null, b: null },
            { a: null, b: null },
          ],
          label: `Court ${ci + 1} - Round 1`,
        };
      });
    },
  );

  const [round, setRound, removeRound] = useLocalStorageState<number>('paddleup_calc_round', 1);

  const [results, setResults] = useState<PlayerStats[] | null>(null);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [, setSnapshots] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<number | 'rankings'>(0);
  const [copyFeedback, setCopyFeedback] = useState(false);

  /* ---------------------- Utility: set name / score ---------------------- */

  const setPlayerName = useCallback(
    (courtIdx: number, slotIdx: number, name: string | null) => {
      const nm = (name ?? '').toString();
      const used = new Set<string>();
      courts.forEach((c, ci) =>
        c.players.forEach((p, pi) => {
          if (ci === courtIdx && pi === slotIdx) return;
          if (p && p.name) used.add(p.name);
        }),
      );

      if (!nm || !used.has(nm) || courts[courtIdx].players[slotIdx]?.name === nm) {
        setDuplicateError(null);
        setCourts((prev) =>
          prev.map((c, ci) =>
            ci !== courtIdx
              ? c
              : {
                  ...c,
                  players: c.players.map((p, pi) => (pi === slotIdx ? { ...p, name: nm } : p)),
                },
          ),
        );
      } else {
        setDuplicateError(`${nm} is already selected in another slot`);
      }
    },
    [courts],
  );

  const setScore = useCallback(
    (courtIdx: number, matchIdx: number, team: 'a' | 'b', value: number | null) => {
      setCourts((prev) =>
        prev.map((c, ci) =>
          ci !== courtIdx
            ? c
            : {
                ...c,
                matches: c.matches.map((m, mi) => (mi === matchIdx ? { ...m, [team]: value } : m)),
              },
        ),
      );
    },
    [],
  );

  /* ------------------------ Core computation ------------------------ */

  const computeStandingsReturningStats = useCallback((): PlayerStats[] => {
    // 1) init stats
    const stats: PlayerStats[] = [];
    courts.forEach((court, ci) => {
      court.players.forEach((p) =>
        stats.push({
          name: p.name || '-',
          seed: p.seed,
          courtIndex: ci,
          wins: 0,
          pointsFor: 0,
          pointsAgainst: 0,
          diff: 0,
        }),
      );
    });

    const statFor = (courtIndex: number, playerIndex: number) =>
      stats.find((s) => s.seed === courts[courtIndex].players[playerIndex].seed)!;

    // 2) apply matches
    courts.forEach((court, ci) => {
      const matchDefs = [
        { teamA: [0, 1], teamB: [2, 3], score: court.matches[0] },
        { teamA: [0, 2], teamB: [1, 3], score: court.matches[1] },
        { teamA: [0, 3], teamB: [1, 2], score: court.matches[2] },
      ];

      matchDefs.forEach((md) => {
        const s = md.score;
        if (s.a == null || s.b == null) return;
        md.teamA.forEach((pi) => {
          const st = statFor(ci, pi);
          st.pointsFor += s.a!;
          st.pointsAgainst += s.b!;
        });
        md.teamB.forEach((pi) => {
          const st = statFor(ci, pi);
          st.pointsFor += s.b!;
          st.pointsAgainst += s.a!;
        });
        if (s.a > s.b) {
          md.teamA.forEach((pi) => (statFor(ci, pi).wins += 1));
        } else if (s.b > s.a) {
          md.teamB.forEach((pi) => (statFor(ci, pi).wins += 1));
        }
      });
    });

    // 3) diffs
    stats.forEach((s) => (s.diff = s.pointsFor - s.pointsAgainst));

    // 4) division assignment for current and next round
    const divisionsCount = (function getDivisionsCount(playerCount: number, r: number) {
      const courtCountLocal = Math.min(4, Math.ceil(playerCount / 4));
      if (r === 1) return courtCountLocal;
      if (playerCount === 16) return r === 2 ? 2 : 4;
      if (playerCount === 12) return r === 2 ? 1 : 3;
      if (r === 2) return Math.min(2, Math.max(1, Math.floor(playerCount / 8)));
      return Math.min(4, Math.max(1, Math.floor(playerCount / 4)));
    })(playersCount, round);

    const mapCourtsToDivisions = (count: number) => {
      const map: Record<number, string> = {};
      if (count <= 1) {
        range(courtCount).forEach((ci) => (map[ci] = 'A'));
        return map;
      }
      let d = 0;
      let assigned = 0;
      const courtsPerDivision = Math.max(1, Math.floor(courtCount / count));
      for (let ci = 0; ci < courtCount; ci++) {
        map[ci] = divisionLetter(d);
        assigned++;
        const remainingCourts = courtCount - (ci + 1);
        const remainingDivisions = count - (d + 1);
        if (assigned >= courtsPerDivision && remainingCourts >= remainingDivisions) {
          d++;
          assigned = 0;
        }
      }
      return map;
    };

    const courtToDivision = mapCourtsToDivisions(divisionsCount);
    const nextRound = Math.min(3, round + 1);
    const courtToDivisionNext = mapCourtsToDivisions(
      (function () {
        // reuse the same helper used previously
        const c = (function getDivisionsCount(playerCount: number, r: number) {
          const courtCountLocal = Math.min(4, Math.ceil(playerCount / 4));
          if (r === 1) return courtCountLocal;
          if (playerCount === 16) return r === 2 ? 2 : 4;
          if (playerCount === 12) return r === 2 ? 1 : 3;
          if (r === 2) return Math.min(2, Math.max(1, Math.floor(playerCount / 8)));
          return Math.min(4, Math.max(1, Math.floor(playerCount / 4)));
        })(playersCount, nextRound);
        return c;
      })(),
    );

    // 5) per-court sorting & tier id
    range(courtCount).forEach((ci) => {
      const courtStats = stats.filter((s) => s.courtIndex === ci);
      courtStats.sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        if (b.diff !== a.diff) return b.diff - a.diff;
        return a.seed - b.seed;
      });
      courtStats.forEach((s, idx) => {
        s.courtPlace = idx + 1;
        s.division = courtToDivision[ci];
        s.tierId = s.division ? s.division.charCodeAt(0) - 65 : 0;
      });
    });

    // 6) global ranking and next court assignment
    const globalSorted = [...stats].sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.diff !== a.diff) return b.diff - a.diff;
      return a.seed - b.seed;
    });

    const layoutNext = getSeedLayout(playersCount, nextRound);
    const seedToNextCourt: Record<number, number> = {};
    layoutNext.forEach((seeds, ci) =>
      (seeds || []).forEach((s) => s && s > 0 && (seedToNextCourt[s] = ci + 1)),
    );

    const noScoresEntered = stats.every(
      (x) => (x.wins ?? 0) === 0 && (x.pointsFor ?? 0) === 0 && (x.pointsAgainst ?? 0) === 0,
    );

    globalSorted.forEach((s, idx) => {
      const newSeed = idx + 1;
      const stat = stats.find((x) => x.seed === s.seed)!;
      const nextCourtByRank = seedToNextCourt[newSeed];
      const nextCourtBySeed = seedToNextCourt[stat.seed];
      const nextCourt = noScoresEntered && round === 1 ? nextCourtBySeed : nextCourtByRank;
      stat.nextCourt = nextCourt;
      // prev-range labeling
      if (round === 1) {
        if (playersCount === 16) {
          if (stat.seed <= 8) {
            stat.prevRangeLabel = 'Tier A-B';
            stat.prevRangeMin = 0;
            stat.prevRangeMax = 1;
          } else {
            stat.prevRangeLabel = 'Tier C-D';
            stat.prevRangeMin = 2;
            stat.prevRangeMax = 3;
          }
        } else if (playersCount === 12) {
          stat.prevRangeLabel = 'Tier A-C';
          stat.prevRangeMin = 0;
          stat.prevRangeMax = 2;
        } else {
          stat.prevRangeLabel = `Tier ${divisionLetter(0)}–${divisionLetter(
            Math.max(0, divisionsCount - 1),
          )}`;
          stat.prevRangeMin = 0;
          stat.prevRangeMax = Math.max(0, divisionsCount - 1);
        }
        if (noScoresEntered && round === 1) stat.predictedRange = stat.prevRangeLabel;
      } else {
        stat.prevRangeMin = stat.tierId ?? 0;
        stat.prevRangeMax = stat.tierId ?? 0;
        stat.prevRangeLabel = `Tier ${divisionLetter(stat.prevRangeMin)}`;
      }

      if (typeof stat.nextCourt === 'number') {
        stat.nextDivision = courtToDivisionNext[(stat.nextCourt || 1) - 1] ?? 'A';
        stat.nextTierId = stat.nextDivision ? stat.nextDivision.charCodeAt(0) - 65 : undefined;
      } else {
        stat.nextDivision = undefined;
        stat.nextTierId = undefined;
      }
    });

    // 7) points earned
    try {
      const pts = rules.points;
      stats.forEach((s) => {
        const place = s.courtPlace ?? 0;
        const tableKey =
          s.courtIndex === 0
            ? 'championship'
            : s.courtIndex === 1
            ? 'court2'
            : s.courtIndex === 2
            ? 'court3'
            : 'court4';
        s.pointsEarned = (pts as any)?.[tableKey]?.[place] ?? 0;
      });
    } catch {
      // noop
    }

    // 8) final sort for UI (by division -> place -> wins -> diff -> seed)
    stats.sort((a, b) => {
      const da = a.division ?? 'Z';
      const db = b.division ?? 'Z';
      if (da !== db) return da < db ? -1 : 1;
      if ((a.courtPlace ?? 99) !== (b.courtPlace ?? 99))
        return (a.courtPlace ?? 99) - (b.courtPlace ?? 99);
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.diff !== a.diff) return b.diff - a.diff;
      return a.seed - b.seed;
    });

    return stats;
  }, [courts, playersCount, round, courtCount]);

  const computeStandings = useCallback(() => {
    setResults(computeStandingsReturningStats());
  }, [computeStandingsReturningStats]);

  useEffect(() => {
    computeStandings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courts, round]);

  /* ------------------------ Apply layouts / navigation ------------------------ */

  const applySeedLayoutForRound = useCallback(
    (targetRound: number, playerCountOverride?: number) => {
      const pc = playerCountOverride ?? playersCount;
      const layout = getSeedLayout(pc, targetRound);
      const localCourtCount = Math.min(4, Math.ceil(pc / 4));
      setCourts((prev) => {
        const nameBySeed = new Map<number, string>();
        prev.forEach((c) => c.players.forEach((p) => p.name && nameBySeed.set(p.seed, p.name)));
        return range(localCourtCount).map((ci) => {
          const seeds = layout[ci] || [];
          const players = range(4).map((i) => {
            const seed = seeds[i] || 10000 + ci * 4 + i;
            return { name: nameBySeed.get(seed) ?? '', seed, courtIndex: ci };
          });
          return {
            players,
            matches: [
              { a: null, b: null },
              { a: null, b: null },
              { a: null, b: null },
            ],
            label: `Court ${ci + 1} - Round ${targetRound}`,
          };
        });
      });
    },
    [playersCount],
  );

  const advanceToNextRound = useCallback(() => {
    const stats = computeStandingsReturningStats();
    setSnapshots((prev) => [...prev, { round, results: stats, courts }]);
    const nextRound = Math.min(3, round + 1);
    applySeedLayoutForRound(nextRound);
    setRound(nextRound);
  }, [computeStandingsReturningStats, courts, round, applySeedLayoutForRound]);

  const resetAll = useCallback(() => {
    if (!window.confirm('Are you sure you want to clear all data and start over?')) return;
    try {
      removeCourts();
    } catch {
      // ignore
    }
    try {
      removeRound();
    } catch {
      // ignore
    }
    const layout = getSeedLayout(playersCount, 1);
    const localCourtCount = Math.min(4, Math.ceil(playersCount / 4));
    const newCourts = range(localCourtCount).map((ci) => {
      const seeds = layout[ci] || [];
      const players = range(4).map((i) => {
        const seed = seeds[i] || 10000 + ci * 4 + i;
        return { name: '', seed, courtIndex: ci };
      });
      return {
        players,
        matches: [
          { a: null, b: null },
          { a: null, b: null },
          { a: null, b: null },
        ],
        label: `Court ${ci + 1} - Round 1`,
      };
    });
    setCourts(newCourts);
    setResults(null);
    setDuplicateError(null);
    setSnapshots([]);
    setRound(1);
  }, [playersCount, removeCourts, removeRound]);

  /* ------------------------ Clipboard helper ------------------------ */

  const copyRankingsToClipboard = useCallback(() => {
    if (!results) return;
    const lines = results.map((r, idx) => {
      const next = r.nextCourt
        ? `Court ${r.nextCourt} (Div ${r.nextDivision ?? r.division ?? 'A'})`
        : '-';
      return `${idx + 1}. ${r.name} -> ${next}`;
    });
    const text = `Round ${round} Rankings:\n${lines.join('\n')}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  }, [results, round]);

  /* ------------------------ Derived values ------------------------ */

  const totalMatches = courts.length * 3;
  const completedMatches = courts.reduce(
    (acc, c) => acc + c.matches.filter((m) => m.a !== null && m.b !== null).length,
    0,
  );
  const progressPercent = Math.round((completedMatches / Math.max(1, totalMatches)) * 100);

  /* ------------------------ Movement icon helper ------------------------ */

  const movementIconFor = useCallback((r: PlayerStats) => {
    const prevMin = r.prevRangeMin;
    const prevMax = r.prevRangeMax;
    const nextT = r.nextTierId;
    let icon: React.ReactNode = null;
    if (typeof prevMin === 'number' && typeof prevMax === 'number' && prevMin !== prevMax) {
      if (typeof nextT === 'number') {
        if (nextT < prevMin) icon = <ArrowUp className="mx-1 h-4 w-4 text-success" />;
        else if (nextT > prevMax) icon = <ArrowDown className="mx-1 h-4 w-4 text-error" />;
        else if (nextT === prevMin) icon = <ArrowUp className="mx-1 h-4 w-4 text-success" />;
        else if (nextT === prevMax) icon = <ArrowDown className="mx-1 h-4 w-4 text-error" />;
      }
    } else if (typeof r.tierId === 'number' && typeof nextT === 'number') {
      if (nextT < r.tierId) icon = <ArrowUp className="mx-1 h-4 w-4 text-success" />;
      else if (nextT > r.tierId) icon = <ArrowDown className="mx-1 h-4 w-4 text-error" />;
    }
    return icon ? <span className="inline-flex items-center">{icon}</span> : null;
  }, []);

  /* ------------------------ Render ------------------------ */

  return (
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
                      setRound(r);
                      applySeedLayoutForRound(r);
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
                {courts.map((_, ci) => (
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
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        activeView === ci
                          ? 'bg-white/20 text-white'
                          : 'bg-surface-highlight text-text-muted'
                      }`}
                    >
                      {results?.find((r) => r.courtIndex === ci)?.division ?? 'A'}
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
              {courts.map((_, ci) => (
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
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      activeView === ci
                        ? 'bg-primary/20 text-primary'
                        : 'bg-surface-alt text-text-muted group-hover:bg-surface-alt/80'
                    }`}
                  >
                    Div {results?.find((r) => r.courtIndex === ci)?.division ?? 'A'}
                  </span>
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
                {playersCount} Players • {courtCount} Courts
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => {
                    if (
                      !window.confirm(
                        'Switching player count will reset the current round. Continue?',
                      )
                    )
                      return;
                    const newCount = playersCount === 16 ? 12 : 16;
                    setPlayersCount(newCount);
                    applySeedLayoutForRound(1, newCount);
                    setRound(1);
                  }}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                >
                  Switch to {playersCount === 16 ? '12' : '16'} Players
                </Button>
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
                        <th className="py-3 pl-6">Rank</th>
                        <th className="py-3">Player</th>
                        {round === 3 && <th className="py-3">Pts</th>}
                        <th className="py-3">{round === 3 ? 'Final Rank' : 'Next Assignment'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results && results.length ? (
                        results.map((r, idx) => {
                          const ptsDisplay =
                            typeof r.pointsEarned === 'number' ? r.pointsEarned : '-';
                          const nextAssignment = r.nextCourt
                            ? {
                                court: r.nextCourt,
                                spot: r.courtPlace ?? '-',
                                division: r.nextDivision ?? r.division ?? 'A',
                                tierId: typeof r.nextTierId === 'number' ? r.nextTierId : r.tierId,
                              }
                            : null;

                          return (
                            <tr
                              key={r.seed}
                              className="border-b border-border last:border-0 hover:bg-surface-highlight/50 transition-colors"
                            >
                              <td className="py-4 pl-6 text-text-main font-bold">{idx + 1}</td>
                              <td className="py-4 text-text-main font-medium">{r.name}</td>
                              {round === 3 ? (
                                <td className="py-4 text-text-main font-medium">{ptsDisplay}</td>
                              ) : null}
                              <td className="py-4 text-text-muted text-sm">
                                {round === 3 ? (
                                  <div className="flex items-center gap-3 whitespace-nowrap">
                                    <RankBadge rank={idx + 1} size="md" />
                                    <span className="text-text-main font-medium truncate mr-2">{`${ordinal(
                                      idx + 1,
                                    )}`}</span>
                                  </div>
                                ) : nextAssignment ? (
                                  <div className="flex items-center gap-2 whitespace-nowrap">
                                    {movementIconFor(r)}
                                    <span className="px-2 py-0.5 rounded text-xs">
                                      <TierPill
                                        tierId={(() => {
                                          const t = r.nextTierId ?? r.tierId;
                                          return typeof t === 'number'
                                            ? String.fromCharCode(65 + t)
                                            : t ?? '';
                                        })()}
                                        size="xs"
                                        label={(() => {
                                          if (
                                            typeof r.predictedRange === 'string' &&
                                            /Tier\s*[A-Z].*[-–—].*[A-Z]/i.test(r.predictedRange)
                                          ) {
                                            return r.predictedRange
                                              .replace(/^Tier\s*/i, '')
                                              .replace('–', '-')
                                              .replace('—', '-');
                                          }
                                          if (
                                            r.prevRangeLabel &&
                                            typeof r.prevRangeLabel === 'string'
                                          ) {
                                            const pr = r.prevRangeLabel
                                              .replace(/^Tier\s*/i, '')
                                              .replace('–', '-')
                                              .replace('—', '-');
                                            if (pr.includes('-')) return pr;
                                          }
                                          return undefined;
                                        })()}
                                      />
                                    </span>
                                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-primary text-white ml-2">{`Court ${nextAssignment.court}`}</span>
                                    <span className="px-2 py-0.5 rounded text-xs bg-surface text-text-muted ml-2">{`S${nextAssignment.spot}`}</span>
                                  </div>
                                ) : (
                                  <span className="text-text-muted">-</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={round === 3 ? 4 : 3}
                            className="py-12 text-center text-text-muted"
                          >
                            Enter scores in court views to generate rankings
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              courts.map((court, ci) => {
                if (ci !== activeView) return null;
                const division = results?.find((r) => r.courtIndex === ci)?.division ?? 'A';
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
                            Division {division} • Round {round}
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
                          {court.players.map((p, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 bg-surface-alt/30 p-2 rounded-lg border border-transparent focus-within:border-primary/30 transition-colors"
                            >
                              <div className="w-8 text-xs text-text-muted font-mono font-bold">
                                P{i + 1}
                              </div>
                              <div className="flex-1">
                                <PlayerCombobox
                                  value={p.name}
                                  seed={p.seed}
                                  placeholder={`Select Player ${i + 1}`}
                                  onSelect={(val) => setPlayerName(ci, i, val)}
                                />
                              </div>
                              <div className="text-right text-xs text-text-muted bg-surface px-2 py-1 rounded">
                                Seed {p.seed}
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
                            const p1 = court.players[0].name || 'P1';
                            const p2 = court.players[1].name || 'P2';
                            const p3 = court.players[2].name || 'P3';
                            const p4 = court.players[3].name || 'P4';
                            const teamA_names =
                              mi === 0 ? [p1, p2] : mi === 1 ? [p1, p3] : [p1, p4];
                            const teamB_names =
                              mi === 0 ? [p3, p4] : mi === 1 ? [p2, p4] : [p2, p3];
                            const isComplete = m.a !== null && m.b !== null;

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
                                        value={m.a ?? ''}
                                        onChange={(e) => {
                                          const v = e.target.value;
                                          const n =
                                            v === ''
                                              ? null
                                              : Math.max(0, Math.min(11, parseInt(v, 10) || 0));
                                          setScore(ci, mi, 'a', n);
                                        }}
                                        onBlur={(e) => {
                                          if (e.currentTarget.value === '')
                                            setScore(ci, mi, 'a', null);
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
                                        value={m.b ?? ''}
                                        onChange={(e) => {
                                          const v = e.target.value;
                                          const n =
                                            v === ''
                                              ? null
                                              : Math.max(0, Math.min(11, parseInt(v, 10) || 0));
                                          setScore(ci, mi, 'b', n);
                                        }}
                                        onBlur={(e) => {
                                          if (e.currentTarget.value === '')
                                            setScore(ci, mi, 'b', null);
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
                                <th className="p-3 font-bold">Pts</th>
                              </tr>
                            </thead>
                            <tbody>
                              {results
                                ? results
                                    .filter((r) => r.courtIndex === ci)
                                    .sort((a, b) => (a.courtPlace ?? 0) - (b.courtPlace ?? 0))
                                    .map((r) => {
                                      const wins = r.wins ?? 0;
                                      const losses = Math.max(0, 3 - wins);
                                      const diff = (r.diff ?? 0) >= 0 ? `+${r.diff}` : `${r.diff}`;
                                      return (
                                        <tr
                                          key={r.seed}
                                          className="border-b border-border last:border-0 hover:bg-surface-highlight/20"
                                        >
                                          <td className="p-3 font-bold text-text-main">
                                            {r.courtPlace ? ordinal(r.courtPlace) : '-'}
                                          </td>
                                          <td className="p-3 text-text-main font-medium truncate max-w-[150px]">
                                            {r.name}
                                          </td>
                                          <td className="p-3 text-text-muted">{`${wins}-${losses}`}</td>
                                          <td
                                            className={`p-3 font-bold ${
                                              (r.diff ?? 0) > 0
                                                ? 'text-success'
                                                : (r.diff ?? 0) < 0
                                                ? 'text-error'
                                                : 'text-text-muted'
                                            }`}
                                          >
                                            {diff}
                                          </td>
                                          <td className="p-3 text-text-muted">{r.pointsFor}</td>
                                        </tr>
                                      );
                                    })
                                : range(4).map((idx) => (
                                    <tr key={idx} className="border-b border-border last:border-0">
                                      <td className="p-3 text-text-muted">-</td>
                                      <td className="p-3 text-text-muted">Player {idx + 1}</td>
                                      <td className="p-3 text-text-muted">-</td>
                                      <td className="p-3 text-text-muted">-</td>
                                      <td className="p-3 text-text-muted">-</td>
                                    </tr>
                                  ))}
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
              <div className="flex gap-4 p-4 bg-surface/80 backdrop-blur-md border border-border rounded-2xl shadow-xl">
                <Button
                  onClick={() => {
                    computeStandings();
                    advanceToNextRound();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  variant="primary"
                  size="lg"
                  className="w-full bg-success text-white hover:bg-success/90 shadow-lg shadow-success/20"
                >
                  Next Round
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

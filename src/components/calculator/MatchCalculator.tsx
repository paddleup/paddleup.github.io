import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Combobox, Listbox, Tab } from '@headlessui/react';
import {
  ChevronDown,
  Users,
  Trophy,
  ClipboardList,
  LayoutGrid,
  Activity,
  Save,
  CheckCircle2,
  Copy,
  Trash2,
} from 'lucide-react';

/**
 * Headless UI + Tailwind redesign of Match Calculator
 *
 * Notes:
 * - Uses Headless UI Combobox for player selection (searchable)
 * - Uses Headless UI Listbox for score selection (0-11)
 * - Keeps existing scoring / ranking logic intact
 * - Mobile-first layout but clearer interactive controls
 *
 * If @headlessui/react isn't installed, run:
 *   npm install @headlessui/react
 */

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
  division?: string;
};

type Snapshot = {
  round: number;
  results: PlayerStats[];
  courts: CourtState[];
};

const defaultEmptyPlayer = (seed: number, courtIndex: number): PlayerSlot => ({
  name: '',
  seed,
  courtIndex,
});

const scoreOptions = Array.from({ length: 12 }).map((_, i) => i);

function range(n: number) {
  return Array.from({ length: n }, (_, i) => i);
}

function divisionLetter(idx: number) {
  return String.fromCharCode('A'.charCodeAt(0) + idx);
}

function ordinal(n: number) {
  const s = String(n);
  if (!n || isNaN(n)) return `${s}`;
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
}

function getDivisionsCount(playerCount: number, round: number) {
  if (playerCount === 16) {
    if (round === 1) return 1;
    if (round === 2) return 2;
    return 4;
  }
  if (playerCount === 12) {
    if (round === 1) return 1;
    if (round === 2) return 1;
    return 3;
  }
  if (round === 1) return 1;
  if (round === 2) return Math.min(2, Math.max(1, Math.floor(playerCount / 8)));
  return Math.min(4, Math.max(1, Math.floor(playerCount / 4)));
}

function getSeedLayout(playerCount: number, round: number): number[][] {
  if (playerCount === 16) {
    if (round === 1) {
      return [
        [1, 8, 9, 16],
        [2, 7, 10, 15],
        [3, 6, 11, 14],
        [4, 5, 12, 13],
      ];
    }
    if (round === 2) {
      return [
        [1, 4, 5, 8],
        [2, 3, 6, 7],
        [9, 12, 13, 16],
        [10, 11, 14, 15],
      ];
    }
    return [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 16],
    ];
  }

  if (playerCount === 12) {
    if (round === 1) {
      return [
        [1, 6, 7, 12],
        [2, 5, 8, 11],
        [3, 4, 9, 10],
        [0, 0, 0, 0],
      ];
    }
    if (round === 2) {
      return [
        [1, 6, 7, 12],
        [2, 5, 8, 11],
        [3, 4, 9, 10],
        [0, 0, 0, 0],
      ];
    }
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

/* Demo roster used by the combobox. Swap with real roster import if available */
const demoRoster = Array.from({ length: 32 }).map((_, i) => `Player ${i + 1}`);

/**
 * Memoized player Combobox to keep typing fluid.
 */
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
  const [, startTransition] = React.useTransition();
  const debounceRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setInputValue(value ?? '');
  }, [value]);

  React.useEffect(() => {
    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, []);

  function persistValueImmediate(v: string) {
    const normalized = v?.trim() ?? '';
    onSelect(normalized ? normalized : null);
    setSuggests([]);
  }

  function schedulePersist(v: string, delay = 300) {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }
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
            startTransition(() => {
              setSuggests(demoRoster.filter((d) => d.toLowerCase().includes(v.toLowerCase())));
            });
            schedulePersist(v, 250);
          }}
          onBlur={() => {
            if (debounceRef.current) {
              window.clearTimeout(debounceRef.current);
              debounceRef.current = null;
            }
            persistValueImmediate(inputValue);
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (debounceRef.current) {
                window.clearTimeout(debounceRef.current);
                debounceRef.current = null;
              }
              persistValueImmediate(inputValue);
            } else if (e.key === 'Tab') {
              if (debounceRef.current) {
                window.clearTimeout(debounceRef.current);
                debounceRef.current = null;
              }
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

export default function MatchCalculator(): React.ReactElement {
  // --- State Initialization with LocalStorage ---
  const [playersCount, setPlayersCount] = useState<number>(() => {
    const saved = localStorage.getItem('paddleup_calc_playersCount');
    return saved ? parseInt(saved, 10) : 16;
  });

  const courtCount = Math.min(4, Math.ceil(playersCount / 4));

  const [courts, setCourts] = useState<CourtState[]>(() => {
    const saved = localStorage.getItem('paddleup_calc_courts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved courts', e);
      }
    }
    const layout = getSeedLayout(playersCount, 1);
    return range(courtCount).map((ci) => {
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
  });

  const [round, setRound] = useState<number>(() => {
    const saved = localStorage.getItem('paddleup_calc_round');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [results, setResults] = useState<PlayerStats[] | null>(null);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [, setSnapshots] = useState<Snapshot[]>([]);
  const [activeView, setActiveView] = useState<number | 'rankings'>(0); // 0-based court index or 'rankings'
  const [copyFeedback, setCopyFeedback] = useState(false);

  // --- Persistence Effects ---
  useEffect(() => {
    localStorage.setItem('paddleup_calc_playersCount', playersCount.toString());
  }, [playersCount]);

  useEffect(() => {
    localStorage.setItem('paddleup_calc_round', round.toString());
  }, [round]);

  useEffect(() => {
    localStorage.setItem('paddleup_calc_courts', JSON.stringify(courts));
  }, [courts]);

  useEffect(() => {
    computeStandings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courts, round]);

  // --- Progress Calculation ---
  const totalMatches = courts.length * 3;
  const completedMatches = courts.reduce(
    (acc, c) => acc + c.matches.filter((m) => m.a !== null && m.b !== null).length,
    0,
  );
  const progressPercent = Math.round((completedMatches / totalMatches) * 100);

  function setPlayerName(courtIdx: number, slotIdx: number, name: string | null) {
    try {
      if (!Array.isArray(courts) || courtIdx < 0 || courtIdx >= courts.length) return;
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
    } catch (err) {
      console.error('setPlayerName error', err);
      setDuplicateError('Unexpected error updating player name');
    }
  }

  function setScore(courtIdx: number, matchIdx: number, team: 'a' | 'b', value: number | null) {
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
  }

  function computeStandingsReturningStats(): PlayerStats[] {
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

    function statFor(courtIndex: number, playerIndex: number) {
      const seed = courts[courtIndex].players[playerIndex].seed;
      return stats.find((s) => s.seed === seed)!;
    }

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

    stats.forEach((s) => (s.diff = s.pointsFor - s.pointsAgainst));

    const divisionsCount = getDivisionsCount(playersCount, round);
    const courtToDivision: Record<number, string> = {};
    if (divisionsCount <= 1) {
      range(courtCount).forEach((ci) => (courtToDivision[ci] = 'A'));
    } else {
      let d = 0;
      let assigned = 0;
      const courtsPerDivision = Math.max(1, Math.floor(courtCount / divisionsCount));
      for (let ci = 0; ci < courtCount; ci++) {
        courtToDivision[ci] = divisionLetter(d);
        assigned++;
        const remainingCourts = courtCount - (ci + 1);
        const remainingDivisions = divisionsCount - (d + 1);
        if (assigned >= courtsPerDivision && remainingCourts >= remainingDivisions) {
          d++;
          assigned = 0;
        }
      }
    }

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
      });
    });

    const globalSorted = [...stats].sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.diff !== a.diff) return b.diff - a.diff;
      return a.seed - b.seed;
    });

    const seedToNextCourt: Record<number, number> = {
      1: 1,
      4: 1,
      5: 1,
      8: 1,
      2: 2,
      3: 2,
      6: 2,
      7: 2,
      9: 3,
      12: 3,
      13: 3,
      16: 3,
      10: 4,
      11: 4,
      14: 4,
      15: 4,
    };

    globalSorted.forEach((s, idx) => {
      const newSeed = idx + 1;
      const nextCourt = seedToNextCourt[newSeed] ?? undefined;
      const stat = stats.find((x) => x.seed === s.seed)!;
      stat.nextCourt = nextCourt;
    });

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
  }

  function computeStandings() {
    const stats = computeStandingsReturningStats();
    setResults(stats);
  }

  function applySeedLayoutForRound(targetRound: number, playerCountOverride?: number) {
    const pc = playerCountOverride ?? playersCount;
    const layout = getSeedLayout(pc, targetRound);
    const localCourtCount = Math.min(4, Math.ceil(pc / 4));
    setCourts((prev) => {
      const nameBySeed = new Map<number, string>();
      prev.forEach((c) =>
        c.players.forEach((p) => {
          if (p.name) nameBySeed.set(p.seed, p.name);
        }),
      );

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
  }

  function advanceToNextRound() {
    const stats = computeStandingsReturningStats();
    setSnapshots((prev: Snapshot[]) => [...prev, { round, results: stats, courts }]);

    const nextRound = Math.min(3, round + 1);
    applySeedLayoutForRound(nextRound);

    setRound(nextRound);
  }

  function resetAll() {
    if (!window.confirm('Are you sure you want to clear all data and start over?')) return;
    localStorage.removeItem('paddleup_calc_courts');
    localStorage.removeItem('paddleup_calc_round');
    // We keep playersCount preference

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
  }

  function copyRankingsToClipboard() {
    if (!results) return;
    const lines = results.map((r, idx) => {
      const next = r.nextCourt ? `Court ${r.nextCourt} (Div ${r.division ?? 'A'})` : '-';
      return `${idx + 1}. ${r.name} -> ${next}`;
    });
    const text = `Round ${round} Rankings:\n${lines.join('\n')}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  }

  // loadDemo removed per UI requirements

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
          {/* Sidebar Navigation (Desktop) & Top Nav (Mobile) */}
          <div className="lg:col-span-1 space-y-4 sticky top-4 z-20">
            {/* Round Selector */}
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

            {/* View Selector (Responsive) */}
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

            {/* Desktop Sidebar List */}
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

            {/* Progress & Controls */}
            <div className="hidden lg:block pt-4 space-y-4">
              {/* Progress Bar */}
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

          {/* Main Content Area */}
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
                        <th className="py-3">Next Assignment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results && results.length ? (
                        results.map((r, idx) => {
                          const next = r.nextCourt
                            ? `Court ${r.nextCourt}, Spot ${r.courtPlace ?? '-'}, Div ${
                                r.division ?? 'A'
                              }`
                            : '-';
                          return (
                            <tr
                              key={r.seed}
                              className="border-b border-border last:border-0 hover:bg-surface-highlight/50 transition-colors"
                            >
                              <td className="py-4 pl-6 text-text-main font-bold">{idx + 1}</td>
                              <td className="py-4 text-text-main font-medium">{r.name}</td>
                              <td className="py-4 text-text-muted text-sm">{next}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={3} className="py-12 text-center text-text-muted">
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
                            Division {results?.find((r) => r.courtIndex === ci)?.division ?? 'A'} •
                            Round {round}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-8">
                      {/* Player Input Section */}
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

                      {/* Matches Section */}
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

                            // Match pairings logic
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
                                    {isComplete && <CheckCircle2 className="h-3 w-3" />}
                                    Match {mi + 1}
                                  </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                  {/* Team A */}
                                  <div className="flex items-center justify-between">
                                    <span
                                      className="text-sm font-medium truncate pr-2 w-2/3"
                                      title={teamA_names.join(' & ')}
                                    >
                                      {teamA_names.join(' & ')}
                                    </span>
                                    <div className="w-20">
                                      <Listbox
                                        value={m.a}
                                        onChange={(v) => setScore(ci, mi, 'a', v)}
                                      >
                                        <Listbox.Button className="w-full bg-surface border border-border rounded px-2 py-1.5 text-center text-sm font-bold focus:ring-2 ring-warning/50 outline-none">
                                          {m.a ?? '-'}
                                        </Listbox.Button>
                                        <Listbox.Options className="absolute mt-1 w-20 bg-surface border border-border rounded shadow-lg max-h-40 overflow-auto z-50">
                                          {scoreOptions.map((s) => (
                                            <Listbox.Option
                                              key={s}
                                              value={s}
                                              className={({ active }) =>
                                                `px-2 py-1 text-center cursor-pointer ${
                                                  active ? 'bg-surface-highlight' : ''
                                                }`
                                              }
                                            >
                                              {s}
                                            </Listbox.Option>
                                          ))}
                                        </Listbox.Options>
                                      </Listbox>
                                    </div>
                                  </div>

                                  {/* VS Divider */}
                                  <div className="relative flex items-center py-1">
                                    <div className="flex-grow border-t border-border"></div>
                                    <span className="flex-shrink-0 mx-2 text-[10px] font-bold text-text-muted uppercase">
                                      VS
                                    </span>
                                    <div className="flex-grow border-t border-border"></div>
                                  </div>

                                  {/* Team B */}
                                  <div className="flex items-center justify-between">
                                    <span
                                      className="text-sm font-medium truncate pr-2 w-2/3"
                                      title={teamB_names.join(' & ')}
                                    >
                                      {teamB_names.join(' & ')}
                                    </span>
                                    <div className="w-20">
                                      <Listbox
                                        value={m.b}
                                        onChange={(v) => setScore(ci, mi, 'b', v)}
                                      >
                                        <Listbox.Button className="w-full bg-surface border border-border rounded px-2 py-1.5 text-center text-sm font-bold focus:ring-2 ring-warning/50 outline-none">
                                          {m.b ?? '-'}
                                        </Listbox.Button>
                                        <Listbox.Options className="absolute mt-1 w-20 bg-surface border border-border rounded shadow-lg max-h-40 overflow-auto z-50">
                                          {scoreOptions.map((s) => (
                                            <Listbox.Option
                                              key={s}
                                              value={s}
                                              className={({ active }) =>
                                                `px-2 py-1 text-center cursor-pointer ${
                                                  active ? 'bg-surface-highlight' : ''
                                                }`
                                              }
                                            >
                                              {s}
                                            </Listbox.Option>
                                          ))}
                                        </Listbox.Options>
                                      </Listbox>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Court Results Table */}
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

            {/* Global Actions (Sticky Bottom) */}
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

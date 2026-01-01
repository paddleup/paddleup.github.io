import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Combobox, Listbox, Tab } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';

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
          className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700 text-slate-100"
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
                  <span className="text-xs text-slate-400">seed {seed}</span>
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
  const [playersCount, setPlayersCount] = useState<number>(16);
  const courtCount = Math.min(4, Math.ceil(playersCount / 4));

  const [courts, setCourts] = useState<CourtState[]>(() => {
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
  const [round, setRound] = useState<number>(1);
  const [results, setResults] = useState<PlayerStats[] | null>(null);
  const [duplicateError, setDuplicateError] = useState<string | null>(null);
  const [, setSnapshots] = useState<Snapshot[]>([]);

  useEffect(() => {
    computeStandings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courts, round]);

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
    applySeedLayoutForRound(1);
    setResults(null);
    setDuplicateError(null);
    setSnapshots([]);
    setRound(1);
  }

  // loadDemo removed per UI requirements

  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100 p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        <header className="mb-4 text-center">
          <h1 className="text-3xl sm:text-2xl font-extrabold tracking-tight">Match Calculator</h1>
          <p className="text-sm text-slate-300 mt-1 max-w-prose mx-auto">
            Enter scores to compute round rankings and next courts.
          </p>
          <div className="mt-3 h-0.5 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 rounded" />
        </header>

        <Card className="p-4 mb-4 shadow-lg rounded-lg bg-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <label className="text-sm text-slate-300">Round</label>
              <div className="relative inline-block">
                <Listbox
                  value={round}
                  onChange={(v) => {
                    setRound(v);
                    applySeedLayoutForRound(v);
                  }}
                >
                  <div className="relative">
                    <Listbox.Button className="bg-slate-700 text-slate-100 px-3 py-1 rounded-md border border-slate-700 flex items-center gap-2">
                      <span>Round {round}</span>
                      <ChevronDown className="h-4 w-4 text-slate-300" />
                    </Listbox.Button>
                    <Listbox.Options className="absolute mt-1 w-full bg-surface border border-border rounded-md py-1 text-sm z-50 max-h-40 overflow-auto">
                      {[1, 2, 3].map((r) => (
                        <Listbox.Option
                          key={r}
                          value={r}
                          className={({ active }) =>
                            `px-3 py-1 cursor-pointer ${active ? 'bg-surface-highlight' : ''}`
                          }
                        >
                          {`Round ${r}`}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => {
                  const newCount = playersCount === 16 ? 12 : 16;
                  setPlayersCount(newCount);
                  applySeedLayoutForRound(1, newCount);
                  setRound(1);
                }}
                variant="ghost"
                size="md"
                className="px-4 py-2"
              >
                {playersCount === 16 ? 'Switch to 12 players' : 'Switch to 16 players'}
              </Button>
              <Button
                onClick={resetAll}
                variant="secondary"
                size="md"
                className="px-4 py-2 bg-rose-600 text-white hover:bg-rose-500 shadow-sm"
              >
                Reset
              </Button>
            </div>
          </div>
        </Card>

        <div className="space-y-3">
          <Tab.Group>
            <Tab.List className="overflow-x-auto pb-2">
              <div className="flex gap-2 px-2 py-1 items-stretch bg-slate-900/40 rounded-lg">
                {courts.map((_, ci) => (
                  <Tab
                    key={ci}
                    className={({ selected }) =>
                      `whitespace-nowrap flex-shrink-0 inline-flex items-center gap-2 min-w-[7.5rem] px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm font-medium transition-transform duration-150 ${
                        selected
                          ? 'bg-emerald-600 text-white shadow-md scale-105 ring-2 ring-emerald-300'
                          : 'bg-slate-800 text-slate-200 hover:bg-slate-700/95'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2">
                      <span className="truncate">Court {ci + 1}</span>
                      <span className="inline-flex items-center justify-center bg-slate-700 text-xs text-slate-300 px-2 py-0.5 rounded">
                        {results?.find((r) => r.courtIndex === ci)?.division ?? 'A'}
                      </span>
                    </div>
                  </Tab>
                ))}
              </div>
            </Tab.List>

            <Tab.Panels>
              {courts.map((court, ci) => (
                <Tab.Panel key={ci}>
                  <Card className="p-0 overflow-hidden">
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {court.players.map((p, i) => (
                          <div key={i}>
                            <label className="text-xs text-slate-400">P{i + 1}</label>

                            <PlayerCombobox
                              value={p.name}
                              seed={p.seed}
                              placeholder={`P${i + 1}`}
                              onSelect={(val) => setPlayerName(ci, i, val)}
                            />

                            <div className="text-xs text-slate-400 mt-1">seed {p.seed}</div>
                          </div>
                        ))}
                      </div>

                      <div>
                        <div className="text-sm font-medium text-slate-100 mb-2">Matches</div>
                        <div className="space-y-2">
                          {court.matches.map((m, mi) => {
                            const p1 = court.players[0].name || 'P1';
                            const p2 = court.players[1].name || 'P2';
                            const p3 = court.players[2].name || 'P3';
                            const p4 = court.players[3].name || 'P4';
                            const leftLabel =
                              mi === 0
                                ? `${p1}, ${p2}`
                                : mi === 1
                                ? `${p1}, ${p3}`
                                : `${p1}, ${p4}`;
                            const rightLabel =
                              mi === 0
                                ? `${p3}, ${p4}`
                                : mi === 1
                                ? `${p2}, ${p4}`
                                : `${p2}, ${p3}`;

                            return (
                              <div key={mi} className="flex items-start gap-3">
                                <div className="w-16 flex-shrink-0 text-xs text-slate-400 pt-1">
                                  Match {mi + 1}
                                </div>

                                <div className="flex-1 min-w-0 flex items-center gap-2">
                                  <div className="flex-1 min-w-0">
                                    <Listbox value={m.a} onChange={(v) => setScore(ci, mi, 'a', v)}>
                                      <div className="relative">
                                        <Listbox.Button className="w-full text-left bg-slate-800 rounded border border-slate-700 px-3 py-2 flex items-center justify-between">
                                          <span className="truncate text-sm">
                                            {m.a == null ? leftLabel : String(m.a)}
                                          </span>
                                          <ChevronDown className="h-4 w-4 text-slate-400 ml-2" />
                                        </Listbox.Button>
                                        <Listbox.Options className="absolute left-0 right-0 mt-1 w-full bg-surface border border-border rounded-md py-1 z-50 max-h-52 overflow-auto text-sm">
                                          <Listbox.Option
                                            key={-1}
                                            value={null}
                                            className={({ active }) =>
                                              `px-3 py-2 cursor-pointer ${
                                                active ? 'bg-surface-highlight' : ''
                                              }`
                                            }
                                          >
                                            <span className="text-sm truncate">{leftLabel}</span>
                                          </Listbox.Option>
                                          {scoreOptions.map((s) => (
                                            <Listbox.Option
                                              key={s}
                                              value={s}
                                              className={({ active }) =>
                                                `px-3 py-2 cursor-pointer ${
                                                  active ? 'bg-surface-highlight' : ''
                                                }`
                                              }
                                            >
                                              <span className="text-sm">{s}</span>
                                            </Listbox.Option>
                                          ))}
                                        </Listbox.Options>
                                      </div>
                                    </Listbox>
                                  </div>

                                  <div className="text-xs text-slate-400">vs</div>

                                  <div className="flex-1 min-w-0">
                                    <Listbox value={m.b} onChange={(v) => setScore(ci, mi, 'b', v)}>
                                      <div className="relative">
                                        <Listbox.Button className="w-full text-left bg-slate-800 rounded border border-slate-700 px-3 py-2 flex items-center justify-between">
                                          <span className="truncate text-sm">
                                            {m.b == null ? rightLabel : String(m.b)}
                                          </span>
                                          <ChevronDown className="h-4 w-4 text-slate-400 ml-2" />
                                        </Listbox.Button>
                                        <Listbox.Options className="absolute left-0 right-0 mt-1 w-full bg-surface border border-border rounded-md py-1 z-50 max-h-52 overflow-auto text-sm">
                                          <Listbox.Option
                                            key={-1}
                                            value={null}
                                            className={({ active }) =>
                                              `px-3 py-2 cursor-pointer ${
                                                active ? 'bg-surface-highlight' : ''
                                              }`
                                            }
                                          >
                                            <span className="text-sm truncate">{rightLabel}</span>
                                          </Listbox.Option>
                                          {scoreOptions.map((s) => (
                                            <Listbox.Option
                                              key={s}
                                              value={s}
                                              className={({ active }) =>
                                                `px-3 py-2 cursor-pointer ${
                                                  active ? 'bg-surface-highlight' : ''
                                                }`
                                              }
                                            >
                                              <span className="text-sm">{s}</span>
                                            </Listbox.Option>
                                          ))}
                                        </Listbox.Options>
                                      </div>
                                    </Listbox>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-slate-100 mb-2">Court Results</div>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-xs text-slate-400">
                              <th className="pb-1">Place</th>
                              <th className="pb-1">Player</th>
                              <th className="pb-1">Wins‑Losses</th>
                              <th className="pb-1">Pts (F‑A)</th>
                              <th className="pb-1">Point Diff.</th>
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
                                    const pf = r.pointsFor ?? 0;
                                    const pa = r.pointsAgainst ?? 0;
                                    return (
                                      <tr key={r.seed} className="border-t border-slate-700">
                                        <td className="py-1 text-slate-100">
                                          {r.courtPlace ? ordinal(r.courtPlace) : '-'}
                                        </td>
                                        <td className="py-1 text-slate-100">{r.name}</td>
                                        <td className="py-1 text-slate-100">{`${wins}-${losses}`}</td>
                                        <td className="py-1 text-slate-100">{`${pf}-${pa}`}</td>
                                        <td className="py-1 text-slate-100">{diff}</td>
                                      </tr>
                                    );
                                  })
                              : range(4).map((idx) => (
                                  <tr key={idx} className="border-t border-slate-700">
                                    <td className="py-1 text-slate-100">{ordinal(idx + 1)}</td>
                                    <td className="py-1 text-slate-100">Name</td>
                                    <td className="py-1 text-slate-100">0-0</td>
                                    <td className="py-1 text-slate-100">0-0</td>
                                    <td className="py-1 text-slate-100">+0</td>
                                  </tr>
                                ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Card>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>

        <div className="mt-2">
          {duplicateError && <div className="text-xs text-rose-400 mb-2">{duplicateError}</div>}
          <div className="flex items-center gap-2">
            <Button
              onClick={computeStandings}
              variant="secondary"
              size="md"
              className="px-4 py-2 bg-slate-700 text-white hover:bg-slate-600"
            >
              Recalculate
            </Button>
            <Button
              onClick={advanceToNextRound}
              variant="primary"
              size="md"
              className="px-4 py-2 bg-emerald-600 text-white shadow hover:bg-emerald-500"
            >
              Next Round
            </Button>
            <div className="text-sm text-slate-400">Scores 0–11 • Rankings auto-calculated</div>
          </div>
        </div>

        <Card className="p-3 mt-3">
          <div className="text-sm font-medium mb-2">Round {round} Rankings</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400">
                <th className="pb-2">Round Rank</th>
                <th className="pb-2">Player</th>
                <th className="pb-2">Next Assignment</th>
              </tr>
            </thead>
            <tbody>
              {results && results.length ? (
                results.map((r, idx) => {
                  const next = r.nextCourt
                    ? `Court ${r.nextCourt}, Spot ${r.courtPlace ?? '-'}, Division ${
                        r.division ?? 'A'
                      }`
                    : '-';
                  return (
                    <tr key={r.seed} className="border-t border-slate-700">
                      <td className="py-1 text-slate-100">{idx + 1}.</td>
                      <td className="py-1 text-slate-100">{r.name}</td>
                      <td className="py-1 text-slate-100">{next}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="py-2 text-slate-400">
                    Enter scores to generate rankings
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

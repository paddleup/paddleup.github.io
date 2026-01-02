import React, { useState, useMemo } from 'react';
import { Grid, Users, CheckCircle } from 'lucide-react';
import { players as allPlayers } from '../../data/players';
import { challengeEvents } from '../../data/challengeEvents';
import { calculateWeekFinalPositions, generateSnakeDraw } from '../../lib/leagueUtils';
import Card from '../ui/Card';
import PageHeader from '../ui/PageHeader';
import PrintMatchSheet from '../print/PrintMatchSheet';
import Button from '../ui/Button';
import { cn } from '../../lib/utils';
import { Player } from '../../types';

interface InitialAssignmentsProps {
  onBack: () => void;
}

interface PlayerWithStats extends Player {
  points: number;
}

const InitialAssignments: React.FC<InitialAssignmentsProps> = ({ onBack }) => {
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(new Set());
  const [assignments, setAssignments] = useState<ReturnType<typeof generateSnakeDraw> | null>(null);

  // Paste-import support: allow pasting a newline-separated list of player names
  const [usePaste, setUsePaste] = useState<boolean>(false);
  const [pasteText, setPasteText] = useState<string>('');
  const [pasteUnmatched, setPasteUnmatched] = useState<string[]>([]);
  const [tempPlayers, setTempPlayers] = useState<Player[]>([]);
  const [lastRankedPlayers, setLastRankedPlayers] = useState<Player[]>([]);

  const normalize = (s: string) => {
    return s
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // remove punctuation like periods
      .replace(/\s+/g, ' ')
      .trim();
  };

  const matchPlayerByLine = (line: string) => {
    const n = normalize(line);
    if (!n) return undefined;
    // exact start match first, then includes
    return (
      allPlayers.find((p) => normalize(p.name).startsWith(n)) ||
      allPlayers.find((p) => normalize(p.name).includes(n))
    );
  };

  const importFromPaste = () => {
    const lines = pasteText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const matchedIds: string[] = [];
    const newTemps = [...tempPlayers];

    for (const line of lines) {
      const matched = matchPlayerByLine(line);
      if (matched) {
        if (!matchedIds.includes(matched.id)) matchedIds.push(matched.id);
      } else {
        // Create a session-only temporary player for unmatched names
        const baseId = 'tmp-' + normalize(line).replace(/\s+/g, '-').slice(0, 30);
        let id = baseId;
        let counter = 1;
        while (
          allPlayers.find((p) => p.id === id) ||
          newTemps.find((p) => p.id === id) ||
          matchedIds.includes(id)
        ) {
          id = `${baseId}-${counter++}`;
        }
        const temp: Player = { id, name: line };
        newTemps.push(temp);
        matchedIds.push(id);
      }
      if (matchedIds.length >= 16) break;
    }

    setTempPlayers(newTemps);
    setPasteUnmatched([]); // all lines result in either a match or a temp
    const newSet = new Set<string>(matchedIds.slice(0, 16));
    setSelectedPlayers(newSet);
  };

  // Get all players with their current stats derived from challengeEvents
  const playerStats = useMemo(() => {
    // Aggregate points per player from challenge events that provide final standings
    const events = challengeEvents.filter(
      (ev) => Array.isArray((ev as any).standings) && (ev as any).standings.length > 0,
    );
    const pointsByPlayer = new Map<string, number>();

    events.forEach((ev, idx) => {
      const weekLike = {
        id: idx,
        date: ev.startDateTime ? ev.startDateTime.toISOString() : ev.id,
        isCompleted: true,
        standings: (ev as any).standings,
      } as any;
      const finals = calculateWeekFinalPositions(weekLike) || [];
      finals.forEach((f: any) => {
        const pid = f.playerId;
        const pts = f.pointsEarned || 0;
        pointsByPlayer.set(pid, (pointsByPlayer.get(pid) || 0) + pts);
      });
    });

    return allPlayers
      .map((p) => ({
        ...p,
        points: pointsByPlayer.get(p.id) || 0,
        dupr: p.dupr || 0,
      }))
      .sort((a, b) => {
        // Sort by Points (Desc), then DUPR (Desc), then Name (Asc)
        if (b.points !== a.points) return b.points - a.points;
        if (b.dupr !== a.dupr) return (b.dupr || 0) - (a.dupr || 0);
        return a.name.localeCompare(b.name);
      });
  }, []);

  const togglePlayer = (id: string) => {
    const newSelected = new Set(selectedPlayers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      if (newSelected.size < 16) {
        newSelected.add(id);
      }
    }
    setSelectedPlayers(newSelected);
  };

  const handleGenerate = () => {
    // Map selected IDs to player objects (include temp players)
    const selectedArray = Array.from(selectedPlayers);
    const playersForDraw = selectedArray.map((id) => {
      const found =
        playerStats.find((p) => p.id === id) ||
        allPlayers.find((p) => p.id === id) ||
        tempPlayers.find((p) => p.id === id);
      if (found) {
        return {
          ...found,
          points: (found as any).points ?? 0,
          dupr: (found as any).dupr ?? 0,
        } as any;
      }
      // fallback minimal player
      return { id, name: id, points: 0, dupr: 0 } as any;
    });

    const rankedPlayers = playersForDraw.sort((a, b) => {
      // Primary: points desc. Tie-breaker: alphabetical by name (asc).
      if ((b.points || 0) !== (a.points || 0)) return (b.points || 0) - (a.points || 0);
      return (a.name || '').localeCompare(b.name || '');
    });

    const newAssignments = generateSnakeDraw(rankedPlayers);
    setLastRankedPlayers(rankedPlayers);
    setAssignments(newAssignments);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageHeader
        title="Initial Assignments"
        subtitle="Select players to generate court assignments based on season rankings."
        center
      >
        <div className="flex justify-center mt-4">
          <div className="bg-surface-highlight p-1 rounded-lg inline-flex">
            <Button
              onClick={onBack}
              variant="ghost"
              size="md"
              className="px-4 py-2 text-text-muted hover:text-text-main"
            >
              Match Calculator
            </Button>
            <Button
              variant="primary"
              size="md"
              className="px-4 py-2 bg-primary text-text-main shadow-sm"
            >
              Initial Assignments
            </Button>
          </div>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Player Selection */}
        <Card className="lg:col-span-1 h-[600px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Select Players
            </h3>
            <span
              className={cn(
                'text-sm font-bold px-2 py-1 rounded-full',
                selectedPlayers.size === 16
                  ? 'bg-success/20 text-success'
                  : 'bg-surface-highlight text-text-muted',
              )}
            >
              {selectedPlayers.size}/16
            </span>
          </div>

          {/* Mode toggle: roster vs paste */}
          <div className="mb-3 flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                checked={!usePaste}
                onChange={() => setUsePaste(false)}
                className="form-radio"
              />
              <span>Use roster</span>
            </label>
            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                checked={usePaste}
                onChange={() => setUsePaste(true)}
                className="form-radio"
              />
              <span>Paste names</span>
            </label>
            {usePaste && (
              <Button
                onClick={() => {
                  setPasteText('');
                  setPasteUnmatched([]);
                  setSelectedPlayers(new Set());
                }}
                variant="ghost"
                size="sm"
                className="ml-auto text-xs text-text-muted hover:text-text-main"
              >
                Clear
              </Button>
            )}
          </div>

          {usePaste ? (
            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder={`Paste one player per line, e.g.\nBekah O.\nGarrett H.\nJohn T.`}
                className="w-full h-40 p-2 rounded-md border border-border bg-surface-highlight text-sm resize-none"
              />
              <div className="flex gap-2">
                <Button onClick={importFromPaste} variant="primary" size="sm" className="px-3 py-1">
                  Import
                </Button>
                <Button
                  onClick={() => {
                    // show matched players in selection if any were found from last import
                    if (pasteText.trim()) importFromPaste();
                  }}
                  variant="secondary"
                  size="sm"
                  className="px-3 py-1"
                >
                  Refresh
                </Button>
                <div className="text-xs text-text-muted ml-auto self-center">
                  Imported: {selectedPlayers.size}/16
                </div>
              </div>

              {pasteUnmatched.length > 0 && (
                <div className="text-xs text-warning">
                  Unmatched names: {pasteUnmatched.join(', ')}
                </div>
              )}

              <div className="pt-2">
                {Array.from(selectedPlayers).map((id) => {
                  const p =
                    playerStats.find((x) => x.id === id) ||
                    allPlayers.find((x) => x.id === id) ||
                    tempPlayers.find((x) => x.id === id);
                  return p ? (
                    <div
                      key={id}
                      className="flex items-center justify-between p-2 rounded-md bg-surface-highlight border border-transparent"
                    >
                      <div>
                        <p className="text-sm font-medium">{p.name}</p>
                        <p className="text-xs text-text-muted">{(p as any).points ?? 0} pts</p>
                      </div>
                      <Button
                        onClick={() => togglePlayer(id)}
                        variant="ghost"
                        size="sm"
                        className="text-xs text-error"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {playerStats.map((p, index) => (
                <div
                  key={p.id}
                  onClick={() => togglePlayer(p.id)}
                  className={cn(
                    'flex items-center justify-between p-2 rounded-md cursor-pointer border transition-all',
                    selectedPlayers.has(p.id)
                      ? 'bg-primary/10 border-primary'
                      : 'bg-surface-highlight border-transparent hover:border-border',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 text-center text-xs font-bold text-text-muted">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{p.name}</p>
                      <p className="text-xs text-text-muted">{p.points} pts</p>
                    </div>
                  </div>
                  {selectedPlayers.has(p.id) && <CheckCircle className="h-4 w-4 text-primary" />}
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 mt-4 border-t border-border">
            <Button
              onClick={handleGenerate}
              variant="primary"
              size="md"
              className="w-full py-2 font-bold"
            >
              Generate Assignments
            </Button>
          </div>
        </Card>

        {/* Assignments Display */}
        <div className="lg:col-span-2 space-y-6">
          {!assignments ? (
            <div className="h-full flex flex-col items-center justify-center text-text-muted border-2 border-dashed border-border rounded-xl p-12">
              <Grid className="h-12 w-12 mb-4 opacity-20" />
              <p>Select players and click Generate</p>
            </div>
          ) : (
            <div>
              <div className="flex justify-end mb-4">
                <Button
                  onClick={() => window.print()}
                  variant="primary"
                  size="md"
                  className="px-4 py-2"
                >
                  Open Print Preview
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assignments.map((court) => (
                  <Card key={court.id} className="border-l-4 border-l-primary">
                    <h3 className="font-bold text-lg mb-4 pb-2 border-b border-border flex justify-between items-center">
                      {court.name}
                      <span className="text-xs font-normal text-text-muted bg-surface-highlight px-2 py-1 rounded">
                        Seeds: {court.indices.map((i) => i + 1).join(', ')}
                      </span>
                    </h3>
                    <div className="space-y-3">
                      {court.players.map((p) => (
                        <div key={p.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-text-muted w-6">#{p.seed}</span>
                            <span className="font-medium">{p.name}</span>
                          </div>
                          <span className="text-xs text-text-muted">
                            {(p as unknown as PlayerWithStats).points} pts
                          </span>
                        </div>
                      ))}
                      {court.players.length === 0 && (
                        <p className="text-sm text-text-muted italic">No players assigned</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Print container: render printable match sheets (uses print-only styles) */}
              <div className="print-container">
                <PrintMatchSheet
                  initialAssignments={assignments ?? generateSnakeDraw(lastRankedPlayers)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InitialAssignments;

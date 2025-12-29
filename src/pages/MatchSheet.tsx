import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { players as allPlayers } from '../data/players';
import { generateSnakeDraw } from '../lib/leagueUtils';
import Card from '../components/ui/Card';
import CourtCard from '../components/match/CourtCard';
import PageHeader from '../components/ui/PageHeader';
import PrintMatchSheet from '../components/print/PrintMatchSheet';

/**
 * MatchSheet page
 * - Auto-fills initial assignments using a snake draw of top 16 players (by DUPR)
 * - Shows per-court inputs for scores (one numeric score per player)
 * - Recomputes ranks and shows suggested next court using leagueUtils.getNextCourt
 *
 * Note: This is a browser-first interactive UI (no PDF). State lives in memory;
 * you can add localStorage persistence later if desired.
 */

const MatchSheetPage: React.FC = () => {
  // Build initial ranked players (top 16 by DUPR; fallback to name)
  const rankedPlayers = useMemo(() => {
    return [...allPlayers]
      .sort((a, b) => {
        if ((b.dupr || 0) !== (a.dupr || 0)) return (b.dupr || 0) - (a.dupr || 0);
        return a.name.localeCompare(b.name);
      })
      .slice(0, 16);
  }, []);

  const location = useLocation();
  const stateAssignments = (location.state as any)?.assignments as
    | ReturnType<typeof generateSnakeDraw>
    | undefined;
  const initialAssignments = useMemo(
    () => stateAssignments ?? generateSnakeDraw(rankedPlayers),
    [rankedPlayers, stateAssignments],
  );

  const [round, setRound] = useState<number>(1);

  // Derived: produce placeholder ranks/next courts. Scoring removed — standings-driven system uses stored final standings.
  const computeNext = (): Record<
    number,
    { ranks: (number | string)[]; next: (number | string)[] }
  > => {
    const result: Record<number, { ranks: (number | string)[]; next: (number | string)[] }> = {};
    initialAssignments.forEach((court) => {
      const ranks = new Array(court.players.length).fill('-');
      const next = new Array(court.players.length).fill('TBD');
      result[court.id] = { ranks, next };
    });
    return result;
  };

  const nextByCourt = computeNext();

  return (
    <div className="space-y-8 pb-12">
      <div className="no-print">
        <PageHeader
          title="Match Sheet"
          subtitle="Interactive court sheets — enter scores and see suggested next courts"
          center
        />
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="p-4 flex items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3">
            <label className="text-sm text-text-muted">Round</label>
            <select
              value={round}
              onChange={(e) => setRound(Number(e.target.value))}
              className="px-3 py-2 rounded border border-border bg-surface-highlight"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {}}
              className="px-3 py-2 rounded bg-surface-highlight text-sm hover:bg-surface-highlight/80"
            >
              Refresh
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded bg-primary text-text-main font-bold"
            >
              Open Print Preview
            </button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
          {initialAssignments.map((court) => (
            <CourtCard
              key={court.id}
              court={court}
              ranks={nextByCourt[court.id]?.ranks}
              nextCourts={nextByCourt[court.id]?.next}
            />
          ))}
        </div>
      </div>

      {/* Render print sheet outside the inner container to avoid inherited layout/styles */}
      <div className="print-container">
        <PrintMatchSheet initialAssignments={initialAssignments} />
      </div>
    </div>
  );
};

export default MatchSheetPage;

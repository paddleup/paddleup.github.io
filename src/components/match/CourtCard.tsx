import React from 'react';
import Card from '../ui/Card';
import { Player } from '../../types';

type Court = {
  id: number;
  name: string;
  indices: number[];
  players: (Player & { seed: number })[];
};

type Props = {
  court: Court;
  ranks?: (number | string)[];
  nextCourts?: (number | string)[];
  scores?: number[]; // optional per-player scores (unused in current UI)
  onScoreChange?: (index: number, value: number) => void; // optional callback for score edits
};

const CourtCard: React.FC<Props> = ({ court, ranks = [], nextCourts = [] }) => {
  return (
    <Card className="p-4">
      <h3 className="font-bold text-lg mb-3 pb-2 border-b border-border flex justify-between items-center">
        {court.name}
        <span className="text-xs font-normal text-text-muted bg-surface-highlight px-2 py-1 rounded">
          Seeds: {court.indices.map((i) => i + 1).join(', ')}
        </span>
      </h3>

      <div className="space-y-3">
        {court.players.map((p, idx) => (
          <div key={p.id} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-text-muted w-6">#{p.seed}</span>
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-text-muted">{p.dupr ? `DUPR ${p.dupr}` : ''}</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-xs text-text-muted">Rank</div>
                <div className="font-bold">{ranks[idx] ?? '-'}</div>
              </div>

              <div className="text-center">
                <div className="text-xs text-text-muted">Next</div>
                <div className="font-bold">{nextCourts[idx] ?? 'TBD'}</div>
              </div>
            </div>
          </div>
        ))}

        {court.players.length === 0 && (
          <p className="text-sm text-text-muted italic">No players assigned</p>
        )}
      </div>
    </Card>
  );
};

export default CourtCard;

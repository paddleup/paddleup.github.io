// src/components/eventNight/VisualBracket.tsx
import React from 'react';
import { Player } from '../../types';
import { generateSnakeDraw } from '../../lib/draw';

interface VisualBracketProps {
  players: Player[];
  round: number;
}

const tierLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

export const VisualBracket: React.FC<VisualBracketProps> = ({ players, round }) => {
  // For now, only show round 1 snake draw (expand as needed for later rounds)
  const courts = generateSnakeDraw(players);

  return (
    <div className="my-8">
      <h3 className="text-xl font-bold text-center mb-4">Snake Draw (Court Assignments)</h3>
      <div className="flex flex-col gap-4 md:flex-row md:gap-6 justify-center">
        {courts.map((court, ci) => (
          <div
            key={court.id}
            className="bg-surface rounded-xl shadow-md border border-border p-4 flex-1 min-w-[180px] max-w-xs mx-auto"
          >
            <div className="font-bold text-primary text-lg mb-2 text-center">
              Court {court.id}{' '}
              <span className="text-xs text-text-muted">Tier {tierLabels[ci]}</span>
            </div>
            <ol className="space-y-2">
              {court.players.map((player, pi) => (
                <li
                  key={player.id}
                  className="flex items-center gap-2 px-2 py-1 rounded bg-surface-alt/50"
                >
                  <span className="font-mono text-xs text-text-muted">#{player.seed}</span>
                  <span className="font-semibold text-text-main">{player.name}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <div className="text-xs text-center text-text-muted mt-4">
        <span>Based on current seeding. Actual court assignments may vary by round.</span>
      </div>
    </div>
  );
};

export default VisualBracket;

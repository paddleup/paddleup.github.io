// src/components/eventNight/AdminControls.tsx
import React from 'react';
import Button from '../ui/Button';

export interface Player {
  id: string;
  name: string;
  points?: number;
}

export interface AdminControlsProps {
  numCourts: number;
  setNumCourts: (n: number) => void;
  players: Player[];
  selectedPlayers: string[];
  setSelectedPlayers: (ids: string[]) => void;
  allTimeStats: Record<string, number>;
  onAssignCourts: () => void;
  disabled?: boolean;
  error?: string;
}

const AdminControls: React.FC<AdminControlsProps> = ({
  numCourts,
  setNumCourts,
  players,
  selectedPlayers,
  setSelectedPlayers,
  allTimeStats,
  onAssignCourts,
  disabled,
  error,
}) => (
  <div>
    <div className="mb-4">
      <label className="block text-sm font-medium">Number of Courts</label>
      <select
        value={numCourts}
        onChange={(e) => setNumCourts(Number(e.target.value))}
        className="mt-1 block w-full border rounded px-2 py-1"
      >
        {[2, 3, 4, 5, 6, 7].map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium">Select Players</label>
      <div className="grid grid-cols-2 gap-2">
        {players.map((p) => (
          <label key={p.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedPlayers.includes(p.id ?? '')}
              onChange={(e) => {
                setSelectedPlayers(
                  e.target.checked
                    ? [...selectedPlayers, p.id ?? '']
                    : selectedPlayers.filter((id) => id !== p.id),
                );
              }}
            />
            {p.name} ({allTimeStats[p.id ?? ''] ?? 0} pts)
          </label>
        ))}
      </div>
    </div>
    <Button onClick={onAssignCourts} className="mb-4" disabled={disabled}>
      Assign Courts (Snake Draw)
    </Button>
    <div className="text-xs text-error mb-2">{error}</div>
  </div>
);

export default AdminControls;

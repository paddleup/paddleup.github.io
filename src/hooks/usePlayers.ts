import { useMemo } from 'react';
import { players as playersData } from '../data/players';
import type { Player } from '../types';

/**
 * Simple hook that exposes the player roster and a lookup helper.
 * Keeps callers agnostic to the data import and memoizes the array reference.
 */
export const usePlayers = () => {
  const players: Player[] = useMemo(() => playersData, []);

  const getById = (id: string): Player | undefined => {
    return players.find((p) => p.id === id);
  };

  return { players, getById };
};

export default usePlayers;

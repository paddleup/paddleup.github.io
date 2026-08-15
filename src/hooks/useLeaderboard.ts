import { useState, useEffect } from 'react';

export type MovementDir = 'up' | 'down' | 'none';

export interface Movement {
  dir: MovementDir;
  places: number;
}

export interface Player {
  rank: number;
  name: string;
  points: number;
  events: number;
  move: Movement;
}

export type RankingView = 'current-month' | 'past-30-days' | 'all-time';

export interface LeaderboardData {
  scrapedAt: string;
  source: string;
  views: Record<RankingView, Player[]>;
}

export function useLeaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cache-bust so a freshly scraped leaderboard shows without a hard refresh.
    fetch(`${import.meta.env.BASE_URL}data/leaderboard.json?t=${Date.now()}`, {
      cache: 'no-store',
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: LeaderboardData) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  function getPlayersForView(view: RankingView): Player[] {
    return data?.views[view] ?? [];
  }

  return { data, loading, error, getPlayersForView };
}

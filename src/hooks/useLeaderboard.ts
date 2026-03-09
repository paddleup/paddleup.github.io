import { useState, useEffect } from 'react';
import categoryData from '../data/categories.json';

export interface Player {
  name: string;
  points: number;
}

export interface LeaderboardData {
  scrapedAt: string;
  source: string;
  players: Player[];
}

export type CategorySlug =
  | 'overall'
  | 'mens-overall'
  | 'womens-overall'
  | 'mens-50'
  | 'womens-50'
  | 'mens-60'
  | 'womens-60'
  | 'all-50'
  | 'all-60';

const categories= categoryData as Record<string, string[]>;

// Cascading: 60+ players also appear in 50+, and 50+ players also appear in overall
const CASCADE: Record<string, string[]> = {
  'mens-60': ['mens-50', 'mens-overall'],
  'mens-50': ['mens-overall'],
  'womens-60': ['womens-50', 'womens-overall'],
  'womens-50': ['womens-overall'],
};

// Build a reverse lookup: player name → set of category slugs (with cascading applied)
function buildPlayerCategoryMap(): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const [slug, names] of Object.entries(categories)) {
    const inherited = CASCADE[slug] ?? [];
    for (const name of names) {
      if (!map.has(name)) map.set(name, new Set());
      const set = map.get(name)!;
      set.add(slug);
      for (const parent of inherited) set.add(parent);
    }
  }
  return map;
}

const playerCategoryMap = buildPlayerCategoryMap();

export function useLeaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/leaderboard.json`)
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

  function getPlayersForCategory(slug: CategorySlug): Player[] {
    if (!data) return [];
    if (slug === 'overall') return data.players;
    // Combined gender views: show players from both men's and women's for an age group
    if (slug === 'all-50') {
      return data.players.filter((p) => {
        const cats = playerCategoryMap.get(p.name);
        return cats?.has('mens-50') || cats?.has('womens-50');
      });
    }
    if (slug === 'all-60') {
      return data.players.filter((p) => {
        const cats = playerCategoryMap.get(p.name);
        return cats?.has('mens-60') || cats?.has('womens-60');
      });
    }
    return data.players.filter((p) => {
      const cats = playerCategoryMap.get(p.name);
      return cats?.has(slug);
    });
  }

  function getLeader(slug: CategorySlug): Player | null {
    const players = getPlayersForCategory(slug);
    return players[0] ?? null;
  }

  return { data, loading, error, getPlayersForCategory, getLeader };
}

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
  | 'mens-overall'
  | 'womens-overall'
  | 'mens-50'
  | 'womens-50'
  | 'mens-60'
  | 'womens-60';

export interface Category {
  slug: CategorySlug;
  label: string;
}

export const CATEGORIES: Category[] = [
  { slug: 'mens-overall', label: "Men's Overall" },
  { slug: 'womens-overall', label: "Women's Overall" },
  { slug: 'mens-50', label: "Men's 50+" },
  { slug: 'womens-50', label: "Women's 50+" },
  { slug: 'mens-60', label: "Men's 60+" },
  { slug: 'womens-60', label: "Women's 60+" },
];

const categories = categoryData as Record<string, string[]>;

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

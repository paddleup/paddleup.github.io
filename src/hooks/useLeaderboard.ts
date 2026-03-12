import { useState, useEffect, useMemo } from 'react';

export interface Player {
  name: string;
  displayName: string;
  gender: 'M' | 'F' | null;
  ageGroup: 50 | 60 | null;
  points: number;
}

interface RawPlayer {
  name: string;
  points: number;
}

interface RawLeaderboardData {
  scrapedAt: string;
  source: string;
  players: RawPlayer[];
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
  | 'unclassified';

const NAME_RE = /^(.+?)\s+-\s+(M|F)(?:\s+(50|60))?$/;

function parsePlayer(raw: RawPlayer): Player {
  const match = raw.name.match(NAME_RE);
  if (match) {
    return {
      name: raw.name,
      displayName: match[1].trim(),
      gender: match[2] as 'M' | 'F',
      ageGroup: match[3] ? (parseInt(match[3]) as 50 | 60) : null,
      points: raw.points,
    };
  }
  return {
    name: raw.name,
    displayName: raw.name,
    gender: null,
    ageGroup: null,
    points: raw.points,
  };
}

function matchesCategory(player: Player, slug: CategorySlug): boolean {
  switch (slug) {
    case 'overall':
      return true;
    case 'unclassified':
      return player.gender === null;
    case 'mens-overall':
      return player.gender === 'M';
    case 'womens-overall':
      return player.gender === 'F';
    case 'mens-50':
      return player.gender === 'M' && player.ageGroup != null && player.ageGroup >= 50;
    case 'womens-50':
      return player.gender === 'F' && player.ageGroup != null && player.ageGroup >= 50;
    case 'mens-60':
      return player.gender === 'M' && player.ageGroup === 60;
    case 'womens-60':
      return player.gender === 'F' && player.ageGroup === 60;
  }
}

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
      .then((json: RawLeaderboardData) => {
        setData({
          scrapedAt: json.scrapedAt,
          source: json.source,
          players: json.players.map(parsePlayer),
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const unclassifiedCount = useMemo(
    () => data?.players.filter((p) => p.gender === null && p.points > 0).length ?? 0,
    [data],
  );

  function getPlayersForCategory(slug: CategorySlug): Player[] {
    if (!data) return [];
    return data.players.filter((p) => p.points > 0 && matchesCategory(p, slug));
  }

  function getLeader(slug: CategorySlug): Player | null {
    const players = getPlayersForCategory(slug);
    return players[0] ?? null;
  }

  return { data, loading, error, getPlayersForCategory, getLeader, unclassifiedCount };
}

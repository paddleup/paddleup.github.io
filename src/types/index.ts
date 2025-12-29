export interface Player {
  id: string;
  name: string;
  dupr?: number;
  imageUrl?: string;
}

export interface Match {
  id?: string;
  team1: string[];
  team2: string[];
  score1: number;
  score2: number;
  court?: number;
  round?: number;
  event?: 'regular' | 'qualifier';
  notes?: string;
}

export interface Week {
  id: number;
  date: string;
  isCompleted: boolean;
  rankings?: string[];
  matches?: Match[];
}

export interface Standing {
  rank: number;
  playerId: string;
  points: number;
}

export interface Season {
  season: string;
  date?: string;
  lastUpdated?: string;
  weeks?: Week[];
  standings?: Standing[];
}

/**
 * Qualifier events are similar in shape to a single Week (one-night events).
 * We keep a dedicated type for clarity in data files and components.
 */
export interface Event {
  id: string;
  name: string;
  startDateTime: Date;
  endDateTime?: Date;
  allDay?: boolean;
  location?: string;
  status?: 'open' | 'closed' | 'cancelled';
  link?: string;
  label?: string;
}

export interface Qualifier extends Week {
  startDateTime?: Date;
  allDay?: boolean;
}

export type SeasonData = Season;

export interface PlayerStats {
  id: string;
  points: number;
  wins: number;
  losses: number;
  pointsWon: number;
  pointsLost: number;
  diff: number;
  appearances: number;
  champCourt: number;
  weeklyRanks: number[];
  rank?: number;
}

export interface AllTimeStats {
  playerId: string;
  points: number;
  seasons: number;
  rank?: number;
}

/* Rules & format types (shared contract for Format page and children) */

export interface Price {
  amount?: number;
  unit?: string;
  display: string;
  note?: string;
}

export interface ShowSections {
  seasonStructure?: boolean;
  prizes?: boolean;
  qualifiers?: boolean;
}

export interface RulesBase {
  title: string;
  summary?: string;
  fee?: string;
  price?: Price;
  showSections?: ShowSections;
  seasonStructure?: {
    rosterSize?: number;
    duration?: string;
    when?: string;
    safeZone?: string;
    dropZone?: string;
  };
  register: {
    url: string;
    text: string;
  };
  schedule?: {
    day?: string;
    time?: string;
  };
  location?: {
    name?: string;
    url?: string;
    city?: string;
  };
  participant?: {
    type?: string;
    note?: string;
  };
  seeding?: any;
  general?: string[];
  subs?: string[];
  missedWeekNote?: string;
}

/* Derived types from concrete data to keep types aligned with actual exports */
export type BaseRules = RulesBase;
export type LeagueRules = typeof import('../data/rules').leagueRules;
export type ChallengeRules = typeof import('../data/rules').challengeRules;
export type Rules = LeagueRules | ChallengeRules;

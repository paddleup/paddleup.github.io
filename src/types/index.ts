import { z } from 'zod';

/* --- Firestore & Zod Schemas --- */

export const PlayerSchema = z.object({
  id: z.string().optional(), // Firestore id often stored outside the doc fields
  name: z.string().min(1),
  dupr: z.number().nonnegative().optional(),
  imageUrl: z.string().optional(),
  createdAt: z.string().optional(), // ISO string from Firestore Timestamp
});

export type Player = z.infer<typeof PlayerSchema>;

/**
 * MatchScore represents the outcome of a single set/game between two teams.
 * Used within the Court/Round structure.
 */
export const MatchScoreSchema = z.object({
  scoreA: z.number().optional(),
  scoreB: z.number().optional(),
});

export type MatchScore = z.infer<typeof MatchScoreSchema>;

/**
 * Court within a tournament round, usually involving 4 players rotating.
 */
export const CourtSchema = z.object({
  playerNames: z.array(z.string()).length(4),
  matches: z.array(MatchScoreSchema).length(3),
});

export type Court = z.infer<typeof CourtSchema>;

/**
 * A Round within an Event (e.g. Round 1, Semifinals, Finals).
 */
export const RoundSchema = z.object({
  courts: z.array(CourtSchema),
});

export type Round = z.infer<typeof RoundSchema>;

/**
 * Event represents a single night or tournament.
 */
export const EventSchema = z.object({
  id: z.string(),
  name: z.string(),
  startDateTime: z.date(),
  endDateTime: z.date().optional(),
  allDay: z.boolean().optional(),
  location: z.string().optional(),
  status: z.enum(['open', 'closed', 'cancelled']).optional(),
  link: z.string().optional(),
  standings: z.array(z.string()).optional(), // Array of player IDs in final rank order
  label: z.string().optional(),
  rounds: z.array(RoundSchema).optional(),
});

export type Event = z.infer<typeof EventSchema>;

/* --- Domain Interfaces (derived/aggregated data) --- */

/**
 * Flat Match record used for certain historical displays and legacy standings logic.
 */
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
  id: number | string;
  date: string;
  isCompleted: boolean;
  rankings?: string[];
  matches?: Match[];
  standings?: string[]; // Alias for rankings in some contexts
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

/**
 * Generic paginated response shape used by client helpers.
 */
export interface PageResult<T> {
  docs: T[];
  nextCursor?: string | null;
}

/* Rules & format types (sourced from data/rules.ts so the data file is the single source of truth) */
import type {
  Rules as DataRules,
  LeagueRules as DataLeagueRules,
  ChallengeRules as DataChallengeRules,
  RulesBase as DataRulesBase,
} from '../data/rules';

export type BaseRules = DataRulesBase;
export type LeagueRules = DataLeagueRules;
export type ChallengeRules = DataChallengeRules;
export type Rules = DataRules;

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

export const ChallengeEventRoundNumberSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);

export type ChallengeEventRoundNumber = z.infer<typeof ChallengeEventRoundNumberSchema>;

export const GameSchema = z.object({
  id: z.string().optional(),
  team1Player1Id: z.string(),
  team1Player2Id: z.string(),
  team2Player1Id: z.string(),
  team2Player2Id: z.string(),
  team1Score: z.number().nonnegative().optional(),
  team2Score: z.number().nonnegative().optional(),
  courtId: z.string().optional(),
  roundNumber: ChallengeEventRoundNumberSchema,
});

export type Game = z.infer<typeof GameSchema>;

export const CourtSchema = z.object({
  id: z.string().optional(),
  playerIds: z.array(z.string()).length(4),
  roundNumber: ChallengeEventRoundNumberSchema,
  courtNumber: z.number().positive(),
});

export type Court = z.infer<typeof CourtSchema>;

export const ChallengeEventStageSchema = z.union([
  z.literal('initial'),
  ChallengeEventRoundNumberSchema,
  z.literal('standings'),
]);

export type ChallengeEventStage = z.infer<typeof ChallengeEventStageSchema>;

export const EventSchema = z.object({
  id: z.string(),
  name: z.string(),
  startDateTime: z.date(),
  location: z.string().optional(),
  link: z.string().optional(),
  ongoingStage: ChallengeEventStageSchema.optional(),
  standings: z.array(z.string()).optional(), // Array of player IDs in final rank order
});

export type Event = z.infer<typeof EventSchema>;

/* --- Domain types (derived/aggregated data) --- */

export type CourtWithDrawAndGames = Court &
  Draw & {
    games: Game[];
  };

export type Round = {
  roundNumber: ChallengeEventRoundNumber;
  courts: CourtWithDrawAndGames[];
  standings: string[];
};

export type Standing = {
  rank: number;
  playerId: string;
  points: number;
};

export type PlayerStats = {
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
};

export type AllTimeStats = {
  playerId: string;
  points: number;
  seasons: number;
  rank?: number;
};

/**
 * Generic paginated response shape used by client helpers.
 */
export type PageResult<T> = {
  docs: T[];
  nextCursor?: string | null;
};

/* Rules & format types (sourced from data/rules.ts so the data file is the single source of truth) */
import type {
  Rules as DataRules,
  LeagueRules as DataLeagueRules,
  ChallengeRules as DataChallengeRules,
  RulesBase as DataRulesBase,
} from '../data/rules';
import { Draw } from '../lib/courtUtils';

export type BaseRules = DataRulesBase;
export type LeagueRules = DataLeagueRules;
export type ChallengeRules = DataChallengeRules;
export type Rules = DataRules;

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

export const RoundNumberSchema = z.union([z.literal(1), z.literal(2)]);

export type RoundNumber = z.infer<typeof RoundNumberSchema>;

export const TeamSchema = z.object({
  player1Id: z.string(),
  player2Id: z.string(),
});

export type Team = z.infer<typeof TeamSchema>;

export const GameSchema = z.object({
  id: z.string().optional(),
  team1: TeamSchema,
  team2: TeamSchema,
  team1Score: z.number().nonnegative().optional(),
  team2Score: z.number().nonnegative().optional(),
  courtId: z.string().optional(),
  roundNumber: RoundNumberSchema,
});

export type Game = z.infer<typeof GameSchema>;

export const CourtSchema = z.object({
  id: z.string().optional(),
  playerIds: z.array(z.string()).min(4).max(5),
  roundNumber: RoundNumberSchema,
  courtNumber: z.number().positive(),
});

export type Court = z.infer<typeof CourtSchema>;

export const ChallengeEventStageSchema = z.union([RoundNumberSchema, z.literal('standings')]);

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
export type Draw = {
  seeds: number[];
};

export type CourtWithDrawAndGames = Court &
  Draw & {
    games: Game[];
  };

export type Round = {
  roundNumber: RoundNumber;
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

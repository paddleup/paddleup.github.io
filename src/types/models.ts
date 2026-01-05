/* src/types/models.ts
   Domain types and runtime schemas (zod) for Firestore documents.

   - Export TypeScript interfaces for use across the app.
   - Export zod schemas so reads from Firestore can be validated at runtime.
   - Keep schemas and TS types as the single source of truth for the shape of data.
*/

import { z } from 'zod';

export const PlayerSchema = z.object({
  id: z.string().optional(), // Firestore id often stored outside the doc fields
  name: z.string().min(1),
  dupr: z.number().nonnegative().optional(),
  imageUrl: z.string().optional(),
  createdAt: z.string().optional(), // ISO or server timestamp string (validate after parsing)
});

export type Player = z.infer<typeof PlayerSchema>;

export const MatchSchema = z.object({
  scoreA: z.number().optional(),
  scoreB: z.number().optional(),
});

export type Match = z.infer<typeof MatchSchema>;

export const CourtSchema = z.object({
  playerNames: z.array(z.string()).length(4),
  matches: z.array(MatchSchema).length(3),
});

export type Court = z.infer<typeof CourtSchema>;

export const RoundSchema = z.object({
  courts: z.array(CourtSchema),
});

export type Round = z.infer<typeof RoundSchema>;

export const Event = z.object({
  id: z.string(),
  name: z.string(),
  startDateTime: z.date(),
  endDateTime: z.date().optional(),
  location: z.string().optional(),
  status: z.enum(['open', 'closed', 'cancelled']).optional(),
  link: z.string().optional(),
  standings: z.array(z.string()).optional(),
  label: z.string().optional(),
  rounds: z.array(RoundSchema).optional(),
});

export type Event = z.infer<typeof Event>;

/**
 * Generic paginated response shape used by some client helpers
 */
export const PageResultSchema = z.object({
  docs: z.array(z.any()),
  nextCursor: z.string().nullable().optional(),
});

export type PageResult<T> = {
  docs: T[];
  nextCursor?: string | null;
};

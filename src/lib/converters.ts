/* src/lib/converters.ts
   FirestoreDataConverter templates using zod runtime validation.

   - Converts Firestore snapshots to typed, validated objects.
   - Converts domain objects to Firestore-friendly writes (uses serverTimestamp).
   - Export converters for use with .withConverter(...)
*/

import {
  FirestoreDataConverter,
  serverTimestamp,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import { PlayerSchema, Player, Event } from '../types/models';

/** Helper: normalize Firestore Timestamp -> ISO string (or keep string) */
function toIsoString(value: unknown): string | undefined {
  if (!value) return undefined;
  // Firestore Timestamp has toDate()
  if (typeof (value as any)?.toDate === 'function') {
    return (value as any).toDate().toISOString();
  }
  if (typeof value === 'string') return value;
  return undefined;
}

function toDate(value: unknown): Date | undefined {
  if (!value) return undefined;
  // Firestore Timestamp
  if (typeof (value as any)?.toDate === 'function') {
    return (value as any).toDate();
  }
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value as any);
    if (!isNaN(d.getTime())) return d;
  }
  return undefined;
}

/**
 * Player converter
 */
export const playerConverter: FirestoreDataConverter<Player> = {
  toFirestore(player: Player) {
    // Exclude id (stored as doc id) and use serverTimestamp for createdAt when creating
    const { id: _id, createdAt, ...rest } = player as any;
    return {
      ...rest,
      // If caller provided createdAt (string), send it through; otherwise serverTimestamp()
      createdAt: createdAt ? createdAt : serverTimestamp(),
    };
  },

  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): Player {
    const data = snapshot.data(options) as Record<string, unknown>;
    const parsed = {
      id: snapshot.id,
      name: data.name,
      dupr: data.dupr,
      imageUrl: data.imageUrl,
      createdAt: toIsoString(data.createdAt),
    };
    // Runtime-validate with zod; throws on invalid data
    return PlayerSchema.parse(parsed);
  },
};

export const eventConverter: FirestoreDataConverter<Event> = {
  toFirestore(event: Event) {
    // Exclude id (stored as doc id). Dates are written as JS Date or serverTimestamp().
    const { id: _id, ...rest } = event as any;
    const { startDateTime, endDateTime, ...other } = rest;
    return {
      ...other,
      startDateTime: startDateTime ? startDateTime : serverTimestamp(),
      // endDateTime may be null/undefined
      endDateTime: endDateTime ? endDateTime : null,
    };
  },

  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): Event {
    const data = snapshot.data(options) as Record<string, unknown>;
    const parsed = {
      id: snapshot.id,
      name: data.name,
      startDateTime: toDate(data.startDateTime),
      endDateTime: toDate(data.endDateTime),
      location: data.location,
      status: data.status as any,
      link: data.link,
      standings: Array.isArray(data.standings)
        ? (data.standings as unknown[]).map(String)
        : undefined,
      label: data.label,
      rounds: Array.isArray(data.rounds) ? (data.rounds as any) : undefined,
    };
    // Runtime-validate with zod; throws on invalid data
    return Event.parse(parsed);
  },
};

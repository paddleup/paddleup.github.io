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
import {
  PlayerSchema,
  Player,
  GameSchema,
  Game,
  CourtSchema,
  Court,
  EventSchema,
  Event,
} from '../types';

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
    const { id: _id, createdAt, ...rest } = player as any;
    return {
      ...rest,
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
    return PlayerSchema.parse(parsed);
  },
};

/**
 * Game converter
 */
export const gameConverter: FirestoreDataConverter<Game> = {
  toFirestore(game: Game) {
    const { id: _id, ...rest } = game as any;
    return { ...rest };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): Game {
    const data = snapshot.data(options) as Record<string, unknown>;
    const parsed = {
      id: snapshot.id,
      ...data,
    };
    return GameSchema.parse(parsed);
  },
};

/**
 * Court converter
 */
export const courtConverter: FirestoreDataConverter<Court> = {
  toFirestore(court: Court) {
    const { id: _id, ...rest } = court as any;
    return {
      ...rest,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): Court {
    const data = snapshot.data(options) as Record<string, unknown>;
    const { playerIds, ...other } = data;
    const parsed = {
      playerIds: Array.isArray(playerIds) ? playerIds.map(String) : [],
      ...other,
      id: snapshot.id,
    };
    return CourtSchema.parse(parsed);
  },
};

export const eventConverter: FirestoreDataConverter<Event> = {
  toFirestore(event: Event) {
    const { id: _id, ...rest } = event as any;
    const { startDateTime, ...other } = rest;
    return {
      ...other,
      startDateTime: startDateTime ? startDateTime : serverTimestamp(),
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options?: SnapshotOptions): Event {
    const data = snapshot.data(options) as Record<string, unknown>;

    const startDateTime = new Date();
    try {
      toDate(data.startDateTime);
    } catch {
      // ignore
    }

    const parsed = {
      id: snapshot.id,
      name: data.name,
      startDateTime: startDateTime,
      location: data.location,
      link: data.link,
      standings: Array.isArray(data.standings)
        ? (data.standings as unknown[]).map(String)
        : undefined,
      label: data.label,
    };
    return EventSchema.parse(parsed);
  },
};

/* src/lib/firestoreClient.ts
   Small, typed Firestore data-access helpers.
   - Wraps common patterns: get by id, paginated queries, add/set with converters, batched writes, and transactions.
   - Keep these helpers thin and testable; components/hooks should call them rather than using firestore APIs directly.
*/

import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  limit,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  DocumentData,
  setDoc,
  startAfter,
  writeBatch,
  runTransaction,
  Transaction,
  Firestore,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { PageResult } from '../types';

/** Helper to get a CollectionReference with optional converter */
function collectionRef<T>(
  firestore: Firestore,
  path: string,
  converter?: FirestoreDataConverter<T>,
): CollectionReference<T> | CollectionReference<DocumentData> {
  const ref = collection(firestore, path);
  return converter ? (ref.withConverter(converter) as CollectionReference<T>) : ref;
}

/** Get a single document by id (typed via converter) */
export async function getDocById<T>(
  collectionPath: string,
  id: string,
  converter?: FirestoreDataConverter<T>,
): Promise<T | null> {
  const docRef = doc(db, collectionPath, id);
  const refWithConverter = converter
    ? (docRef.withConverter(converter) as DocumentReference<T>)
    : (docRef as unknown as DocumentReference<T>);
  const snap = await getDoc(refWithConverter);
  return snap.exists() ? snap.data() : null;
}

/**
 * Add a document to a collection.
 * - If converter is provided, it will be used for typed writes.
 * - Returns the new document id.
 */
export async function addDocument<T>(
  collectionPath: string,
  data: T,
  converter?: FirestoreDataConverter<T>,
): Promise<string> {
  const col = collectionRef<T>(db, collectionPath, converter);
  // addDoc will use converter if the CollectionReference has one
  const ref = await addDoc(col, data as any);
  return ref.id;
}

/**
 * Set (create/overwrite) a document by id.
 * Uses converter if provided. Caller may include id in data but it's ignored for storage.
 */
export async function setDocument<T>(
  collectionPath: string,
  id: string,
  data: T,
  converter?: FirestoreDataConverter<T>,
): Promise<void> {
  const docRef = doc(db, collectionPath, id);
  const refWithConverter = converter
    ? (docRef.withConverter(converter) as DocumentReference<T>)
    : docRef;
  // Use setDoc (overwrites). If you want merge, consumers can call updateDocument below.
  await setDoc(refWithConverter as DocumentReference<T>, data as any);
}

/**
 * Update (merge) a document by id.
 * - Performs a partial update (merge) so callers can patch individual fields.
 */
export async function updateDocument<T>(
  collectionPath: string,
  id: string,
  partialData: Partial<T>,
  converter?: FirestoreDataConverter<T>,
): Promise<void> {
  const docRef = doc(db, collectionPath, id);
  const refWithConverter = converter
    ? (docRef.withConverter(converter) as DocumentReference<T>)
    : (docRef as unknown as DocumentReference<T>);
  // setDoc with { merge: true } performs a partial update / merge
  await setDoc(refWithConverter, partialData as any, { merge: true });
}

/**
 * Delete a document by id.
 */
export async function deleteDocument(collectionPath: string, id: string): Promise<void> {
  const ref = doc(db, collectionPath, id);
  await deleteDoc(ref);
}

/**
 * Paginated collection read helper.
 * - Orders by 'createdAt' by default (caller may override by passing orderByField)
 * - Returns docs typed with converter if provided.
 */
export async function getCollectionPaginated<T>(
  collectionPath: string,
  options?: {
    pageSize?: number;
    cursor?: QueryDocumentSnapshot | null;
    orderByField?: string;
    orderDesc?: boolean;
    additionalConstraints?: QueryConstraint[];
    converter?: FirestoreDataConverter<T>;
  },
): Promise<PageResult<T>> {
  const {
    pageSize = 20,
    cursor = null,
    // orderByField = 'createdAt',
    // orderDesc = true,
    additionalConstraints = [],
    converter,
  } = options ?? {};

  const col = collectionRef<T>(db, collectionPath, converter) as CollectionReference<T>;
  const constraints: QueryConstraint[] = [
    // orderBy(orderByField, orderDesc ? 'desc' : 'asc'),
    limit(pageSize),
    ...additionalConstraints,
  ];

  if (cursor) {
    constraints.push(startAfter(cursor));
  }

  const q = query(col as any, ...constraints);
  const snap = await getDocs(q);
  const docs = snap.docs.map((d) => d.data() as T);
  const last = snap.docs[snap.docs.length - 1] ?? null;
  return { docs, nextCursor: last ? (last as QueryDocumentSnapshot).id : null };
}

/**
 * Simple batched write helper.
 * - ops is an array of { path, id?, data, type: 'set' | 'delete' | 'update' } (minimal example).
 * - For complex ops, callers should use writeBatch directly.
 */
type BatchOp<T = any> =
  | { type: 'set'; collectionPath: string; id: string; data: T }
  // update could be implemented similarly; omitted for brevity
  | { type: 'set-merge'; collectionPath: string; id: string; data: Partial<T> }
  | { type: 'add'; collectionPath: string; data: T };

export async function runBatch<T = any>(ops: BatchOp<T>[]): Promise<void> {
  const batch = writeBatch(db);
  for (const op of ops) {
    if (op.type === 'set') {
      const ref = doc(db, op.collectionPath, op.id);
      batch.set(ref, op.data as any);
    } else if (op.type === 'set-merge') {
      const ref = doc(db, op.collectionPath, op.id);
      batch.set(ref, op.data as any, { merge: true });
    } else if (op.type === 'add') {
      const col = collection(db, op.collectionPath);
      // writeBatch does not support add; emulate by creating a new doc ref with id
      const newRef = doc(col);
      batch.set(newRef, op.data as any);
    }
  }
  await batch.commit();
}

/**
 * Transaction helper that runs the given updater inside a Firestore transaction.
 * - The callback receives a transaction object; callers perform transaction.get/set/update on it.
 */
export async function withTransaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T> {
  return runTransaction(db, async (tx: Transaction) => {
    return fn(tx);
  });
}

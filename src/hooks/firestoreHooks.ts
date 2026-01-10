import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  onSnapshot,
  collection,
  doc,
  CollectionReference,
  FirestoreDataConverter,
  QuerySnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  getDocById,
  setDocument,
  getCollectionPaginated,
  addDocument,
  updateDocument,
  deleteDocument,
} from '../lib/firestoreClient';
import { eventConverter, playerConverter } from '../lib/converters';
import type { Event, Player } from '../types';

/**
 * Generic factory: useFirestoreEntity
 *
 * - Generic CRUD + react-query cache handling for a single collection.
 * - T must include optional id so we can detect create vs update.
 * - Callers may wrap this into a typed useX hook (see usePlayer below).
 */
type WithOptionalId = { id?: string | null };

/**
 * createOptimisticHandlers
 * - Returns a set of onMutate/onError/onSettled handlers that implement a standard
 *   optimistic update pattern for a collection and single-item cache keys.
 *
 * Usage:
 *  const handlers = createOptimisticHandlers(queryClient, 'players', id)
 *  useMutation({ ..., onMutate: handlers.onMutate, onError: handlers.onError, onSettled: handlers.onSettled })
 */
function createOptimisticHandlers<T extends WithOptionalId>(
  queryClient: ReturnType<typeof useQueryClient>,
  collectionName: string,
  id?: string,
) {
  const collectionKey = [collectionName] as const;

  // onMutate keeps the strong type (returns context)
  async function onMutate(newItem: T | Partial<T>) {
    await queryClient.cancelQueries({ queryKey: [collectionName, id] });
    const previousItem = id ? queryClient.getQueryData<T | null>([collectionName, id]) : null;
    const previousList = queryClient.getQueryData<T[] | undefined>(collectionKey);

    // Build optimistic item: if newItem contains id, use it; otherwise merge with previousItem
    const optimisticId = (newItem as any)?.id ?? id;
    const optimistic = optimisticId
      ? ({ ...(previousItem as any), ...(newItem as any), id: optimisticId } as T)
      : undefined;

    if (optimistic && optimistic.id) {
      queryClient.setQueryData([collectionName, optimistic.id], optimistic);
      queryClient.setQueryData<T[] | undefined>(collectionKey, (old) => {
        const arr = old ?? [];
        const idx = arr.findIndex((x) => x.id === optimistic.id);
        if (idx >= 0) {
          const copy = [...arr];
          copy[idx] = optimistic;
          return copy;
        }
        return [optimistic, ...arr];
      });
    }

    return { previousItem, previousList };
  }

  // Use broad signatures to be compatible with different mutation return types (void | T | string)
  function onError(...args: unknown[]) {
    // context is usually last arg for react-query handlers
    const context = args[args.length - 1] as
      | { previousItem?: T | null; previousList?: T[] | undefined }
      | undefined;
    if (context?.previousItem && id) {
      queryClient.setQueryData([collectionName, id], context.previousItem);
    }
    if (context?.previousList) {
      queryClient.setQueryData(collectionKey, context.previousList);
    } else {
      queryClient.invalidateQueries({ queryKey: collectionKey });
    }
  }

  function onSettled(...args: unknown[]) {
    // data (if any) is the first arg; could be void, string (new id), or T
    const data = args[0] as unknown;
    // If mutation returned a new id (string), refresh that item key
    if (typeof data === 'string' && data) {
      queryClient.invalidateQueries({ queryKey: [collectionName, data] });
    } else if (data && typeof data === 'object' && 'id' in (data as any)) {
      const idVal = (data as any).id as string | undefined;
      if (idVal) queryClient.invalidateQueries({ queryKey: [collectionName, idVal] });
    }
    queryClient.invalidateQueries({ queryKey: collectionKey });
  }

  return { onMutate, onError, onSettled };
}

export function useFirestoreEntity<T extends WithOptionalId>(
  collectionName: string,
  converter?: FirestoreDataConverter<T>,
  id?: string,
) {
  const queryClient = useQueryClient();
  const queryKey = [collectionName, id] as const;

  const query = useQuery<T | null>({
    queryKey,
    queryFn: async () => {
      if (!id) return null;
      return getDocById<T>(collectionName, id, converter);
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60,
  });

  const handlers = createOptimisticHandlers<T>(queryClient, collectionName, id);

  const mutation = useMutation<
    T,
    unknown,
    T,
    { previousItem?: T | null; previousList?: T[] | undefined }
  >({
    mutationFn: async (item: T) => {
      if (!item?.id) {
        const newId = await addDocument<T>(collectionName, item, converter);
        return { ...item, id: newId } as T;
      } else {
        await setDocument<T>(collectionName, item.id!, item, converter);
        return item;
      }
    },
    onMutate: handlers.onMutate,
    onError: handlers.onError,
    onSettled: handlers.onSettled,
  });

  return {
    ...query,
    upsert: mutation.mutateAsync,
    upsertState: {
      status: mutation.status,
      error: mutation.error ?? null,
    },
  };
}

export function useFirestoreEntities<T>(
  collectionName: string,
  converter?: FirestoreDataConverter<T>,
) {
  const query = useQuery<T[]>({
    queryKey: [collectionName],
    queryFn: async () => {
      const res = await getCollectionPaginated<T>(collectionName, {
        pageSize: 1000,
        converter,
      });

      console.log('useFirestoreEntities fetched', res.docs.length, 'items from', collectionName);
      return res.docs;
    },
    staleTime: 1000 * 60,
  });

  console.log('useFirestoreEntities query:', query, 'collectionName:', collectionName);
  return query;
}

export function useFirestoreCreate<T extends WithOptionalId>(
  collectionName: string,
  converter?: FirestoreDataConverter<T>,
) {
  const queryClient = useQueryClient();
  const mutation = useMutation<string, unknown, T, { previousList?: T[] | undefined }>({
    mutationFn: async (item: T) => {
      const id = await addDocument<T>(collectionName, item, converter);
      return id;
    },
    onMutate: async (item: T) => {
      await queryClient.cancelQueries({ queryKey: [collectionName] });
      const previousList = queryClient.getQueryData<T[] | undefined>([collectionName]);
      const tmpId = `__tmp__${Date.now()}`;
      const optimistic: T = { ...(item as any), id: tmpId };
      queryClient.setQueryData<T[] | undefined>([collectionName], (old) => {
        const arr = old ?? [];
        return [optimistic, ...arr];
      });
      return { previousList };
    },
    onError: (_err: unknown, _vars: T, context?: { previousList?: T[] | undefined }) => {
      if (context?.previousList) {
        queryClient.setQueryData([collectionName], context.previousList);
      } else {
        queryClient.invalidateQueries({ queryKey: [collectionName] });
      }
    },
    onSettled: (newId?: string) => {
      queryClient.invalidateQueries({ queryKey: [collectionName] });
      if (newId) queryClient.invalidateQueries({ queryKey: [collectionName, newId] });
    },
  });

  return {
    create: mutation.mutateAsync,
    status: mutation.status,
    error: mutation.error ?? null,
  };
}

export function useFirestoreUpdate<T extends WithOptionalId>(
  collectionName: string,
  converter?: FirestoreDataConverter<T>,
  id?: string,
) {
  const queryClient = useQueryClient();
  const handlers = createOptimisticHandlers<T>(queryClient, collectionName, id);

  const mutation = useMutation<
    void,
    unknown,
    Partial<T>,
    { previousItem?: T | null; previousList?: T[] | undefined }
  >({
    mutationFn: async (partial: Partial<T>) => {
      if (!id) throw new Error('id required for update');
      await updateDocument<T>(collectionName, id, partial as Partial<T>, converter);
    },
    onMutate: handlers.onMutate,
    onError: handlers.onError,
    onSettled: handlers.onSettled,
  });

  return {
    update: mutation.mutateAsync,
    status: mutation.status,
    error: mutation.error ?? null,
  };
}

export function useFirestoreDelete<T extends WithOptionalId>(collectionName: string, id?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    void,
    unknown,
    void,
    { previous?: T | null; previousList?: T[] | undefined }
  >({
    mutationFn: async () => {
      if (!id) throw new Error('id required for delete');
      await deleteDocument(collectionName, id);
    },
    onMutate: async () => {
      if (!id) return {};
      await queryClient.cancelQueries({ queryKey: [collectionName] });
      const previous = queryClient.getQueryData<T | null>([collectionName, id]);
      const previousList = queryClient.getQueryData<T[] | undefined>([collectionName]);
      if (previousList) {
        queryClient.setQueryData<T[] | undefined>(
          [collectionName],
          previousList.filter((p) => p.id !== id),
        );
      }
      queryClient.setQueryData([collectionName, id], null);
      return { previous, previousList };
    },
    onError: (
      _err: unknown,
      _vars: void,
      context?: { previous?: T | null; previousList?: T[] | undefined },
    ) => {
      if (context?.previous && id) {
        queryClient.setQueryData([collectionName, id], context.previous);
      }
      if (context?.previousList) {
        queryClient.setQueryData([collectionName], context.previousList);
      } else {
        queryClient.invalidateQueries({ queryKey: [collectionName] });
      }
    },
    onSettled: () => {
      if (id) queryClient.invalidateQueries({ queryKey: [collectionName, id] });
      queryClient.invalidateQueries({ queryKey: [collectionName] });
    },
  });

  return {
    remove: mutation.mutateAsync,
    status: mutation.status,
    error: mutation.error ?? null,
  };
}

export function useFirestoreRealtimeEntity<T>(
  collectionName: string,
  converter?: FirestoreDataConverter<T>,
  id?: string,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);
  const [prevId, setPrevId] = useState(id);

  if (id !== prevId) {
    setPrevId(id);
    setError(null);
    if (!id) {
      setData(null);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }

  useEffect(() => {
    if (!id) return;
    const colRef = collection(db, collectionName) as CollectionReference<any>;
    const q = converter
      ? (colRef.withConverter(converter) as unknown as CollectionReference<T>)
      : (colRef as unknown as CollectionReference<T>);
    const docRef = doc(q, id);
    const unsub = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setData(docSnap.data() as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err: unknown) => {
        setError(err as Error);
        setLoading(false);
      },
    );
    return () => {
      unsub();
    };
  }, [collectionName, id, converter]);
  return { data, loading, error };
}

export function useFirestoreRealtimeEntities<T>(
  collectionName: string,
  converter?: FirestoreDataConverter<T>,
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [prevCollection, setPrevCollection] = useState(collectionName);

  if (collectionName !== prevCollection) {
    setPrevCollection(collectionName);
    setError(null);
    setLoading(true);
  }

  useEffect(() => {
    const colRef = collection(db, collectionName) as CollectionReference<any>;
    const q = converter
      ? (colRef.withConverter(converter) as unknown as CollectionReference<T>)
      : (colRef as unknown as CollectionReference<T>);
    const unsub = onSnapshot(
      q as any,
      (querySnap: QuerySnapshot<any>) => {
        const items = querySnap.docs.map((doc) => doc.data() as T);
        setData(items);
        setLoading(false);
      },
      (err: unknown) => {
        setError(err as Error);
        setLoading(false);
      },
    );
    return () => {
      unsub();
    };
  }, [collectionName, converter]);

  return { data, loading, error };
}

export function createEntityHooks<T extends WithOptionalId>(
  collectionName: string,
  converter?: FirestoreDataConverter<T>,
) {
  function useEntity(id?: string) {
    return useFirestoreEntity<T>(collectionName, converter, id);
  }

  function useEntities() {
    return useFirestoreEntities<T>(collectionName, converter);
  }

  function useCreate() {
    return useFirestoreCreate<T>(collectionName, converter);
  }

  function useUpdate(id?: string) {
    return useFirestoreUpdate<T>(collectionName, converter, id);
  }

  function useDelete(id?: string) {
    return useFirestoreDelete<T>(collectionName, id);
  }

  function useEntityRealtime(id?: string) {
    return useFirestoreRealtimeEntity<T>(collectionName, converter, id);
  }

  function useEntitiesRealtime() {
    return useFirestoreRealtimeEntities<T>(collectionName, converter);
  }

  return {
    useEntity,
    useEntities,
    useCreate,
    useUpdate,
    useDelete,
    useEntityRealtime,
    useEntitiesRealtime,
  };
}

export const {
  useEntity: usePlayer,
  useEntities: usePlayers,
  useCreate: useCreatePlayer,
  useUpdate: useUpdatePlayer,
  useDelete: useDeletePlayer,
  useEntitiesRealtime: usePlayersRealtime,
  useEntityRealtime: usePlayerRealtime,
} = createEntityHooks<Player>('players', playerConverter);

export const {
  useEntity: useEvent,
  useEntities: useEvents,
  useCreate: useCreateEvent,
  useUpdate: useUpdateEvent,
  useDelete: useDeleteEvent,
  useEntitiesRealtime: useEventsRealtime,
  useEntityRealtime: useEventRealtime,
} = createEntityHooks<Event>('events', eventConverter);

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Court } from './useMatchCalculator';

import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
  Firestore,
} from 'firebase/firestore';

type RemoteMatchDoc = {
  courts?: Court[];
  round?: 1 | 2 | 3;
  updatedAt?: any;
  lastWriterId?: string;
};

type UseRealtimeMatchResult = {
  data: RemoteMatchDoc | null;
  write: (payload: Partial<RemoteMatchDoc>) => Promise<void>;
  connected: boolean;
  pending: boolean;
};

/**
 * Minimal Firestore-backed realtime hook for a single live match document.
 *
 * Requirements:
 * - Provide Vite env vars: VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN,
 *   VITE_FIREBASE_PROJECT_ID, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID
 *
 * Notes:
 * - This is deliberately small: last-write-wins semantics via setDoc({ merge: true }).
 * - If required env vars are not present, the hook becomes a no-op (works in dev without infra).
 */

function getFirebaseDb(): Firestore | null {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const appId = import.meta.env.VITE_FIREBASE_APP_ID;
  const messagingSenderId = import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID;

  if (!apiKey || !projectId || !authDomain || !appId || !messagingSenderId) {
    return null;
  }

  if (!getApps().length) {
    initializeApp({
      apiKey,
      authDomain,
      projectId,
      appId,
      messagingSenderId,
    } as any);
  }

  // lazy import to avoid bundling errors if not configured
  return getFirestore();
}

export function useRealtimeMatch(matchId: string | null): UseRealtimeMatchResult {
  const db = getFirebaseDb();
  const [data, setData] = useState<RemoteMatchDoc | null>(null);
  const [connected, setConnected] = useState(false);
  const pendingRef = useRef(false);
  const writeTimerRef = useRef<number | null>(null);
  const lastWriteIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!db || !matchId) {
      setConnected(false);
      setData(null);
      return;
    }
    const ref = doc(db, 'matches', matchId);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setData(null);
          setConnected(true);
          return;
        }
        const d = snap.data() as RemoteMatchDoc;
        setData(d);
        setConnected(true);
      },
      (err) => {
        console.error('Realtime match listener error', err);
        setConnected(false);
      },
    );
    return () => {
      unsub();
    };
  }, [db, matchId]);

  const write = useCallback(
    async (payload: Partial<RemoteMatchDoc>) => {
      if (!db || !matchId) return;
      // debounce writes slightly to avoid extremely chatty updates
      if (writeTimerRef.current) {
        window.clearTimeout(writeTimerRef.current);
        writeTimerRef.current = null;
      }

      pendingRef.current = true;

      // Small debounce window
      await new Promise<void>((res) => {
        writeTimerRef.current = window.setTimeout(async () => {
          try {
            const ref = doc(db, 'matches', matchId);
            const writerId = 'client-' + Math.random().toString(36).slice(2, 9);
            lastWriteIdRef.current = writerId;
            await setDoc(
              ref,
              {
                ...payload,
                updatedAt: serverTimestamp(),
                lastWriterId: writerId,
              } as any,
              { merge: true },
            );
          } catch (e) {
            console.error('Failed to write match document', e);
          } finally {
            pendingRef.current = false;
            writeTimerRef.current = null;
            res();
          }
        }, 150);
      });
    },
    [db, matchId],
  );

  return {
    data,
    write,
    connected,
    pending: pendingRef.current,
  };
}

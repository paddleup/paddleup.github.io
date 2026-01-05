/* src/lib/firebase.ts
   Firebase (modular SDK) initialization for a Vite + React + TypeScript app.

   - Uses VITE_ env vars (Vite requires the VITE_ prefix for client-side env).
   - Initializes app once (safe for HMR).
   - Exports app, db, auth.
   - Optional emulator connection when VITE_USE_FIREBASE_EMULATOR === 'true'.
   - Enables IndexedDB persistence in the browser when available.
*/

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  enableIndexedDbPersistence,
  connectFirestoreEmulator,
  Firestore,
} from 'firebase/firestore';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app: FirebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

// Enable IndexedDB persistence when running in the browser.
// Safe-guarded for environments that don't support it (SSR, older browsers, multiple tabs).
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    // Common failure reasons: multiple tabs, browser not supported, or IndexedDB blocked.
    // App should continue to work without persistence.
    // Keep message DEBUG-level to avoid noisy logs in production.
    // eslint-disable-next-line no-console
    console.debug('IndexedDB persistence not enabled:', err?.code ?? err?.message ?? err);
  });
}

// Optional: connect to local Firebase emulator when developing locally.
// Set VITE_USE_FIREBASE_EMULATOR = 'true' in .env.local and optionally ports/host.
// Defaults: Firestore 8080, Auth 9099
if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  const host = import.meta.env.VITE_FIREBASE_EMULATOR_HOST ?? 'localhost';
  const firestorePort = Number(import.meta.env.VITE_FIREBASE_EMULATOR_FIRESTORE_PORT ?? 8080);
  const authPort = Number(import.meta.env.VITE_FIREBASE_EMULATOR_AUTH_PORT ?? 9099);

  try {
    connectFirestoreEmulator(db, host, firestorePort);
    connectAuthEmulator(auth, `http://${host}:${authPort}`, { disableWarnings: true });
    // eslint-disable-next-line no-console
    console.debug('Connected to Firebase emulators', { host, firestorePort, authPort });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to connect to Firebase emulators', e);
  }
}

export { app, db, auth };

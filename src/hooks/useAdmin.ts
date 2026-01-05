// useAdmin.tsx
import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase.ts';
import { onAuthStateChanged, User } from 'firebase/auth';

export function useAdmin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Subscribe to auth state
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      // Force refresh so newly-set claims propagate
      const tokenResult = await u.getIdTokenResult(true);
      const claims = tokenResult.claims as Record<string, unknown>;
      setIsAdmin(Boolean(claims.admin === true));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { user, isAdmin, loading };
}

// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface UseAuthResult {
  user: null;
  loading: boolean;
}

/**
 * Custom hook that tracks the current Firebase user
 */
export default function useAuth(): UseAuthResult {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe; // Cleanup on unmount
  }, []);

  return { user, loading };
}

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  startTransition,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { User, SEED_USERS } from "./seed-users";
import {
  DEV_AUTH_COOKIE_NAME,
  getSeedUserById,
  getUserIdFromCookieString,
} from "./auth-session";

// ============================================================
// FAKE AUTH — for development only
// ============================================================
// This provides a simple way to "log in" as one of the seed users
// without needing real OAuth credentials. When you're ready to add
// real authentication (e.g., GitHub login via NextAuth.js), replace
// this file. The rest of the app just calls useAuth().
//
// Login state is persisted in a cookie so it survives page refreshes
// AND is readable by API routes on the server side. This means your
// API routes can call getAuthUserId(request) from auth-session.ts
// to know who's making the request.
//
// ⚠️  This ONLY works in development. If NODE_ENV is "production"
//     and no real auth is configured, the app will throw an error.
// ============================================================

if (
  typeof window !== "undefined" &&
  process.env.NODE_ENV === "production" &&
  !process.env.NEXT_PUBLIC_REAL_AUTH
) {
  console.error(
    "🚨 Fake auth is enabled in production! Set NEXT_PUBLIC_REAL_AUTH=true " +
      "and replace this file with a real auth provider before deploying."
  );
}

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Restore login state from cookie on page load
  useEffect(() => {
    const cookieUserId = getUserIdFromCookieString(document.cookie);
    const cookieUser = getSeedUserById(cookieUserId);
    if (cookieUser) {
      setUser(cookieUser);
    }
  }, []);

  const login = (user: User) => {
    // Save to cookie so API routes can read it
    document.cookie =
      `${DEV_AUTH_COOKIE_NAME}=${encodeURIComponent(user.id)}; ` +
      "path=/; max-age=2592000; samesite=lax";
    setUser(user);
    startTransition(() => {
      router.refresh();
    });
  };

  const logout = () => {
    // Clear the cookie
    document.cookie =
      `${DEV_AUTH_COOKIE_NAME}=; path=/; max-age=0; samesite=lax`;
    setUser(null);
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Re-export for convenience
export { SEED_USERS };
export type { User };

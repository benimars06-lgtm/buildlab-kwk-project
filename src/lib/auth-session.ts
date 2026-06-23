// ============================================================
// AUTH SESSION — cookie-based auth helpers
// ============================================================
// These helpers let both client components and API routes
// identify the currently logged-in user via a cookie.
//
// Client side: auth.tsx sets/reads the cookie on login/logout.
// Server side: API routes can call getAuthUserId(request) to
// get the current user's ID from the cookie.
// ============================================================

import { SEED_USERS } from "./seed-users";

export const DEV_AUTH_COOKIE_NAME = "community-hub-user-id";

/**
 * Find a seed user by their ID.
 * Returns null if the ID doesn't match any seed user.
 */
export function getSeedUserById(userId: string | null | undefined) {
  if (!userId) return null;
  return SEED_USERS.find((user) => user.id === userId) ?? null;
}

/**
 * Extract the user ID from a cookie string (e.g., document.cookie).
 * Returns null if the auth cookie isn't present.
 */
export function getUserIdFromCookieString(cookieString: string) {
  const cookie = cookieString
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${DEV_AUTH_COOKIE_NAME}=`));

  if (!cookie) return null;

  const [, value] = cookie.split("=");
  return value ? decodeURIComponent(value) : null;
}

/**
 * Get the logged-in user's ID from a Next.js API request.
 * Use this in your API route handlers:
 *
 *   const userId = getAuthUserId(request);
 *   if (!userId) return Response.json({ error: "Not logged in" }, { status: 401 });
 */
export function getAuthUserId(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") ?? "";
  return getUserIdFromCookieString(cookieHeader);
}

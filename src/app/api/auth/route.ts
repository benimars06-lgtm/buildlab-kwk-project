import { NextResponse } from "next/server";

// ============================================================
// AUTH API — placeholder
// ============================================================
// This is a placeholder for when you add real authentication.
// Right now, auth is handled client-side via the AuthProvider
// in src/lib/auth.tsx (fake dev-mode login).
//
// When you're ready to add real GitHub OAuth:
// 1. Install next-auth: npm install next-auth
// 2. Replace this file with the NextAuth.js route handler
// 3. Update the AuthProvider to use NextAuth's useSession()
// ============================================================

export async function GET() {
  return NextResponse.json({
    message: "Auth is currently in dev mode. See src/lib/auth.tsx.",
  });
}

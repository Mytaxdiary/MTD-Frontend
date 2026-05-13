/**
 * Token storage constants.
 *
 * With the httpOnly cookie approach the backend (NestJS) sets and clears
 * the access/refresh cookies directly on auth responses.  The browser
 * handles everything automatically — the frontend does NOT read, write,
 * or delete these cookies.
 *
 * TOKEN_KEYS is kept here so the server-side checkAuth (protectedRoute.ts)
 * can look up the cookie name via next/headers without importing a magic
 * string from two different places.
 */
export const TOKEN_KEYS = {
  access: 'mtd_at',
  refresh: 'mtd_rt',
} as const

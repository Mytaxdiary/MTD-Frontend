// Protected route helpers
// TODO: Replace mock checkAuth with a real session/token check when backend auth is ready

export const PUBLIC_ROUTES = ['/login'] as const
export const DEFAULT_LOGIN_ROUTE = '/login'
export const DEFAULT_APP_ROUTE = '/'

/**
 * Checks whether the current request is authenticated.
 * Returns true (mock) — swap this with real logic later.
 * TODO: Verify JWT / cookie / server-side session here.
 */
export async function checkAuth(): Promise<boolean> {
  // TODO: Replace with real auth check (e.g. verify JWT from cookie, call /api/me)
  return true
}

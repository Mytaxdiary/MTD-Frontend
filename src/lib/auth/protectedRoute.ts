import { cookies } from 'next/headers'
import { TOKEN_KEYS } from './tokenStorage'

export const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/check-email',
  '/verify-email',
] as const

export const DEFAULT_LOGIN_ROUTE = '/login'
export const DEFAULT_APP_ROUTE = '/'

/**
 * Server-side auth check used by the protected layout.
 *
 * Reads mtd_session — a lightweight non-httpOnly cookie set by the frontend
 * after a successful login/register. This cookie lives on the frontend domain
 * so Next.js can read it server-side.
 *
 * The actual token security is enforced by the backend on every API call
 * (httpOnly cookies mtd_at / mtd_rt). This check is purely for routing.
 */
export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(TOKEN_KEYS.session)
  return !!session?.value
}

import { cookies } from 'next/headers'
import { TOKEN_KEYS, type SessionKind } from './tokenStorage'

export const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/check-email',
  '/verify-email',
  '/accept-invite',
  '/admin/login',
  '/billing/paywall',
] as const

export const DEFAULT_LOGIN_ROUTE = '/login'
export const DEFAULT_APP_ROUTE = '/'
export const DEFAULT_ADMIN_ROUTE = '/admin'
export const DEFAULT_ADMIN_LOGIN_ROUTE = '/admin/login'

/**
 * Server-side auth check used by the protected layout.
 * Reads mtd_session — lightweight non-httpOnly cookie (value firm|admin|1 legacy).
 */
export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(TOKEN_KEYS.session)
  return !!session?.value
}

export async function getSessionKind(): Promise<SessionKind | null> {
  const cookieStore = await cookies()
  const value = cookieStore.get(TOKEN_KEYS.session)?.value
  if (value === 'admin') return 'admin'
  if (value === 'firm' || value === '1') return 'firm'
  return null
}

export async function checkAdminAuth(): Promise<boolean> {
  return (await getSessionKind()) === 'admin'
}

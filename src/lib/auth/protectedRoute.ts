import { cookies } from 'next/headers'
import { TOKEN_KEYS } from './tokenStorage'

export const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'] as const

export const DEFAULT_LOGIN_ROUTE = '/login'
export const DEFAULT_APP_ROUTE = '/'

/**
 * Server-side auth check used by the protected layout.
 * Reads the access token cookie set by the frontend after login/register.
 * Returns false (→ redirect to /login) if the cookie is missing.
 *
 * Note: this is a presence check only. JWT signature verification
 * happens on the backend when API calls are made.
 */
export async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(TOKEN_KEYS.access)
  
  console.log('checkAuth - All cookies:', cookieStore.getAll())
  console.log('checkAuth - Looking for:', TOKEN_KEYS.access)
  console.log('checkAuth - Found token:', token?.value ? 'YES' : 'NO')
  
  return !!token?.value
}

/**
 * Token storage constants.
 *
 * Backend sets mtd_at and mtd_rt as httpOnly cookies on its own domain.
 * Next.js server-side (checkAuth) cannot read cross-domain httpOnly cookies.
 *
 * Solution: after login/register the frontend sets a lightweight non-httpOnly
 * session indicator cookie (mtd_session=1) on the frontend domain.
 * checkAuth() reads this cookie — it carries NO sensitive data, just signals
 * "a session exists". Real security is enforced by the backend on every API call.
 */
export const TOKEN_KEYS = {
  access: 'mtd_at',
  refresh: 'mtd_rt',
  session: 'mtd_session',
} as const

const IS_PROD = process.env.NODE_ENV === 'production'
const SECURE_FLAG = IS_PROD ? '; Secure' : ''
const SESSION_MAX_AGE = 60 * 60 * 24 // 1 day

/** Call this after a successful login or register response. */
export function setSessionCookie(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${TOKEN_KEYS.session}=1; path=/; max-age=${SESSION_MAX_AGE}; SameSite=Lax${SECURE_FLAG}`
}

/** Call this on logout. */
export function clearSessionCookie(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${TOKEN_KEYS.session}=; path=/; max-age=0; SameSite=Lax`
}

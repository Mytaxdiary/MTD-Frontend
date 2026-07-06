const IS_PROD = process.env.NODE_ENV === 'production'
const SECURE_FLAG = IS_PROD ? '; Secure' : ''
// Use SameSite=None in production so this cookie is readable across cloud subdomains.
// SameSite=None requires Secure, which is set above for production.
const SAME_SITE = IS_PROD ? 'None' : 'Lax'
const SESSION_MAX_AGE = 60 * 60 * 24 // 24 hours

export const PORTAL_SESSION_KEY = 'mtd_cp_session'

export function setPortalSessionCookie(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${PORTAL_SESSION_KEY}=1; path=/portal; max-age=${SESSION_MAX_AGE}; SameSite=${SAME_SITE}${SECURE_FLAG}`
}

export function clearPortalSessionCookie(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${PORTAL_SESSION_KEY}=; path=/portal; max-age=0; SameSite=${SAME_SITE}${SECURE_FLAG}`
}

const NO_RETRY_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/session',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
] as const

/** Match axios config.url against auth routes (relative or absolute). */
export function isAuthRoute(url: string | undefined): boolean {
  if (!url) return false
  return NO_RETRY_PATHS.some((path) => url.includes(path))
}

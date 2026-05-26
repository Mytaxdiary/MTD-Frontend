import { getAccessTokenExpiry } from './accessTokenExpiry'

const REFRESH_BUFFER_MS = 60_000

export type RefreshHandler = () => Promise<void>

/**
 * Schedules a silent refresh shortly before the access token expires.
 * Returns a cancel function (call on unmount).
 */
export function scheduleAccessTokenRefresh(onRefresh: RefreshHandler): () => void {
  if (typeof window === 'undefined') return () => {}

  const expiresAt = getAccessTokenExpiry()
  if (!expiresAt) return () => {}

  const delay = new Date(expiresAt).getTime() - Date.now() - REFRESH_BUFFER_MS

  const timerId = window.setTimeout(
    () => {
      void onRefresh().finally(() => {
        scheduleAccessTokenRefresh(onRefresh)
      })
    },
    Math.max(delay, 0),
  )

  return () => window.clearTimeout(timerId)
}

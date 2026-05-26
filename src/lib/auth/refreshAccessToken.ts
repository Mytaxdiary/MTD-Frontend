import refreshClient from '@/lib/api/refreshClient'
import { setAccessTokenExpiry } from './accessTokenExpiry'
import { setSessionCookie } from './tokenStorage'

interface RefreshPayload {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: string
}

/**
 * Calls POST /auth/refresh and updates stored expiry + session indicator.
 * Uses a separate axios instance (no 401 retry interceptor).
 */
export async function refreshAccessToken(): Promise<RefreshPayload> {
  const { data } = await refreshClient.post<{
    success: boolean
    data: RefreshPayload
  }>('/auth/refresh')

  const payload = data.data
  setAccessTokenExpiry(payload.accessTokenExpiresAt)
  setSessionCookie()
  return payload
}

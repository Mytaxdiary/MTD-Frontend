'use client'

import { useEffect } from 'react'
import { setAccessTokenExpiry, isAccessTokenExpiringSoon } from '@/lib/auth/accessTokenExpiry'
import { refreshAccessToken } from '@/lib/auth/refreshAccessToken'
import { scheduleAccessTokenRefresh } from '@/lib/auth/scheduleTokenRefresh'
import refreshClient from '@/lib/api/refreshClient'
import { setSessionCookie } from '@/lib/auth/tokenStorage'

/**
 * Keeps the access token fresh while the user is on protected pages:
 * - On mount: GET /auth/session (refresh if expired / expiring soon)
 * - Timer: POST /auth/refresh ~1 min before access token expiry
 * - On tab focus: refresh if expiring soon
 */
export default function TokenRefreshProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let cancelSchedule = () => {}

    const runRefresh = async () => {
      await refreshAccessToken()
    }

    const bootstrap = async () => {
      try {
        const { data } = await refreshClient.get<{
          success: boolean
          data: { accessTokenExpiresAt: string; refreshed: boolean }
        }>('/auth/session')
        setAccessTokenExpiry(data.data.accessTokenExpiresAt)
        if (data.data.refreshed) {
          setSessionCookie()
        }
      } catch {
        if (isAccessTokenExpiringSoon()) {
          try {
            await runRefresh()
          } catch {
            // 401 interceptor on API calls will redirect to login
          }
        }
      }
      cancelSchedule = scheduleAccessTokenRefresh(runRefresh)
    }

    void bootstrap()

    const onFocus = () => {
      if (isAccessTokenExpiringSoon()) {
        void runRefresh().catch(() => {})
      }
    }
    window.addEventListener('focus', onFocus)

    return () => {
      cancelSchedule()
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  return <>{children}</>
}

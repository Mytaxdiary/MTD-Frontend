import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { isAuthRoute } from './authRoutes'
import { refreshAccessToken } from '@/lib/auth/refreshAccessToken'
import { clearAccessTokenExpiry } from '@/lib/auth/accessTokenExpiry'
import { clearSessionCookie } from '@/lib/auth/tokenStorage'
import {
  collectFraudPreventionPayloadAsync,
  encodeFraudContextHeader,
} from '@/lib/hmrc/collectFraudHeaders'

type FailedRequest = {
  resolve: () => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let failedQueue: FailedRequest[] = []

function processQueue(error: unknown): void {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve()
  })
  failedQueue = []
}

function redirectToLogin(): void {
  if (typeof window === 'undefined') return
  clearAccessTokenExpiry()
  clearSessionCookie()
  const path = window.location.pathname
  if (!path.startsWith('/login') && !path.startsWith('/register')) {
    window.location.href = '/login'
  }
}

async function attachFraudContext(
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> {
  if (typeof window === 'undefined') return config
  // Auth routes do not call HMRC — skip custom header to avoid unnecessary CORS preflight
  if (isAuthRoute(config.url)) return config
  try {
    const payload = await collectFraudPreventionPayloadAsync()
    config.headers.set('X-Hmrc-Fraud-Context', encodeFraudContextHeader(payload))
  } catch {
    // Best-effort — HMRC calls still work with vendor-only headers
  }
  return config
}

export function setupInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use(attachFraudContext)

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ message?: string; statusCode?: number }>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !isAuthRoute(originalRequest.url)
      ) {
        if (isRefreshing) {
          return new Promise<void>((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then(() => client(originalRequest))
            .catch((err) => Promise.reject(err))
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          await refreshAccessToken()
          processQueue(null)
          return client(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError)
          redirectToLogin()
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      const raw = error.response?.data?.message as string | string[] | undefined
      const message =
        typeof raw === 'string'
          ? raw
          : Array.isArray(raw)
            ? raw.join(' ')
            : error.message || 'An unexpected error occurred'

      const apiError = new Error(message) as Error & { statusCode?: number }
      apiError.statusCode = error.response?.status
      return Promise.reject(apiError)
    },
  )
}

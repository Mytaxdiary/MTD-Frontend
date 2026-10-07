import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { isAuthRoute } from './authRoutes'
import { refreshAccessToken } from '@/lib/auth/refreshAccessToken'
import { clearAccessTokenExpiry } from '@/lib/auth/accessTokenExpiry'
import { clearSessionCookie } from '@/lib/auth/tokenStorage'
import {
  isBillingGateCode,
  parseBillingErrorCode,
  paywallPath,
} from '@/lib/billing/billingErrors'
import {
  collectFraudPreventionPayload,
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

function extractErrorMessage(
  data: { message?: string | string[] } | undefined,
  fallback: string,
): string {
  const raw = data?.message
  if (typeof raw === 'string') return raw
  if (Array.isArray(raw)) return raw.join(' ')
  return fallback
}

function redirectToLogin(): void {
  if (typeof window === 'undefined') return
  clearAccessTokenExpiry()
  clearSessionCookie()
  const path = window.location.pathname
  if (!path.startsWith('/login') && !path.startsWith('/register') && !path.startsWith('/billing/')) {
    window.location.href = '/login'
  }
}

function redirectToPaywall(message: string): void {
  if (typeof window === 'undefined') return
  clearAccessTokenExpiry()
  clearSessionCookie()
  const code = parseBillingErrorCode(message)
  if (!code || !isBillingGateCode(code)) {
    redirectToLogin()
    return
  }
  if (!window.location.pathname.startsWith('/billing/paywall')) {
    window.location.href = paywallPath(code, message)
  }
}

async function attachFraudContext(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  if (typeof window === 'undefined') return config
  // Auth routes do not call HMRC — skip custom header to avoid unnecessary CORS preflight
  if (isAuthRoute(config.url)) return config
  // Always attach browser payload. Missing X-Hmrc-Fraud-Context caused HMRC
  // "Header required" findings (Device-ID / Timezone / Connection-Method / …).
  try {
    const payload = await collectFraudPreventionPayloadAsync()
    config.headers.set('X-Hmrc-Fraud-Context', encodeFraudContextHeader(payload))
  } catch {
    const payload = collectFraudPreventionPayload()
    config.headers.set('X-Hmrc-Fraud-Context', encodeFraudContextHeader(payload))
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

      const billingMessage = extractErrorMessage(error.response?.data, '')
      const billingCode = parseBillingErrorCode(billingMessage)
      if (error.response?.status === 401 && billingCode && isBillingGateCode(billingCode)) {
        redirectToPaywall(billingMessage)
        return Promise.reject(error)
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

      const message = extractErrorMessage(
        error.response?.data,
        error.message || 'An unexpected error occurred',
      )

      const apiError = new Error(message) as Error & { statusCode?: number; responseData?: unknown }
      apiError.statusCode = error.response?.status
      apiError.responseData = error.response?.data
      return Promise.reject(apiError)
    }
  )
}

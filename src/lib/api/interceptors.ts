import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

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

export function setupInterceptors(client: AxiosInstance): void {
  // No request interceptor needed — browser sends httpOnly cookies automatically
  // with withCredentials: true. No manual Authorization header required.

  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ message?: string; statusCode?: number }>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

      // Attempt silent refresh on 401, but not for the refresh endpoint itself
      if (
        error.response?.status === 401 &&
        !originalRequest?._retry &&
        originalRequest?.url !== '/auth/refresh' &&
        originalRequest?.url !== '/auth/login'
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
          // Refresh token is in the httpOnly cookie — no body needed
          await client.post('/auth/refresh')
          processQueue(null)
          return client(originalRequest)
        } catch (refreshError) {
          processQueue(refreshError)
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      const raw = error.response?.data?.message
      const message =
        typeof raw === 'string'
          ? raw
          : Array.isArray(raw)
            ? raw.join(' ')
            : error.message || 'An unexpected error occurred'

      const apiError = new Error(message) as Error & { statusCode?: number }
      apiError.statusCode = error.response?.status
      return Promise.reject(apiError)
    }
  )
}

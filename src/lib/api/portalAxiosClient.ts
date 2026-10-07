import axios, { type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/lib/env'
import {
  collectFraudPreventionPayload,
  collectFraudPreventionPayloadAsync,
  encodeFraudContextHeader,
} from '@/lib/hmrc/collectFraudHeaders'

/**
 * Separate Axios instance for the Client Portal.
 * Uses a different cookie (mtd_cp_at) set by the backend on portal auth endpoints.
 */
const portalAxiosClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

async function attachFraudContext(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  if (typeof window === 'undefined') return config
  const url = config.url ?? ''
  // Portal auth does not call HMRC
  if (url.includes('/portal/login') || url.includes('/portal/setup')) return config
  try {
    const payload = await collectFraudPreventionPayloadAsync()
    config.headers.set('X-Hmrc-Fraud-Context', encodeFraudContextHeader(payload))
  } catch {
    const payload = collectFraudPreventionPayload()
    config.headers.set('X-Hmrc-Fraud-Context', encodeFraudContextHeader(payload))
  }
  return config
}

portalAxiosClient.interceptors.request.use(attachFraudContext)

portalAxiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname
      if (path.startsWith('/portal') && path !== '/portal/login') {
        window.location.href = '/portal/login'
      }
    }
    return Promise.reject(err as Error)
  }
)

export default portalAxiosClient

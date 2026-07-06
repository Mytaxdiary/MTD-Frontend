import axios from 'axios'
import { env } from '@/lib/env'

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
  },
)

export default portalAxiosClient

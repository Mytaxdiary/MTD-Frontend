import axios from 'axios'
import { env } from '@/lib/env'

/** Dedicated client for token refresh — no response interceptors (avoids refresh loops). */
const refreshClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export default refreshClient

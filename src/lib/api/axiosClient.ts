import axios from 'axios'
import { env } from '@/lib/env'
import { setupInterceptors } from './interceptors'

const axiosClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15000,
  withCredentials: true, // send/receive httpOnly cookies cross-origin
  headers: {
    'Content-Type': 'application/json',
  },
})

setupInterceptors(axiosClient)

export default axiosClient

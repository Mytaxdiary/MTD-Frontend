import axios from 'axios';
import { env } from '@/lib/env';
import { setupInterceptors } from './interceptors';

const axiosClient = axios.create({
  baseURL: env.apiBaseUrl || 'http://localhost:3500/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(axiosClient);

export default axiosClient;

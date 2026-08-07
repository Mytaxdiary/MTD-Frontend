import apiClient from '@/lib/api/axiosClient'

export type EmailProvider = 'gmail' | 'outlook'

export interface EmailConnectionStatus {
  connected: boolean
  provider?: EmailProvider
  emailAddress?: string
  status?: 'connected' | 'disconnected' | 'expired'
  connectedAt?: string
  accessTokenExpiresAt?: string
}

const PROVIDER_STORAGE_KEY = 'mtd_email_oauth_provider'

export const emailConnectionService = {
  rememberProvider(provider: EmailProvider): void {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(PROVIDER_STORAGE_KEY, provider)
    }
  },

  takeRememberedProvider(): EmailProvider | null {
    if (typeof window === 'undefined') return null
    const v = sessionStorage.getItem(PROVIDER_STORAGE_KEY)
    sessionStorage.removeItem(PROVIDER_STORAGE_KEY)
    if (v === 'gmail' || v === 'outlook') return v
    return null
  },

  async getConnectUrl(provider: EmailProvider): Promise<string> {
    const res = await apiClient.get<{ data: { authUrl: string } }>('/email/connect', {
      params: { provider },
    })
    return res.data.data.authUrl
  },

  async exchangeCode(code: string, provider: EmailProvider): Promise<EmailConnectionStatus> {
    const res = await apiClient.post<{ data: EmailConnectionStatus }>('/email/callback', {
      code,
      provider,
    })
    return res.data.data
  },

  async getStatus(): Promise<EmailConnectionStatus> {
    const res = await apiClient.get<{ data: EmailConnectionStatus }>('/email/status')
    return res.data.data
  },

  async refreshToken(): Promise<EmailConnectionStatus> {
    const res = await apiClient.post<{ data: EmailConnectionStatus }>('/email/refresh-token')
    return res.data.data
  },

  async disconnect(): Promise<void> {
    await apiClient.delete('/email/disconnect')
  },
}

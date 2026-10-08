import apiClient from '@/lib/api/axiosClient'

export interface BillingQuote {
  billableClients: number
  includedClients: number
  extraClients: number
  baseGbp: number
  extrasGbp: number
  bands: Array<{
    fromClient: number
    toClient: number
    count: number
    rateGbp: number
    subtotalGbp: number
  }>
  totalExVatGbp: number
  allowance: number
  billingStatus: string
  trialStartsAt: string | null
  trialEndsAt: string | null
  nextRenewalAt: string | null
  hasStripeCustomer: boolean
}

export const billingService = {
  async getQuote(): Promise<BillingQuote> {
    const res = await apiClient.get<{ data: BillingQuote }>('/billing/quote')
    return res.data.data
  },

  async createCheckoutSession(): Promise<{ url: string }> {
    const res = await apiClient.post<{ data: { url: string } }>('/billing/checkout')
    return res.data.data
  },

  async createPortalSession(): Promise<{ url: string }> {
    const res = await apiClient.post<{ data: { url: string } }>('/billing/portal')
    return res.data.data
  },
}

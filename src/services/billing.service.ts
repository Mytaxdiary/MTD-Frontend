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
}

export const billingService = {
  async getQuote(): Promise<BillingQuote> {
    const res = await apiClient.get<{ data: BillingQuote }>('/billing/quote')
    return res.data.data
  },
}

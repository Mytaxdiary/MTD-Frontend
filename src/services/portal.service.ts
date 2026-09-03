import portalAxiosClient from '@/lib/api/portalAxiosClient'

export interface PortalMe {
  name: string
  nino?: string
  agentType: string
  invitationStatus: string
  authorisedAt?: string
  portalOnly?: boolean
  utr?: string
  firmName: string
  firmEmail: string
  isPreview: boolean
}

export interface PortalObligationPeriod {
  periodStartDate: string
  periodEndDate: string
  dueDate: string
  receivedDate?: string
  status: string
  periodKey?: string
}

export interface PortalBusinessQuarterly {
  businessId: string
  typeOfBusiness: string
  label: string
  periods: PortalObligationPeriod[]
}

export interface PortalObligation {
  typeOfBusiness?: string
  businessId?: string
  obligations?: PortalObligationPeriod[]
  obligationDetails?: PortalObligationPeriod[]
}

export interface PortalLiabilityRow {
  documentId?: string
  taxYear?: string
  label: string
  dueDate: string | null
  outstandingAmount: number
  originalAmount: number | null
  status: 'paid' | 'upcoming' | 'overdue'
  deadline: 'january' | 'july' | 'other'
}

export interface PortalPaymentDeadlineGroup {
  label: string
  amount: number
  items: PortalLiabilityRow[]
}

export interface PortalPaymentDetails {
  sortCode: string
  accountNumber: string
  reference: string
  hasUtr: boolean
  amountDue: number | null
  overdueAmount: number | null
  payOnlineUrl: string
}

export interface PortalLiabilitiesResponse {
  message?: string
  balanceDetails?: {
    payableAmount?: number
    overdueAmount?: number
    totalBalance?: number
    pendingChargeDueAmount?: number
  } | null
  liabilities?: PortalLiabilityRow[]
  paymentDeadlines?: {
    january: PortalPaymentDeadlineGroup | null
    july: PortalPaymentDeadlineGroup | null
  }
  paymentDetails?: PortalPaymentDetails | null
}

export interface PortalMessage {
  id: string
  subject: string
  body: string
  sender?: 'agent' | 'client'
  readAt?: string
  createdAt: string
}

export interface PortalFileRecord {
  id: string
  originalName: string
  mimeType: string
  size: number
  viewedByAgent: boolean
  createdAt: string
}

const portalService = {
  async setup(token: string, password: string): Promise<{ name: string }> {
    const res = await portalAxiosClient.post<{ data: { name: string } }>('/portal/auth/setup', {
      token,
      password,
    })
    return res.data.data
  },

  async login(email: string, password: string): Promise<{ name: string }> {
    const res = await portalAxiosClient.post<{ data: { name: string } }>('/portal/auth/login', {
      email,
      password,
    })
    return res.data.data
  },

  async logout(): Promise<void> {
    await portalAxiosClient.post('/portal/auth/logout')
  },

  async getMe(): Promise<PortalMe> {
    const res = await portalAxiosClient.get<{ data: PortalMe }>('/portal/me')
    return res.data.data
  },

  async getObligations(): Promise<{
    obligations: PortalObligation[]
    businesses?: PortalBusinessQuarterly[]
    message?: string
  }> {
    const res = await portalAxiosClient.get<{
      data: {
        obligations: PortalObligation[]
        businesses?: PortalBusinessQuarterly[]
        message?: string
      }
    }>('/portal/obligations')
    return res.data.data
  },

  async getLiabilities(): Promise<PortalLiabilitiesResponse> {
    const res = await portalAxiosClient.get<{ data: PortalLiabilitiesResponse }>('/portal/liabilities')
    return res.data.data
  },

  async getItsaStatus(): Promise<{ itsaStatuses?: unknown[]; message?: string }> {
    const res = await portalAxiosClient.get<{
      data: { itsaStatuses?: unknown[]; message?: string }
    }>('/portal/itsa-status')
    return res.data.data
  },

  async getSubmissions(): Promise<{
    taxYear?: string
    totalIncome?: number
    totalExpenses?: number
    netProfit?: number
    netLoss?: number
    businesses?: unknown[]
    message?: string
  }> {
    const res = await portalAxiosClient.get<{ data: Record<string, unknown> }>('/portal/submissions')
    return res.data.data
  },

  async getMessages(): Promise<PortalMessage[]> {
    const res = await portalAxiosClient.get<{ data: PortalMessage[] }>('/portal/messages')
    return res.data.data
  },

  async sendMessage(body: string, subject?: string): Promise<PortalMessage> {
    const res = await portalAxiosClient.post<{ data: PortalMessage }>('/portal/messages', {
      body,
      subject,
    })
    return res.data.data
  },

  async getUnreadCount(): Promise<number> {
    const res = await portalAxiosClient.get<{ data: { count: number } }>(
      '/portal/messages/unread-count'
    )
    return res.data.data.count
  },

  async markRead(id: string): Promise<void> {
    await portalAxiosClient.patch(`/portal/messages/${id}/read`)
  },

  async uploadFile(file: File): Promise<PortalFileRecord> {
    const form = new FormData()
    form.append('file', file)
    const res = await portalAxiosClient.post<{ data: PortalFileRecord }>('/portal/files', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.data
  },

  async getFiles(): Promise<PortalFileRecord[]> {
    const res = await portalAxiosClient.get<{ data: PortalFileRecord[] }>('/portal/files')
    return res.data.data
  },

  downloadFileUrl(fileId: string): string {
    const base =
      typeof window !== 'undefined'
        ? (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3500/api/v1')
        : 'http://localhost:3500/api/v1'
    return `${base}/portal/files/${fileId}/download`
  },
}

export default portalService

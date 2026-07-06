import portalAxiosClient from '@/lib/api/portalAxiosClient'

export interface PortalMe {
  name: string
  nino: string
  agentType: string
  invitationStatus: string
  authorisedAt?: string
  firmName: string
  firmEmail: string
  isPreview: boolean
}

export interface PortalObligation {
  typeOfBusiness?: string
  businessId?: string
  obligations?: Array<{
    periodStartDate: string
    periodEndDate: string
    dueDate: string
    receivedDate?: string
    status: string
    periodKey: string
  }>
}

export interface PortalLiabilityLine {
  taxYear?: string
  documentId?: string
  documentText?: string
  documentDueDate?: string
  documentOutstandingAmount?: number
  documentDescription?: string
}

export interface PortalMessage {
  id: string
  subject: string
  body: string
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
    const res = await portalAxiosClient.post<{ data: { name: string } }>('/portal/auth/setup', { token, password })
    return res.data.data
  },

  async login(email: string, password: string): Promise<{ name: string }> {
    const res = await portalAxiosClient.post<{ data: { name: string } }>('/portal/auth/login', { email, password })
    return res.data.data
  },

  async logout(): Promise<void> {
    await portalAxiosClient.post('/portal/auth/logout')
  },

  async getMe(): Promise<PortalMe> {
    const res = await portalAxiosClient.get<{ data: PortalMe }>('/portal/me')
    return res.data.data
  },

  async getObligations(): Promise<{ obligations: PortalObligation[]; message?: string }> {
    const res = await portalAxiosClient.get<{ data: { obligations: PortalObligation[]; message?: string } }>('/portal/obligations')
    return res.data.data
  },

  async getLiabilities(): Promise<{ balanceDetails?: unknown; message?: string }> {
    const res = await portalAxiosClient.get<{ data: { balanceDetails?: unknown; message?: string } }>('/portal/liabilities')
    return res.data.data
  },

  async getMessages(): Promise<PortalMessage[]> {
    const res = await portalAxiosClient.get<{ data: PortalMessage[] }>('/portal/messages')
    return res.data.data
  },

  async getUnreadCount(): Promise<number> {
    const res = await portalAxiosClient.get<{ data: { count: number } }>('/portal/messages/unread-count')
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
    const base = typeof window !== 'undefined'
      ? (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3500/api/v1')
      : 'http://localhost:3500/api/v1'
    return `${base}/portal/files/${fileId}/download`
  },
}

export default portalService

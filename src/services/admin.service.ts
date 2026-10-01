import axiosClient from '@/lib/api/axiosClient'

export interface AdminOverviewStats {
  totalFirms: number
  activeFirms: number
  inactiveFirms: number
  newSignupsThisWeek: number
  newSignupsThisMonth: number
  openEnquiries: number
}

export interface AdminFirmListItem {
  id: string
  firmName: string
  ownerEmail: string | null
  contactEmail: string | null
  createdAt: string
  isActive: boolean
  plan: string | null
  status: 'active' | 'inactive'
}

export interface AdminFirmListResponse {
  items: AdminFirmListItem[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface AdminFirmUser {
  id: string
  name: string
  email: string
  role: 'owner' | 'staff'
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
}

export interface AdminFirmDetail {
  id: string
  firmName: string
  ownerEmail: string | null
  contactName: string | null
  contactEmail: string | null
  phone: string | null
  address: string | null
  postcode: string | null
  createdAt: string
  isActive: boolean
  plan: string | null
  status: 'active' | 'inactive'
  deactivationReason: string | null
  deactivatedAt: string | null
  userCount: number
  clientCount: number
  lastLoginAt: string | null
  hmrcConnected: boolean
  hmrcStatus: string | null
  hmrcConnectedAt: string | null
  users: AdminFirmUser[]
}

export type EnquiryStatus = 'new' | 'contacted' | 'closed'

export type AdminAuditAction =
  | 'firm.activate'
  | 'firm.deactivate'
  | 'firm.deactivation_reason_update'
  | 'firm.invalidate_sessions'
  | 'user.invalidate_sessions'
  | 'enquiry.update'

export interface AdminEnquiryItem {
  id: string
  name: string
  firm: string
  email: string
  phone: string | null
  message: string
  sourcePage: string | null
  planInterest: string | null
  status: EnquiryStatus
  internalNote: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminEnquiryListResponse {
  items: AdminEnquiryItem[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface AdminAuditLogItem {
  id: string
  actorUserId: string
  actorEmail: string | null
  action: AdminAuditAction
  targetType: 'firm' | 'user' | 'enquiry'
  targetId: string
  targetLabel: string | null
  summary: string
  metadata: Record<string, unknown> | null
  createdAt: string
}

export interface AdminAuditLogListResponse {
  items: AdminAuditLogItem[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export const adminService = {
  getOverview: async (): Promise<AdminOverviewStats> => {
    const { data } = await axiosClient.get<{ success: true; data: AdminOverviewStats }>(
      '/admin/overview'
    )
    return data.data
  },

  listFirms: async (params: {
    page?: number
    limit?: number
    search?: string
  }): Promise<AdminFirmListResponse> => {
    const { data } = await axiosClient.get<{ success: true; data: AdminFirmListResponse }>(
      '/admin/firms',
      { params }
    )
    return data.data
  },

  getFirm: async (id: string): Promise<AdminFirmDetail> => {
    const { data } = await axiosClient.get<{ success: true; data: AdminFirmDetail }>(
      `/admin/firms/${id}`
    )
    return data.data
  },

  setFirmActive: async (
    id: string,
    payload: { isActive: boolean; reason?: string }
  ): Promise<AdminFirmDetail> => {
    const { data } = await axiosClient.patch<{ success: true; data: AdminFirmDetail }>(
      `/admin/firms/${id}/active`,
      payload
    )
    return data.data
  },

  invalidateFirmSessions: async (id: string): Promise<AdminFirmDetail> => {
    const { data } = await axiosClient.post<{ success: true; data: AdminFirmDetail }>(
      `/admin/firms/${id}/invalidate-sessions`
    )
    return data.data
  },

  invalidateUserSessions: async (firmId: string, userId: string): Promise<AdminFirmDetail> => {
    const { data } = await axiosClient.post<{ success: true; data: AdminFirmDetail }>(
      `/admin/firms/${firmId}/users/${userId}/invalidate-sessions`
    )
    return data.data
  },

  listEnquiries: async (params: {
    page?: number
    limit?: number
    status?: EnquiryStatus | ''
    search?: string
  }): Promise<AdminEnquiryListResponse> => {
    const { data } = await axiosClient.get<{ success: true; data: AdminEnquiryListResponse }>(
      '/admin/enquiries',
      {
        params: {
          page: params.page,
          limit: params.limit,
          status: params.status || undefined,
          search: params.search || undefined,
        },
      }
    )
    return data.data
  },

  getEnquiry: async (id: string): Promise<AdminEnquiryItem> => {
    const { data } = await axiosClient.get<{ success: true; data: AdminEnquiryItem }>(
      `/admin/enquiries/${id}`
    )
    return data.data
  },

  updateEnquiry: async (
    id: string,
    payload: { status?: EnquiryStatus; internalNote?: string | null }
  ): Promise<AdminEnquiryItem> => {
    const { data } = await axiosClient.patch<{ success: true; data: AdminEnquiryItem }>(
      `/admin/enquiries/${id}`,
      payload
    )
    return data.data
  },

  listAuditLogs: async (params: {
    page?: number
    limit?: number
    action?: AdminAuditAction | ''
    search?: string
  }): Promise<AdminAuditLogListResponse> => {
    const { data } = await axiosClient.get<{ success: true; data: AdminAuditLogListResponse }>(
      '/admin/audit-logs',
      {
        params: {
          page: params.page,
          limit: params.limit,
          action: params.action || undefined,
          search: params.search || undefined,
        },
      }
    )
    return data.data
  },
}

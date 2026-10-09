import axiosClient from '@/lib/api/axiosClient'

export interface AdminOverviewStats {
  totalFirms: number
  activeFirms: number
  inactiveFirms: number
  newSignupsThisWeek: number
  newSignupsThisMonth: number
  openEnquiries: number
}

export type AdminBillingStatus = 'trial' | 'active' | 'past_due' | 'cancelled' | 'expired'

export interface AdminFirmListItem {
  id: string
  firmName: string
  ownerEmail: string | null
  contactEmail: string | null
  createdAt: string
  isActive: boolean
  plan: string | null
  billingStatus: AdminBillingStatus | string
  trialEndsAt: string | null
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
  billingStatus: AdminBillingStatus | string
  trialStartsAt: string | null
  trialEndsAt: string | null
  trialEmailDomain: string | null
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  billableClientCount: number
  includedClientAllowance: number
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
  | 'firm.purge'
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
    billingStatus?: AdminBillingStatus | ''
  }): Promise<AdminFirmListResponse> => {
    const { data } = await axiosClient.get<{ success: true; data: AdminFirmListResponse }>(
      '/admin/firms',
      {
        params: {
          page: params.page,
          limit: params.limit,
          search: params.search || undefined,
          billingStatus: params.billingStatus || undefined,
        },
      }
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

  getTrialDays: async (): Promise<{ days: number }> => {
    const { data } = await axiosClient.get<{ success: true; data: { days: number } }>(
      '/admin/billing/trial-days'
    )
    return data.data
  },

  setTrialDays: async (days: number): Promise<{ days: number }> => {
    const { data } = await axiosClient.patch<{ success: true; data: { days: number } }>(
      '/admin/billing/trial-days',
      { days }
    )
    return data.data
  },

  clearTrialDomain: async (domain: string): Promise<{ cleared: boolean; domain: string }> => {
    const { data } = await axiosClient.delete<{
      success: true
      data: { cleared: boolean; domain: string }
    }>('/admin/billing/trial-domains', { data: { domain } })
    return data.data
  },

  /** Permanently delete firm by owner/staff email so they can register again. */
  purgeFirmByEmail: async (
    email: string
  ): Promise<{
    deleted: true
    email: string
    tenantId: string
    firmName: string
    usersRemoved: number
    clientsRemoved: number
    trialDomainCleared: string | null
  }> => {
    const { data } = await axiosClient.delete<{
      success: true
      data: {
        deleted: true
        email: string
        tenantId: string
        firmName: string
        usersRemoved: number
        clientsRemoved: number
        trialDomainCleared: string | null
      }
    }>('/admin/firms/by-email', { params: { email } })
    return data.data
  },
}

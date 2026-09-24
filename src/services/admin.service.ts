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
}

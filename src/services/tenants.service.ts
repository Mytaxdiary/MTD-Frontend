import axiosClient from '@/lib/api/axiosClient'

export interface FirmDetails {
  id: string
  firmName: string
  contactName?: string
  contactEmail?: string
  phone?: string
  address?: string
  postcode?: string
}

export interface UpdateFirmDetailsPayload {
  firmName?: string
  contactName?: string
  contactEmail?: string
  phone?: string
  address?: string
  postcode?: string
}

const tenantsService = {
  async getFirmDetails(): Promise<FirmDetails> {
    const res = await axiosClient.get<{ data: FirmDetails }>('/tenants/me')
    return res.data.data
  },

  async updateFirmDetails(payload: UpdateFirmDetailsPayload): Promise<FirmDetails> {
    const res = await axiosClient.patch<{ data: FirmDetails }>('/tenants/me', payload)
    return res.data.data
  },
}

export default tenantsService

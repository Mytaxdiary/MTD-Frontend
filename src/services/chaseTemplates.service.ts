import apiClient from '@/lib/api/axiosClient'

export interface ChaseTemplateRecord {
  id: string
  tenantId: string
  name: string
  type: string
  subject: string
  body: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateChaseTemplatePayload {
  name: string
  type: string
  subject: string
  body: string
}

export interface UpdateChaseTemplatePayload {
  name?: string
  type?: string
  subject?: string
  body?: string
}

export const chaseTemplatesService = {
  async list(): Promise<ChaseTemplateRecord[]> {
    const res = await apiClient.get<{ data: ChaseTemplateRecord[] }>('/chase-templates')
    return res.data.data
  },

  async create(payload: CreateChaseTemplatePayload): Promise<ChaseTemplateRecord> {
    const res = await apiClient.post<{ data: ChaseTemplateRecord }>('/chase-templates', payload)
    return res.data.data
  },

  async update(id: string, payload: UpdateChaseTemplatePayload): Promise<ChaseTemplateRecord> {
    const res = await apiClient.patch<{ data: ChaseTemplateRecord }>(`/chase-templates/${id}`, payload)
    return res.data.data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/chase-templates/${id}`)
  },
}

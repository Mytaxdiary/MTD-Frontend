import axiosClient from '@/lib/api/axiosClient'

export type ProspectStatus =
  | 'new'
  | 'blocked'
  | 'ready'
  | 'in_sequence'
  | 'engaged'
  | 'in_conversation'
  | 'trial'
  | 'customer'
  | 'unresponsive'
  | 'parked'
  | 'archived'

export interface OutreachFirm {
  id: string
  name: string
  domain?: string | null
  website?: string | null
  status: ProspectStatus
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface OutreachContact {
  id: string
  recipientId: string
  firmId: string
  firm?: OutreachFirm
  firstName?: string | null
  lastName?: string | null
  email: string
  salutation?: string
  status: ProspectStatus
  doNotContact: boolean
  sendHeld: boolean
  currentSequenceId?: string | null
  currentStep?: number | null
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface OutreachTouchpoint {
  id: string
  contactId?: string | null
  firmId?: string | null
  occurredAt: string
  channel: string
  direction: string
  eventType: string
  summary?: string | null
  responseCategory?: string | null
  stepNumber?: number | null
}

export interface OutreachTemplate {
  id: string
  handbookCode: string
  version: string
  name: string
  channel: string
  subject?: string | null
  body: string
  linkAsset: string
  retiredAt?: string | null
}

export interface OutreachSequence {
  id: string
  code: string
  name: string
  channel: string
  isActive: boolean
  steps?: Array<{
    id: string
    stepNumber: number
    dayOffset?: number | null
    triggerEvent?: string | null
    templateId: string
    template?: OutreachTemplate
  }>
}

export interface OutreachTask {
  id: string
  contactId: string
  contact?: OutreachContact
  type: string
  dueAt: string
  priority: number
  status: 'open' | 'done' | 'skipped'
  skipReason?: string | null
  suggestedTemplate?: OutreachTemplate | null
}

export interface OutreachSuppression {
  id: string
  value: string
  valueType: 'email' | 'domain'
  reason: string
  scope: string
  notes?: string | null
  addedAt: string
}

export interface OutreachCampaign {
  id: string
  name: string
  sequenceId: string
  sequence?: OutreachSequence
  waveNumber: number
  contactCount: number
  isActive: boolean
  releaseHeld: boolean
}

export interface PageResult<T> {
  items: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export const outreachService = {
  listContacts(params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    firmId?: string
  }) {
    return axiosClient
      .get<PageResult<OutreachContact>>('/outreach/contacts', { params })
      .then((r) => r.data)
  },

  getContact(id: string) {
    return axiosClient
      .get<
        OutreachContact & {
          touchpoints: OutreachTouchpoint[]
          openTasks: OutreachTask[]
          firm?: OutreachFirm
        }
      >(`/outreach/contacts/${id}`)
      .then((r) => r.data)
  },

  createContact(body: {
    firmId: string
    email: string
    firstName?: string
    lastName?: string
  }) {
    return axiosClient.post<OutreachContact>('/outreach/contacts', body).then((r) => r.data)
  },

  releaseContact(id: string) {
    return axiosClient.post<OutreachContact>(`/outreach/contacts/${id}/release`).then((r) => r.data)
  },

  advanceStep(id: string) {
    return axiosClient.post(`/outreach/contacts/${id}/advance-step`).then((r) => r.data)
  },

  stopSequence(id: string, reason?: string) {
    return axiosClient
      .post(`/outreach/contacts/${id}/stop-sequence`, { reason })
      .then((r) => r.data)
  },

  listFirms(params?: { page?: number; limit?: number; search?: string }) {
    return axiosClient
      .get<PageResult<OutreachFirm>>('/outreach/firms', { params })
      .then((r) => r.data)
  },

  createFirm(body: { name: string; domain?: string }) {
    return axiosClient.post<OutreachFirm>('/outreach/firms', body).then((r) => r.data)
  },

  todayQueue() {
    return axiosClient
      .get<{ items: OutreachTask[]; asOf: string }>('/outreach/tasks/today')
      .then((r) => r.data)
  },

  updateTask(id: string, body: { status?: string; skipReason?: string }) {
    return axiosClient.patch<OutreachTask>(`/outreach/tasks/${id}`, body).then((r) => r.data)
  },

  listTemplates(params?: { page?: number; limit?: number; search?: string }) {
    return axiosClient
      .get<PageResult<OutreachTemplate>>('/outreach/templates', { params })
      .then((r) => r.data)
  },

  listSuppressions(params?: {
    page?: number
    limit?: number
    search?: string
    valueType?: string
  }) {
    return axiosClient
      .get<PageResult<OutreachSuppression>>('/outreach/suppressions', { params })
      .then((r) => r.data)
  },

  createSuppression(body: {
    value: string
    valueType: 'email' | 'domain'
    reason: string
    notes?: string
  }) {
    return axiosClient
      .post<OutreachSuppression>('/outreach/suppressions', body)
      .then((r) => r.data)
  },

  deleteSuppression(id: string) {
    return axiosClient.delete(`/outreach/suppressions/${id}`).then((r) => r.data)
  },

  listCampaigns() {
    return axiosClient
      .get<{ items: OutreachCampaign[] }>('/outreach/campaigns')
      .then((r) => r.data)
  },

  campaignStats(id: string) {
    return axiosClient
      .get<{
        campaign: OutreachCampaign
        stats: {
          sent: number
          delivered: number
          bounced: number
          clicked: number
          replied: number
          blocked: number
        }
      }>(`/outreach/campaigns/${id}/stats`)
      .then((r) => r.data)
  },

  releaseCampaign(id: string) {
    return axiosClient
      .post<OutreachCampaign>(`/outreach/campaigns/${id}/release`)
      .then((r) => r.data)
  },

  listSequences() {
    return axiosClient.get<OutreachSequence[]>('/outreach/sequences').then((r) => r.data)
  },
}

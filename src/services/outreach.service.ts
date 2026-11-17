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

type ApiEnvelope<T> = { success: true; data: T; timestamp?: string }

function unwrap<T>(r: { data: ApiEnvelope<T> | T }): T {
  const body = r.data as ApiEnvelope<T> & T
  return (body && typeof body === 'object' && 'data' in body ? body.data : body) as T
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
      .get<ApiEnvelope<PageResult<OutreachContact>>>('/outreach/contacts', { params })
      .then(unwrap)
  },

  getContact(id: string) {
    return axiosClient
      .get<
        ApiEnvelope<
          OutreachContact & {
            touchpoints: OutreachTouchpoint[]
            openTasks: OutreachTask[]
            firm?: OutreachFirm
          }
        >
      >(`/outreach/contacts/${id}`)
      .then(unwrap)
  },

  createContact(body: {
    firmId: string
    email: string
    firstName?: string
    lastName?: string
  }) {
    return axiosClient
      .post<ApiEnvelope<OutreachContact>>('/outreach/contacts', body)
      .then(unwrap)
  },

  releaseContact(id: string) {
    return axiosClient
      .post<ApiEnvelope<OutreachContact>>(`/outreach/contacts/${id}/release`)
      .then(unwrap)
  },

  advanceStep(id: string) {
    return axiosClient
      .post<ApiEnvelope<unknown>>(`/outreach/contacts/${id}/advance-step`)
      .then(unwrap)
  },

  stopSequence(id: string, reason?: string) {
    return axiosClient
      .post<ApiEnvelope<unknown>>(`/outreach/contacts/${id}/stop-sequence`, { reason })
      .then(unwrap)
  },

  listFirms(params?: { page?: number; limit?: number; search?: string }) {
    return axiosClient
      .get<ApiEnvelope<PageResult<OutreachFirm>>>('/outreach/firms', { params })
      .then(unwrap)
  },

  createFirm(body: { name: string; domain?: string }) {
    return axiosClient
      .post<ApiEnvelope<OutreachFirm>>('/outreach/firms', body)
      .then(unwrap)
  },

  todayQueue() {
    return axiosClient
      .get<ApiEnvelope<{ items: OutreachTask[]; asOf: string }>>('/outreach/tasks/today')
      .then(unwrap)
  },

  updateTask(id: string, body: { status?: string; skipReason?: string }) {
    return axiosClient
      .patch<ApiEnvelope<OutreachTask>>(`/outreach/tasks/${id}`, body)
      .then(unwrap)
  },

  listTemplates(params?: { page?: number; limit?: number; search?: string }) {
    return axiosClient
      .get<ApiEnvelope<PageResult<OutreachTemplate>>>('/outreach/templates', { params })
      .then(unwrap)
  },

  listSuppressions(params?: {
    page?: number
    limit?: number
    search?: string
    valueType?: string
  }) {
    return axiosClient
      .get<ApiEnvelope<PageResult<OutreachSuppression>>>('/outreach/suppressions', { params })
      .then(unwrap)
  },

  createSuppression(body: {
    value: string
    valueType: 'email' | 'domain'
    reason: string
    notes?: string
  }) {
    return axiosClient
      .post<ApiEnvelope<OutreachSuppression>>('/outreach/suppressions', body)
      .then(unwrap)
  },

  deleteSuppression(id: string) {
    return axiosClient
      .delete<ApiEnvelope<unknown>>(`/outreach/suppressions/${id}`)
      .then(unwrap)
  },

  listCampaigns() {
    return axiosClient
      .get<ApiEnvelope<{ items: OutreachCampaign[] }>>('/outreach/campaigns')
      .then(unwrap)
  },

  campaignStats(id: string) {
    return axiosClient
      .get<
        ApiEnvelope<{
          campaign: OutreachCampaign
          stats: {
            sent: number
            delivered: number
            bounced: number
            clicked: number
            replied: number
            blocked: number
          }
        }>
      >(`/outreach/campaigns/${id}/stats`)
      .then(unwrap)
  },

  releaseCampaign(id: string) {
    return axiosClient
      .post<ApiEnvelope<OutreachCampaign>>(`/outreach/campaigns/${id}/release`)
      .then(unwrap)
  },

  listSequences() {
    return axiosClient
      .get<ApiEnvelope<OutreachSequence[]>>('/outreach/sequences')
      .then(unwrap)
  },
}

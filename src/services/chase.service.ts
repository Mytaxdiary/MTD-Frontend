import apiClient from '@/lib/api/axiosClient'

// ── Types ─────────────────────────────────────────────────────────────────────

/** Shape returned by GET /chase/clients — one row per business × open quarter */
export interface ChaseClientRecord {
  /** Unique row key: clientId::businessId::periodStartDate */
  rowKey: string
  id: string
  businessId: string | null
  businessName: string | null
  typeOfBusiness: string | null
  periodStartDate?: string | null
  periodEndDate?: string | null
  dueDate?: string | null
  /** Full legal name (list display) */
  name: string
  preferredName?: string
  /** Preferred name if set, otherwise first name — used for {name} in templates */
  greetingName: string
  /** NINO — legacy {business} */
  business: string
  deadline: string
  /** positive = overdue days, negative = days remaining */
  daysOverdue: number
  /** positive = days since obligation period ended, negative = period still open */
  daysSincePeriodEnd: number
  quarter: string
  lastChase: string | null
  chaseCount: number
  /** sent | opened | responded | bounced | not-started */
  status: string
  /** email | sms */
  channel: string
  /** bookkeeping | data-request */
  workflowType: string
  obligationsFallback?: boolean
}

export interface ChaseClientsPage {
  clients: ChaseClientRecord[]
  page: number
  limit: number
  totalClients: number
  totalPages: number
}

export interface ListChaseClientsParams {
  search?: string
  quarter?: string
  sortBy?: 'quarter' | 'deadline' | 'name'
  sortDir?: 'asc' | 'desc'
  page?: number
  limit?: number
}

/** Shape returned by GET /chase-logs?clientId= */
export interface ChaseLogRecord {
  id: string
  clientId: string
  businessId?: string | null
  businessName?: string | null
  periodStartDate?: string | null
  periodEndDate?: string | null
  dueDate?: string | null
  quarterLabel?: string | null
  templateId?: string
  channel: string
  subject: string
  body: string
  status: string
  sentAt: string
  createdAt: string
}

/** Payload for POST /chase-logs */
export interface SendChasePayload {
  clientId: string
  businessId?: string
  businessName?: string
  periodStartDate?: string
  periodEndDate?: string
  dueDate?: string
  quarterLabel?: string
  templateId?: string
  channel: string
  subject: string
  body: string
}

// ── Service ───────────────────────────────────────────────────────────────────

export const chaseService = {
  /** Paginated authorised clients expanded to open business×quarter rows */
  async listChaseClients(params: ListChaseClientsParams = {}): Promise<ChaseClientsPage> {
    const res = await apiClient.get<{ data: ChaseClientsPage }>('/chase/clients', {
      params: {
        search: params.search || undefined,
        quarter: params.quarter && params.quarter !== 'all' ? params.quarter : undefined,
        sortBy: params.sortBy,
        sortDir: params.sortDir,
        page: params.page ?? 1,
        limit: params.limit ?? 5,
      },
    })
    return res.data.data
  },

  /** Record a chase sent for one business×period (also fires the actual email/SMS) */
  async sendChase(payload: SendChasePayload): Promise<ChaseLogRecord> {
    const res = await apiClient.post<{ data: ChaseLogRecord }>('/chase-logs', payload)
    return res.data.data
  },

  /** List all chase logs for a specific client (newest first) */
  async getClientChaseLog(clientId: string): Promise<ChaseLogRecord[]> {
    const res = await apiClient.get<{ data: ChaseLogRecord[] }>('/chase-logs', {
      params: { clientId },
    })
    return res.data.data
  },

  /** Update chase log status (e.g. mark as responded) */
  async updateStatus(logId: string, status: string): Promise<ChaseLogRecord> {
    const res = await apiClient.patch<{ data: ChaseLogRecord }>(`/chase-logs/${logId}/status`, {
      status,
    })
    return res.data.data
  },
}

// ── Variable substitution (client-side preview) ───────────────────────────────

export interface TemplateVars {
  name: string
  business: string
  business_name?: string
  quarter: string
  deadline: string
  agent_name: string
  firm_name: string
}

export function renderTemplate(template: string, vars: Partial<TemplateVars>): string {
  return template
    .replace(/{name}/g, vars.name ?? '{name}')
    .replace(/{business_name}/g, vars.business_name ?? vars.business ?? '{business_name}')
    .replace(/{business}/g, vars.business ?? '{business}')
    .replace(/{quarter}/g, vars.quarter ?? '{quarter}')
    .replace(/{deadline}/g, vars.deadline ?? '{deadline}')
    .replace(/{agent_name}/g, vars.agent_name ?? '{agent_name}')
    .replace(/{firm_name}/g, vars.firm_name ?? '{firm_name}')
}

/** Preferred name if set, else first word of full name. */
export function chaseGreetingName(fullName: string, preferredName?: string | null): string {
  const preferred = preferredName?.trim()
  if (preferred) return preferred
  const first = fullName.trim().split(/\s+/)[0]
  return first || fullName.trim()
}

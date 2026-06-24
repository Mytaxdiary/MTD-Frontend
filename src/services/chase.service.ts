import apiClient from '@/lib/api/axiosClient'

// ── Types ─────────────────────────────────────────────────────────────────────

/** Shape returned by GET /chase/clients */
export interface ChaseClientRecord {
  id: string
  name: string
  /** NINO */
  business: string
  deadline: string
  /** positive = overdue days, negative = days remaining */
  daysOverdue: number
  quarter: string
  lastChase: string | null
  chaseCount: number
  /** sent | opened | responded | bounced | not-started */
  status: string
  /** email | sms */
  channel: string
  /** bookkeeping | data-request */
  workflowType: string
}

/** Shape returned by GET /chase-logs?clientId= */
export interface ChaseLogRecord {
  id: string
  clientId: string
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
  templateId?: string
  channel: string
  subject: string
  body: string
}

// ── Service ───────────────────────────────────────────────────────────────────

export const chaseService = {
  /** List all authorised clients with their chase summary + current quarter deadline */
  async listChaseClients(): Promise<ChaseClientRecord[]> {
    const res = await apiClient.get<{ data: ChaseClientRecord[] }>('/chase/clients')
    return res.data.data
  },

  /** Record a chase sent to a client (also fires the actual email/SMS) */
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
    const res = await apiClient.patch<{ data: ChaseLogRecord }>(
      `/chase-logs/${logId}/status`,
      { status },
    )
    return res.data.data
  },
}

// ── Variable substitution (client-side preview) ───────────────────────────────

export interface TemplateVars {
  name: string
  business: string
  quarter: string
  deadline: string
  agent_name: string
  firm_name: string
}

export function renderTemplate(template: string, vars: Partial<TemplateVars>): string {
  return template
    .replace(/{name}/g, vars.name ?? '{name}')
    .replace(/{business}/g, vars.business ?? '{business}')
    .replace(/{quarter}/g, vars.quarter ?? '{quarter}')
    .replace(/{deadline}/g, vars.deadline ?? '{deadline}')
    .replace(/{agent_name}/g, vars.agent_name ?? '{agent_name}')
    .replace(/{firm_name}/g, vars.firm_name ?? '{firm_name}')
}

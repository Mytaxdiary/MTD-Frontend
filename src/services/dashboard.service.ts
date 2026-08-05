import axiosClient from '@/lib/api/axiosClient'
import type { PipelineStatus } from '@/lib/dashboard/pipelineStatus'

export interface DashboardClientRow {
  id: string
  name: string
  invitationStatus: string
  authorisedAt: string | null
  /** Canonical pipeline status for list / kanban / year */
  pipelineStatus: PipelineStatus
  /** Alias of pipelineStatus (compat) */
  status: PipelineStatus
  /** Alias of pipelineStatus (compat) */
  stage: PipelineStatus
  quarter: string
  deadline: string
  /** positive = days remaining, negative = days overdue */
  daysLeft: number
  chase: string
  chaseCount: number
  records: boolean
  type: string[]
  q1: string
  q2: string
  q3: string
  q4: string
}

export interface DashboardSummary {
  currentTaxYear: string
  currentQuarter: string
  currentDeadline: string
  metrics: {
    total: number
    pendingInvites: number
    notStarted: number
    chased: number
    recordsReceived: number
    readyForReview: number
    submitted: number
  }
  clients: DashboardClientRow[]
}

const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const res = await axiosClient.get<{ data: DashboardSummary }>('/dashboard/summary')
    return res.data.data
  },
}

export default dashboardService

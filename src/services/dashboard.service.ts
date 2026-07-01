import axiosClient from '@/lib/api/axiosClient'

export interface DashboardClientRow {
  id: string
  name: string
  invitationStatus: string
  authorisedAt: string | null
  /** overdue | due-soon | authorized | pending-invite */
  status: string
  /** not-started | chased | received */
  stage: string
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
    overdue: number
    dueSoon: number
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

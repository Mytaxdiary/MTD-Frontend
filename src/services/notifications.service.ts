import axiosClient from '@/lib/api/axiosClient'

export interface NotificationPrefs {
  chaseEmail: boolean
  chaseSms: boolean
  overdueAlert: boolean
  deadlineReminder: boolean
  inviteAccepted: boolean
  liabilityAlert: boolean
  reminderDays: number
}

const notificationsService = {
  async getPrefs(): Promise<NotificationPrefs> {
    const res = await axiosClient.get<{ data: Record<string, unknown> }>('/tenants/me/notifications')
    const d = res.data.data
    return {
      chaseEmail: d.chaseEmail as boolean,
      chaseSms: d.chaseSms as boolean,
      overdueAlert: d.overdueAlert as boolean,
      deadlineReminder: d.deadlineReminder as boolean,
      inviteAccepted: d.inviteAccepted as boolean,
      liabilityAlert: d.liabilityAlert as boolean,
      reminderDays: d.reminderDays as number,
    }
  },

  async updatePrefs(payload: Partial<NotificationPrefs>): Promise<NotificationPrefs> {
    const res = await axiosClient.patch<{ data: NotificationPrefs }>('/tenants/me/notifications', payload)
    return res.data.data
  },
}

export default notificationsService

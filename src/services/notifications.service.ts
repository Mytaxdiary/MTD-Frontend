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
    const res = await axiosClient.get<{ data: NotificationPrefs }>('/tenants/me/notifications')
    return res.data.data
  },

  async updatePrefs(payload: Partial<NotificationPrefs>): Promise<NotificationPrefs> {
    const res = await axiosClient.patch<{ data: NotificationPrefs }>('/tenants/me/notifications', payload)
    return res.data.data
  },
}

export default notificationsService

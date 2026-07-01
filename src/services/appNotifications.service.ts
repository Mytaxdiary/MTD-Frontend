import axiosClient from '@/lib/api/axiosClient'

export interface AppNotification {
  id: string
  createdAt: string
  type: string
  title: string
  body: string
  clientId: string | null
  readAt: string | null
}

const appNotificationsService = {
  async list(): Promise<AppNotification[]> {
    const res = await axiosClient.get<{ data: AppNotification[] }>('/app-notifications')
    return res.data.data ?? []
  },

  async unreadCount(): Promise<number> {
    const res = await axiosClient.get<{ count: number }>('/app-notifications/unread-count')
    return res.data.count ?? 0
  },

  async markRead(id: string): Promise<void> {
    await axiosClient.patch(`/app-notifications/${id}/read`)
  },

  async markAllRead(): Promise<void> {
    await axiosClient.patch('/app-notifications/read-all')
  },
}

export default appNotificationsService

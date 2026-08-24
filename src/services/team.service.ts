import axiosClient from '@/lib/api/axiosClient'
import type { StaffPermissions } from '@/services/auth.service'

export interface TeamMember {
  id: string
  kind: 'user' | 'invite'
  name: string
  email: string
  role: 'owner' | 'staff'
  status: 'active' | 'pending'
  permissions: StaffPermissions
  invitedAt?: string
}

export interface StaffInvitePreview {
  email: string
  firstName: string
  lastName: string
  firmName: string
}

export const teamService = {
  async list(): Promise<TeamMember[]> {
    const res = await axiosClient.get<{ data: TeamMember[] }>('/team')
    return res.data.data
  },

  async invite(body: {
    firstName: string
    lastName: string
    email: string
    permissions?: StaffPermissions
  }): Promise<TeamMember> {
    const res = await axiosClient.post<{ data: TeamMember }>('/team/invites', body)
    return res.data.data
  },

  async updatePermissions(userId: string, permissions: StaffPermissions): Promise<TeamMember> {
    const res = await axiosClient.patch<{ data: TeamMember }>(
      `/team/users/${encodeURIComponent(userId)}/permissions`,
      { permissions }
    )
    return res.data.data
  },

  async removeStaff(userId: string): Promise<void> {
    await axiosClient.delete(`/team/users/${encodeURIComponent(userId)}`)
  },

  async cancelInvite(inviteId: string): Promise<void> {
    await axiosClient.delete(`/team/invites/${encodeURIComponent(inviteId)}`)
  },

  async previewInvite(token: string): Promise<StaffInvitePreview> {
    const res = await axiosClient.get<{ data: StaffInvitePreview }>(
      `/auth/staff-invite?token=${encodeURIComponent(token)}`
    )
    return res.data.data
  },

  async acceptInvite(token: string, password: string) {
    const res = await axiosClient.post<{
      data: { accessTokenExpiresAt: string; user: { isEmailVerified: boolean } }
    }>('/auth/accept-staff-invite', { token, password })
    return res.data.data
  },
}

'use client'

import { useMemo } from 'react'
import { useCurrentUser } from '@/components/auth/CurrentUserProvider'
import type { AuthUser, StaffPermissions } from '@/services/auth.service'

export type PermissionKey = keyof StaffPermissions

/** Mirrors backend `hasPermission`: owner (role !== staff) bypasses every flag. */
export function userHasPermission(
  user: AuthUser | null | undefined,
  key: PermissionKey,
): boolean {
  if (!user) return false
  if (user.role !== 'staff') return true
  return user.permissions?.[key] === true
}

export function usePermissions() {
  const { user, loading } = useCurrentUser()

  return useMemo(() => {
    const isOwner = !!user && user.role !== 'staff'
    const isStaff = user?.role === 'staff'
    return {
      loading,
      user,
      isOwner,
      isStaff,
      canAddClients: userHasPermission(user, 'canAddClients'),
      canChase: userHasPermission(user, 'canChase'),
      canViewLiabilities: userHasPermission(user, 'canViewLiabilities'),
      canViewNotes: userHasPermission(user, 'canViewNotes'),
      canManageTemplates: userHasPermission(user, 'canManageTemplates'),
      canViewSettings: userHasPermission(user, 'canViewSettings'),
      canInviteStaff: userHasPermission(user, 'canInviteStaff'),
    }
  }, [user, loading])
}

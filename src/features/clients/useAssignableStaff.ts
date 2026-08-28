'use client'

import { useEffect, useState } from 'react'
import { useCurrentUser } from '@/components/auth/CurrentUserProvider'
import { teamService, type TeamMember } from '@/services/team.service'

export type AssignablePerson = Pick<TeamMember, 'id' | 'name' | 'role'>

/** Owner can assign. Active users (owner + staff) appear in the picker. */
export function useAssignableStaff() {
  const { user } = useCurrentUser()
  const isOwner = user?.role !== 'staff'
  const isStaff = user?.role === 'staff'
  const [people, setPeople] = useState<AssignablePerson[]>([])

  useEffect(() => {
    if (!isOwner) {
      setPeople([])
      return
    }
    let cancelled = false
    teamService
      .list()
      .then((members) => {
        if (cancelled) return
        setPeople(
          members
            .filter((m) => m.kind === 'user' && m.status === 'active')
            .map((m) => ({ id: m.id, name: m.name, role: m.role })),
        )
      })
      .catch(() => {
        if (!cancelled) setPeople([])
      })
    return () => {
      cancelled = true
    }
  }, [isOwner])

  return { isOwner, isStaff, people, currentUserId: user?.id ?? null }
}

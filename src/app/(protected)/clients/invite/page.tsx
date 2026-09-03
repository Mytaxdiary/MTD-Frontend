'use client'

import { useRouter } from 'next/navigation'
import { ROUTE_PATHS } from '@/config/routes'
import InviteClient from '@/features/clients/inviteClient'
import PermissionGate from '@/components/auth/PermissionGate'
import { usePermissions } from '@/hooks/usePermissions'

export default function InviteClientPage() {
  const router = useRouter()
  const { canAddClients } = usePermissions()
  const navigate = (route: string) => {
    if (route === 'settings') {
      router.push('/settings?section=customers')
      return
    }
    router.push(ROUTE_PATHS[route] ?? `/${route}`)
  }
  return (
    <PermissionGate allow={canAddClients} redirectTo="/clients">
      <InviteClient navigate={navigate} />
    </PermissionGate>
  )
}

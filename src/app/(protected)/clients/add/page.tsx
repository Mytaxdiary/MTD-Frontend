'use client'

import { useRouter } from 'next/navigation'
import { ROUTE_PATHS } from '@/config/routes'
import AddClient from '@/features/clients/addClient'
import PermissionGate from '@/components/auth/PermissionGate'
import { usePermissions } from '@/hooks/usePermissions'

export default function AddClientPage() {
  const router = useRouter()
  const { canAddClients } = usePermissions()
  const navigate = (route: string) => router.push(ROUTE_PATHS[route] ?? `/${route}`)
  return (
    <PermissionGate allow={canAddClients} redirectTo="/clients">
      <AddClient navigate={navigate} />
    </PermissionGate>
  )
}

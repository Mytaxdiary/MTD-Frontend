'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { ROUTE_PATHS } from '@/config/routes'
import ChaseManager from '@/features/chase/chaseManager'
import PermissionGate from '@/components/auth/PermissionGate'
import { usePermissions } from '@/hooks/usePermissions'
import B from '@/styles/theme'

function ChasePageInner() {
  const router = useRouter()
  const { canChase } = usePermissions()
  const navigate = (route: string) => router.push(ROUTE_PATHS[route] ?? `/${route}`)
  return (
    <PermissionGate allow={canChase} redirectTo="/dashboard">
      <ChaseManager navigate={navigate} />
    </PermissionGate>
  )
}

export default function ChasePage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 40, textAlign: 'center', fontSize: 14, color: B.muted }}>
          Loading chase manager...
        </div>
      }
    >
      <ChasePageInner />
    </Suspense>
  )
}

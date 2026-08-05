'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { ROUTE_PATHS } from '@/config/routes'
import ChaseManager from '@/features/chase/chaseManager'
import B from '@/styles/theme'

function ChasePageInner() {
  const router = useRouter()
  const navigate = (route: string) => router.push(ROUTE_PATHS[route] ?? `/${route}`)
  return <ChaseManager navigate={navigate} />
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

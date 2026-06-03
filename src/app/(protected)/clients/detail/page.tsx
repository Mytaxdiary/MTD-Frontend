'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ROUTE_PATHS } from '@/config/routes'
import ClientDetail from '@/features/clients/clientDetail'

export default function ClientDetailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const clientId = searchParams.get('id')
  const navigate = (route: string) => router.push(ROUTE_PATHS[route] ?? `/${route}`)
  return <ClientDetail clientId={clientId} navigate={navigate} />
}

'use client'

import { useRouter } from 'next/navigation'
import { ROUTE_PATHS } from '@/config/routes'
import QuarterlyReview from '@/features/quarterly/quarterlyReview'

export default function QuarterlyReviewPage() {
  const router = useRouter()
  const navigate = (route: string) => router.push(ROUTE_PATHS[route] ?? `/${route}`)
  return <QuarterlyReview navigate={navigate} />
}

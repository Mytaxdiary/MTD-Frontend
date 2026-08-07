'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { emailConnectionService } from '@/services/email-connection.service'

export default function EmailCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    const code = searchParams.get('code')
    const errorParam = searchParams.get('error')
    const provider =
      emailConnectionService.takeRememberedProvider() ??
      (searchParams.get('provider') as 'gmail' | 'outlook' | null)

    if (errorParam) {
      setError(
        `Provider returned an error: ${searchParams.get('error_description') ?? errorParam}`,
      )
      return
    }

    if (!code) {
      setError('No authorization code received.')
      return
    }

    if (provider !== 'gmail' && provider !== 'outlook') {
      setError('Missing email provider. Start again from Settings → Email connection.')
      return
    }

    emailConnectionService
      .exchangeCode(code, provider)
      .then(() => {
        router.replace('/settings?section=email')
      })
      .catch((err) => {
        const msg =
          err?.response?.data?.message ??
          err?.message ??
          'Failed to connect email. Please try again.'
        setError(msg)
      })
  }, [router, searchParams])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-xl shadow p-8 text-center">
          <div className="text-red-500 text-4xl mb-4">✕</div>
          <h1 className="text-xl font-semibold text-gray-800 mb-2">Email connection failed</h1>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => router.replace('/settings?section=email')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
          >
            Back to Settings
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-gray-500">Completing email connection…</p>
      </div>
    </div>
  )
}

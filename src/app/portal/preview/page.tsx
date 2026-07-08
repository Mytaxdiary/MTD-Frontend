'use client'
import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import portalAxiosClient from '@/lib/api/portalAxiosClient'
import { setPortalSessionCookie } from '@/lib/auth/portalTokenStorage'
import B from '@/styles/theme'

/**
 * Agent preview entry point.
 * The agent opens this page via "View client portal" button on the client detail page.
 * It exchanges the short-lived preview token for a portal session cookie,
 * then redirects to /portal/dashboard.
 */
function PreviewExchange() {
  const router  = useRouter()
  const params  = useSearchParams()
  const token   = params.get('token') ?? ''
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setError('No preview token provided.')
      return
    }

    portalAxiosClient
      .post('/portal/auth/preview-session', { token })
      .then(() => {
        // Mark session cookie so the portal layout knows we are authenticated
        setPortalSessionCookie()
        router.replace('/portal/dashboard')
      })
      .catch(() => {
        setError('This preview link has expired or is invalid. Please click "View client portal" again from the client detail page.')
      })
  }, [token, router])

  if (error) {
    return (
      <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center' }}>
        <div
          style={{
            background: B.redBg,
            border: `1px solid #FECACA`,
            borderRadius: 10,
            padding: '24px 28px',
            fontSize: 14,
            color: B.redText,
          }}
        >
          {error}
        </div>
        <button
          onClick={() => window.close()}
          style={{
            marginTop: 20,
            padding: '8px 20px',
            background: '#1E3A5F',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Close tab
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center' }}>
      <div style={{ fontSize: 36, marginBottom: 16 }}>⏳</div>
      <p style={{ fontSize: 15, color: B.muted, margin: 0 }}>
        Opening client portal preview...
      </p>
    </div>
  )
}

export default function PortalPreviewPage() {
  return (
    <Suspense>
      <PreviewExchange />
    </Suspense>
  )
}

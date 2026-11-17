'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import portalService from '@/services/portal.service'
import MfaSettingsPanel from '@/components/security/MfaSettingsPanel'
import B from '@/styles/theme'

export default function PortalSecurityPage() {
  const router = useRouter()
  const [mfaEnabled, setMfaEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isPreview, setIsPreview] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const me = await portalService.getMe()
      if (me.isPreview) {
        setIsPreview(true)
      }
      setMfaEnabled(!!me.mfaEnabled)
    } catch {
      router.replace('/portal/login')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  return (
    <div>
      <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: B.text }}>Security</h1>
      <p style={{ margin: '0 0 22px', fontSize: 15, color: B.muted }}>
        Protect your portal login with two-step verification.
      </p>

      {loading ? (
        <div style={{ color: B.muted }}>Loading…</div>
      ) : isPreview ? (
        <div
          style={{
            padding: '14px 16px',
            borderRadius: 10,
            background: B.amberBg,
            color: B.amberText,
            fontSize: 14,
          }}
        >
          Preview mode is read-only. Sign in as the client to manage 2FA.
        </div>
      ) : (
        <MfaSettingsPanel
          mfaEnabled={mfaEnabled}
          api={{
            mfaSetup: () => portalService.mfaSetup(),
            mfaEnable: (setupToken, code) => portalService.mfaEnable(setupToken, code),
            mfaDisable: (password, code) => portalService.mfaDisable(password, code),
          }}
          onChanged={async () => {
            const me = await portalService.getMe()
            setMfaEnabled(!!me.mfaEnabled)
          }}
        />
      )}
    </div>
  )
}

'use client'

import { useCurrentUser } from '@/components/auth/CurrentUserProvider'
import MfaSettingsPanel from '@/components/security/MfaSettingsPanel'
import { authService } from '@/services/auth.service'
import B from '@/styles/theme'

export default function AdminSecurityPage() {
  const { user, loading, refresh } = useCurrentUser()
  const mfaEnabled = user?.mfaEnabled ?? false

  return (
    <div style={{ padding: '28px 32px', maxWidth: 720 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px', color: B.text }}>Security</h1>
      <p style={{ margin: '0 0 22px', fontSize: 14, color: B.muted }}>
        Protect your platform admin account with two-step verification.
      </p>

      {loading ? (
        <div style={{ color: B.muted, fontSize: 14 }}>Loading…</div>
      ) : (
        <MfaSettingsPanel
          mfaEnabled={mfaEnabled}
          api={{
            mfaSetup: () => authService.mfaSetup(),
            mfaEnable: (setupToken, code) => authService.mfaEnable(setupToken, code),
            mfaDisable: (password, code) => authService.mfaDisable(password, code),
          }}
          onChanged={() => refresh()}
        />
      )}
    </div>
  )
}

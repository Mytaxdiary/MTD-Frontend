'use client'

import B from '@/styles/theme'
import { Card, CardHeader as CardHead } from '@/components/ui/card'
import { useCurrentUser, userInitials } from '@/components/auth/CurrentUserProvider'

export default function TeamSection() {
  const { user, loading } = useCurrentUser()

  return (
    <Card>
      <CardHead titleSize={15} padding="16px 20px" title="Team members" />
      <div style={{ padding: '8px 20px 14px' }}>
        {loading ? (
          <div style={{ padding: '14px 0', fontSize: 13, color: B.muted }}>Loading…</div>
        ) : user ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '14px 0',
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                background: B.blueBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                color: B.blueText,
                border: '1px solid #BAE6FD',
              }}
            >
              {userInitials(user.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
              <div style={{ fontSize: 11, color: B.light }}>{user.email}</div>
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: B.muted,
                padding: '2px 10px',
                borderRadius: 20,
                background: B.surface,
                border: `1px solid ${B.borderLight}`,
              }}
            >
              Admin
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 10,
                background: user.isEmailVerified ? B.greenBg : B.amberBg,
                color: user.isEmailVerified ? B.greenText : B.amberText,
              }}
            >
              {user.isEmailVerified ? 'Active' : 'Pending'}
            </span>
          </div>
        ) : (
          <div style={{ padding: '14px 0', fontSize: 13, color: B.muted }}>
            No account information available.
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <button
            disabled
            title="Team invites coming soon"
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: `1px solid ${B.border}`,
              background: B.white,
              fontSize: 12,
              fontWeight: 500,
              cursor: 'not-allowed',
              color: B.muted,
              opacity: 0.7,
            }}
          >
            + Invite team member
          </button>
        </div>
      </div>
    </Card>
  )
}

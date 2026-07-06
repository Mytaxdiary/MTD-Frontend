'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import portalService, { type PortalMe } from '@/services/portal.service'
import { clearPortalSessionCookie } from '@/lib/auth/portalTokenStorage'
import B from '@/styles/theme'

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; c: string; l: string }> = {
    Open:       { bg: B.amberBg, c: B.amberText, l: 'Open' },
    Fulfilled:  { bg: B.greenBg, c: B.greenText, l: 'Submitted' },
    Overdue:    { bg: B.redBg,   c: B.redText,   l: 'Overdue' },
  }
  const s = map[status] ?? { bg: B.surface, c: B.muted, l: status }
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: s.bg, color: s.c }}>
      {s.l}
    </span>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: B.white,
        borderRadius: 12,
        border: `1px solid ${B.border}`,
        marginBottom: 20,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${B.border}`, fontWeight: 700, fontSize: 14, color: B.text }}>
        {title}
      </div>
      <div style={{ padding: '18px 20px' }}>{children}</div>
    </div>
  )
}

export default function PortalDashboard() {
  const router = useRouter()
  const [me, setMe]                     = useState<PortalMe | null>(null)
  const [obligations, setObligations]   = useState<unknown[]>([])
  const [liabilities, setLiabilities]   = useState<unknown>(null)
  const [unread, setUnread]             = useState(0)
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [meData, oblData, unreadCount] = await Promise.all([
          portalService.getMe(),
          portalService.getObligations(),
          portalService.getUnreadCount(),
        ])
        setMe(meData)
        setObligations(oblData.obligations ?? [])
        setUnread(unreadCount)

        if (meData.authorisedAt) {
          const liabData = await portalService.getLiabilities()
          setLiabilities(liabData)
        }
      } catch {
        router.push('/portal/login')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [router])

  async function handleLogout() {
    await portalService.logout().catch(() => null)
    clearPortalSessionCookie()
    router.push('/portal/login')
  }

  if (loading) {
    return <div style={{ textAlign: 'center', color: B.muted, paddingTop: 80, fontSize: 14 }}>Loading your portal…</div>
  }

  const bal = (liabilities as Record<string, unknown> | null)

  return (
    <div>
      {/* Agent preview banner */}
      {me?.isPreview && (
        <div
          style={{
            background: '#FEF9C3',
            border: '1px solid #FDE047',
            borderRadius: 10,
            padding: '10px 18px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 13,
            color: '#713F12',
            fontWeight: 500,
          }}
        >
          <span style={{ fontSize: 16 }}>👁</span>
          <span>
            You are viewing the portal as <strong>{me.name}</strong>.
            This is a read-only preview — changes are not possible.
          </span>
          <button
            onClick={() => window.close()}
            style={{
              marginLeft: 'auto',
              padding: '4px 14px',
              background: '#713F12',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Close preview
          </button>
        </div>
      )}

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: B.text }}>
            Welcome, {me?.name}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: B.muted }}>
            Managed by <strong>{me?.firmName}</strong>
            {me?.firmEmail ? ` · ${me.firmEmail}` : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {unread > 0 && (
            <button
              onClick={() => router.push('/portal/messages')}
              style={{
                padding: '7px 14px', background: '#1E3A5F', color: '#fff', border: 'none',
                borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Messages {unread > 0 ? `(${unread})` : ''}
            </button>
          )}
          <button
            onClick={() => router.push('/portal/messages')}
            style={{
              padding: '7px 14px', background: B.white, color: B.text,
              border: `1px solid ${B.border}`, borderRadius: 8, fontSize: 12, cursor: 'pointer',
            }}
          >
            Messages
          </button>
          {!me?.isPreview && (
            <button
              onClick={handleLogout}
              style={{
                padding: '7px 12px', background: 'transparent', color: B.muted,
                border: `1px solid ${B.border}`, borderRadius: 8, fontSize: 12, cursor: 'pointer',
              }}
            >
              Sign out
            </button>
          )}
        </div>
      </div>

      {/* HMRC auth status notice */}
      {!me?.authorisedAt && (
        <div
          style={{
            background: B.amberBg,
            border: `1px solid #FDE68A`,
            borderRadius: 10,
            padding: '14px 20px',
            marginBottom: 20,
            fontSize: 13,
            color: B.amberText,
          }}
        >
          <strong>HMRC authorisation pending.</strong> Your accountant has sent you an invitation via HMRC. Once you accept it, your submissions and liabilities will appear here.
        </div>
      )}

      {/* Obligations / Quarterly deadlines */}
      <Card title="Quarterly deadlines">
        {obligations.length === 0 ? (
          <p style={{ fontSize: 13, color: B.muted, margin: 0 }}>No obligations found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${B.border}` }}>
                {['Period', 'Due date', 'Status'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '6px 10px', fontSize: 11, color: B.muted, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(obligations as Array<{
                obligations?: Array<{ periodStartDate: string; periodEndDate: string; dueDate: string; status: string }>
              }>).flatMap((group, gi) =>
                (group.obligations ?? []).map((ob, oi) => (
                  <tr key={`${gi}-${oi}`} style={{ borderBottom: `1px solid ${B.borderLight}` }}>
                    <td style={{ padding: '8px 10px' }}>
                      {formatDate(ob.periodStartDate)} — {formatDate(ob.periodEndDate)}
                    </td>
                    <td style={{ padding: '8px 10px' }}>{formatDate(ob.dueDate)}</td>
                    <td style={{ padding: '8px 10px' }}><StatusBadge status={ob.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </Card>

      {/* Liabilities */}
      {me?.authorisedAt && (
        <Card title="HMRC balance">
          {!bal ? (
            <p style={{ fontSize: 13, color: B.muted, margin: 0 }}>No liability data available.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {(
                [
                  ['Overdue', (bal as Record<string, number>).overdueAmount],
                  ['Payable', (bal as Record<string, number>).payableAmount],
                  ['Pending', (bal as Record<string, number>).pendingChargeSAmount],
                ] as [string, number | undefined][]
              ).map(([label, amount]) => (
                <div
                  key={label}
                  style={{
                    background: B.surface,
                    borderRadius: 8,
                    padding: '14px 16px',
                    border: `1px solid ${B.border}`,
                  }}
                >
                  <div style={{ fontSize: 12, color: B.muted, marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: amount && amount > 0 ? B.redText : B.text }}>
                    £{Math.abs(amount ?? 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div
            style={{
              marginTop: 16,
              padding: '12px 16px',
              background: B.blueBg,
              borderRadius: 8,
              fontSize: 12,
              color: B.blueText,
              lineHeight: 1.6,
            }}
          >
            <strong>To pay HMRC:</strong> Sort code 08-32-10 · Account 12001039 · Reference: your UTR
            <br />
            <a
              href="https://www.gov.uk/pay-self-assessment-tax-bill"
              target="_blank"
              rel="noreferrer"
              style={{ color: B.link, fontWeight: 600 }}
            >
              Pay online at gov.uk →
            </a>
          </div>
        </Card>
      )}
    </div>
  )
}

function formatDate(d?: string): string {
  if (!d) return '—'
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return d
  }
}

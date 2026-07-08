'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import portalService, { type PortalMe } from '@/services/portal.service'
import { clearPortalSessionCookie } from '@/lib/auth/portalTokenStorage'
import B from '@/styles/theme'

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; c: string; l: string }> = {
    Open:      { bg: B.amberBg,  c: B.amberText,  l: 'Open' },
    Fulfilled: { bg: B.greenBg,  c: B.greenText,   l: 'Submitted' },
    Overdue:   { bg: B.redBg,    c: B.redText,     l: 'Overdue' },
  }
  const s = map[status] ?? { bg: B.surface, c: B.muted, l: status }
  return (
    <span style={{
      fontSize: 12,
      fontWeight: 700,
      padding: '4px 12px',
      borderRadius: 20,
      background: s.bg,
      color: s.c,
      letterSpacing: '0.2px',
    }}>
      {s.l}
    </span>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: B.white,
      borderRadius: 12,
      border: `1px solid ${B.border}`,
      marginBottom: 20,
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      <div style={{
        padding: '15px 22px',
        borderBottom: `1px solid ${B.border}`,
        fontWeight: 700,
        fontSize: 15,
        color: B.text,
        background: B.surface,
      }}>
        {title}
      </div>
      <div style={{ padding: '20px 22px' }}>{children}</div>
    </div>
  )
}

export default function PortalDashboard() {
  const router = useRouter()
  const [me, setMe]                   = useState<PortalMe | null>(null)
  const [obligations, setObligations] = useState<unknown[]>([])
  const [liabilities, setLiabilities] = useState<unknown>(null)
  const [unread, setUnread]           = useState(0)
  const [loading, setLoading]         = useState(true)

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
    return (
      <div style={{ textAlign: 'center', paddingTop: 100 }}>
        <div style={{ fontSize: 32, marginBottom: 14 }}>⏳</div>
        <p style={{ fontSize: 15, color: B.muted, margin: 0 }}>Loading your portal...</p>
      </div>
    )
  }

  const bal = liabilities as Record<string, number> | null

  return (
    <div>
      {/* Agent preview banner */}
      {me?.isPreview && (
        <div style={{
          background: '#FEF9C3',
          border: '1px solid #FDE047',
          borderRadius: 10,
          padding: '12px 20px',
          marginBottom: 22,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 14,
          color: '#713F12',
          fontWeight: 500,
        }}>
          <span style={{ fontSize: 18 }}>👁</span>
          <span>
            You are viewing the portal as <strong>{me.name}</strong>. This is a read-only preview.
          </span>
          <button
            onClick={() => window.close()}
            style={{
              marginLeft: 'auto',
              padding: '6px 16px',
              background: '#713F12',
              color: '#fff',
              border: 'none',
              borderRadius: 7,
              fontSize: 13,
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            Close preview
          </button>
        </div>
      )}

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: B.text, letterSpacing: '-0.3px' }}>
            Welcome, {me?.name}
          </h2>
          <p style={{ margin: '5px 0 0', fontSize: 14, color: B.muted }}>
            Managed by <strong>{me?.firmName}</strong>
            {me?.firmEmail && <span style={{ color: B.light }}> &nbsp;|&nbsp; {me.firmEmail}</span>}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
          <button
            onClick={() => router.push('/portal/messages')}
            style={{
              padding: '8px 18px',
              background: unread > 0 ? '#1E3A5F' : B.white,
              color: unread > 0 ? '#fff' : B.text,
              border: `1px solid ${unread > 0 ? '#1E3A5F' : B.border}`,
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Messages{unread > 0 ? ` (${unread})` : ''}
          </button>
          {!me?.isPreview && (
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                color: B.muted,
                border: `1px solid ${B.border}`,
                borderRadius: 8,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Sign out
            </button>
          )}
        </div>
      </div>

      {/* HMRC auth status notice */}
      {!me?.authorisedAt && (
        <div style={{
          background: B.amberBg,
          border: `1px solid #FDE68A`,
          borderRadius: 10,
          padding: '15px 22px',
          marginBottom: 20,
          fontSize: 14,
          color: B.amberText,
          lineHeight: 1.6,
        }}>
          <strong>HMRC authorisation pending.</strong> Your accountant has sent you an invitation via HMRC. Once you accept it, your submissions and liabilities will appear here.
        </div>
      )}

      {/* Quarterly deadlines */}
      <Card title="Quarterly deadlines">
        {obligations.length === 0 ? (
          <p style={{ fontSize: 14, color: B.muted, margin: 0 }}>No obligations found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${B.border}` }}>
                {['Period', 'Due date', 'Status'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, color: B.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(obligations as Array<{
                obligations?: Array<{ periodStartDate: string; periodEndDate: string; dueDate: string; status: string }>
              }>).flatMap((group, gi) =>
                (group.obligations ?? []).map((ob, oi) => (
                  <tr key={`${gi}-${oi}`} style={{ borderBottom: `1px solid ${B.borderLight}` }}>
                    <td style={{ padding: '10px 12px', fontSize: 14 }}>
                      {formatDate(ob.periodStartDate)} to {formatDate(ob.periodEndDate)}
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: 14 }}>{formatDate(ob.dueDate)}</td>
                    <td style={{ padding: '10px 12px' }}><StatusBadge status={ob.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </Card>

      {/* HMRC balance */}
      {me?.authorisedAt && (
        <Card title="HMRC balance">
          {!bal ? (
            <p style={{ fontSize: 14, color: B.muted, margin: 0 }}>No liability data available.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {(
                [
                  ['Overdue',  bal.overdueAmount],
                  ['Payable',  bal.payableAmount],
                  ['Pending',  bal.pendingChargeSAmount],
                ] as [string, number | undefined][]
              ).map(([label, amount]) => (
                <div key={label} style={{
                  background: B.surface,
                  borderRadius: 10,
                  padding: '16px 18px',
                  border: `1px solid ${B.border}`,
                }}>
                  <div style={{ fontSize: 12, color: B.muted, marginBottom: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: amount && amount > 0 ? B.redText : B.text }}>
                    {formatCurrency(amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{
            marginTop: 18,
            padding: '14px 18px',
            background: B.blueBg,
            borderRadius: 9,
            fontSize: 13,
            color: B.blueText,
            lineHeight: 1.7,
          }}>
            <strong>To pay HMRC:</strong> Sort code 08-32-10, Account 12001039, Reference: your UTR
            <br />
            <a
              href="https://www.gov.uk/pay-self-assessment-tax-bill"
              target="_blank"
              rel="noreferrer"
              style={{ color: B.link, fontWeight: 600 }}
            >
              Pay online at gov.uk
            </a>
          </div>
        </Card>
      )}
    </div>
  )
}

function formatDate(d?: string): string {
  if (!d) return 'N/A'
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return d
  }
}

function formatCurrency(amount?: number): string {
  return `£${Math.abs(amount ?? 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`
}

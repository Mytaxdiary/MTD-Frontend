'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import portalService, {
  type PortalBusinessQuarterly,
  type PortalLiabilitiesResponse,
  type PortalMe,
  type PortalPaymentDeadlineGroup,
} from '@/services/portal.service'
import { clearPortalSessionCookie } from '@/lib/auth/portalTokenStorage'
import MtdScopeNotice from '@/components/ui/MtdScopeNotice'
import B from '@/styles/theme'

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; c: string; l: string }> = {
    Open: { bg: B.amberBg, c: B.amberText, l: 'Open' },
    Pending: { bg: B.amberBg, c: B.amberText, l: 'Pending' },
    Fulfilled: { bg: B.greenBg, c: B.greenText, l: 'Submitted' },
    Submitted: { bg: B.greenBg, c: B.greenText, l: 'Submitted' },
    Overdue: { bg: B.redBg, c: B.redText, l: 'Overdue' },
    paid: { bg: B.greenBg, c: B.greenText, l: 'Paid' },
    upcoming: { bg: B.amberBg, c: B.amberText, l: 'Due' },
    overdue: { bg: B.redBg, c: B.redText, l: 'Overdue' },
  }
  const s = map[status] ?? { bg: B.surface, c: B.muted, l: status }
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 700,
        padding: '4px 12px',
        borderRadius: 20,
        background: s.bg,
        color: s.c,
        letterSpacing: '0.2px',
      }}
    >
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
        boxShadow: B.cardShadow,
      }}
    >
      <div
        style={{
          padding: '15px 22px',
          borderBottom: `1px solid ${B.border}`,
          fontWeight: 700,
          fontSize: 16,
          color: B.text,
          background: B.surface,
        }}
      >
        {title}
      </div>
      <div style={{ padding: '20px 22px' }}>{children}</div>
    </div>
  )
}

function DeadlineCard({
  title,
  group,
}: {
  title: string
  group: PortalPaymentDeadlineGroup | null | undefined
}) {
  const amount = group?.amount ?? 0
  const items = group?.items ?? []
  return (
    <div
      style={{
        background: B.surface,
        borderRadius: 10,
        padding: '16px 18px',
        border: `1px solid ${B.border}`,
      }}
    >
      <div style={{ fontSize: 13, color: B.muted, fontWeight: 600, marginBottom: 6 }}>{title}</div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: amount > 0 ? B.redText : B.text,
          marginBottom: 10,
        }}
      >
        {formatCurrency(amount)}
      </div>
      {items.length === 0 ? (
        <div style={{ fontSize: 13, color: B.muted }}>Nothing outstanding for this date.</div>
      ) : (
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: B.text, lineHeight: 1.6 }}>
          {items.map((item) => (
            <li key={item.documentId ?? `${item.label}-${item.dueDate}`}>
              {item.label}
              {item.dueDate ? ` · due ${formatDate(item.dueDate)}` : ''}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function PortalDashboard() {
  const router = useRouter()
  const [me, setMe] = useState<PortalMe | null>(null)
  const [businesses, setBusinesses] = useState<PortalBusinessQuarterly[]>([])
  const [liabilities, setLiabilities] = useState<PortalLiabilitiesResponse | null>(null)
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [meData, oblData, unreadCount] = await Promise.all([
          portalService.getMe(),
          portalService.getObligations(),
          portalService.getUnreadCount(),
        ])
        setMe(meData)
        setBusinesses(oblData.businesses ?? [])
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
        <p style={{ fontSize: 15, color: B.muted, margin: 0 }}>Loading your portal...</p>
      </div>
    )
  }

  const bal = liabilities?.balanceDetails
  const pay = liabilities?.paymentDetails

  return (
    <div>
      {me?.isPreview && (
        <div
          style={{
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
          }}
        >
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

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 24,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 800,
              color: B.text,
              letterSpacing: '-0.3px',
            }}
          >
            Welcome, {me?.name}
          </h2>
          <p style={{ margin: '5px 0 0', fontSize: 15, color: B.muted }}>
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
            Chat{unread > 0 ? ` (${unread})` : ''}
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

      {!me?.authorisedAt && (
        <div
          style={{
            background: B.amberBg,
            border: `1px solid #FDE68A`,
            borderRadius: 10,
            padding: '15px 22px',
            marginBottom: 20,
            fontSize: 14,
            color: B.amberText,
            lineHeight: 1.6,
          }}
        >
          {me?.portalOnly ? (
            <>
              <strong>HMRC access has not been granted yet.</strong> You can use the portal and
              message your accountant. Liabilities and quarterly submissions will appear here once
              your accountant links your HMRC account and you accept their invitation.
            </>
          ) : (
            <>
              <strong>HMRC authorisation pending.</strong> Your accountant has invited you via HMRC.
              Once you accept that invitation, your submissions and liabilities will appear here.
            </>
          )}
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <MtdScopeNotice />
      </div>

      {/* Task 2 — Liabilities + payment deadlines */}
      <Card title="HMRC liabilities">
        {!me?.authorisedAt ? (
          <p style={{ fontSize: 15, color: B.muted, margin: 0 }}>
            No liability data yet. This section fills in after HMRC access is granted.
          </p>
        ) : liabilities?.message && !liabilities.liabilities?.length ? (
          <p style={{ fontSize: 15, color: B.muted, margin: 0 }}>{liabilities.message}</p>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <DeadlineCard title="Payable by 31 January" group={liabilities?.paymentDeadlines?.january} />
              <DeadlineCard title="Payable by 31 July" group={liabilities?.paymentDeadlines?.july} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {(
                [
                  ['Total outstanding', bal?.totalBalance],
                  ['Overdue', bal?.overdueAmount],
                  ['Payable', bal?.payableAmount],
                ] as [string, number | undefined][]
              ).map(([label, amount]) => (
                <div
                  key={label}
                  style={{
                    background: B.surface,
                    borderRadius: 8,
                    padding: '12px 14px',
                    border: `1px solid ${B.border}`,
                  }}
                >
                  <div style={{ fontSize: 12, color: B.muted, fontWeight: 600, marginBottom: 4 }}>
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 800,
                      color: amount && amount > 0 ? B.redText : B.text,
                    }}
                  >
                    {formatCurrency(amount)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      {/* Task 2 — How to pay */}
      <Card title="How to pay HMRC">
        {!me?.authorisedAt || !pay ? (
          <p style={{ fontSize: 15, color: B.muted, margin: 0 }}>
            Payment details will show here once HMRC access is granted.
          </p>
        ) : (
          <div>
            {pay.amountDue != null && (
              <p style={{ margin: '0 0 14px', fontSize: 15, color: B.text }}>
                Amount due: <strong>{formatCurrency(pay.amountDue)}</strong>
                {pay.overdueAmount != null && pay.overdueAmount > 0 && (
                  <span style={{ color: B.redText }}>
                    {' '}
                    (including {formatCurrency(pay.overdueAmount)} overdue)
                  </span>
                )}
              </p>
            )}
            <div
              style={{
                background: B.blueBg,
                borderRadius: 9,
                padding: '14px 18px',
                fontSize: 14,
                color: B.blueText,
                lineHeight: 1.8,
              }}
            >
              <div>
                <strong>Sort code:</strong> {pay.sortCode}
              </div>
              <div>
                <strong>Account number:</strong> {pay.accountNumber}
              </div>
              <div>
                <strong>Reference:</strong> {pay.reference}
                {!pay.hasUtr && (
                  <span style={{ display: 'block', fontSize: 12, marginTop: 4, opacity: 0.85 }}>
                    Ask your accountant for your UTR if you do not have it.
                  </span>
                )}
              </div>
            </div>
            <a
              href={pay.payOnlineUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-block',
                marginTop: 14,
                color: B.link,
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Pay online at gov.uk
            </a>
          </div>
        )}
      </Card>

      {/* Task 3 — Quarterly submissions per business */}
      <Card title="Quarterly submissions">
        {!me?.authorisedAt ? (
          <p style={{ fontSize: 15, color: B.muted, margin: 0 }}>
            Quarterly submissions will appear here once HMRC access is granted.
          </p>
        ) : businesses.length === 0 ? (
          <p style={{ fontSize: 15, color: B.muted, margin: 0 }}>No quarterly submissions found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {businesses.map((biz) => (
              <div key={biz.businessId || biz.label}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: B.text }}>
                  {biz.label}
                </div>
                {biz.periods.length === 0 ? (
                  <p style={{ fontSize: 14, color: B.muted, margin: 0 }}>No periods for this business.</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr style={{ borderBottom: `2px solid ${B.border}` }}>
                        {['Period', 'Due date', 'Status'].map((h) => (
                          <th
                            key={h}
                            style={{
                              textAlign: 'left',
                              padding: '8px 12px',
                              fontSize: 12,
                              color: B.muted,
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {biz.periods.map((ob, oi) => (
                        <tr
                          key={`${biz.businessId}-${ob.periodKey ?? oi}`}
                          style={{ borderBottom: `1px solid ${B.borderLight}` }}
                        >
                          <td style={{ padding: '10px 12px' }}>
                            {formatDate(ob.periodStartDate)} to {formatDate(ob.periodEndDate)}
                          </td>
                          <td style={{ padding: '10px 12px' }}>{formatDate(ob.dueDate)}</td>
                          <td style={{ padding: '10px 12px' }}>
                            <StatusBadge status={ob.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function formatDate(d?: string | null): string {
  if (!d) return 'N/A'
  try {
    return new Date(d).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return d
  }
}

function formatCurrency(amount?: number | null): string {
  return `£${Math.abs(amount ?? 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`
}

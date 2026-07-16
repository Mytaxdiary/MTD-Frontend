import { useEffect, useState } from 'react'
import B from '@/styles/theme'
import { Card, CardHeader } from '@/components/ui/card'
import { mockClientQuarters as quarters } from '@/mocks/clients/clientDetailData'
import { clientsService } from '@/services/clients.service'
import type { ClientRecord } from '@/services/clients.service'
import { env } from '@/lib/env'
import ItsaStatusCard from '@/features/clients/ItsaStatusCard'
import BusinessesCard from '@/features/clients/BusinessesCard'
import ObligationsCard from '@/features/clients/ObligationsCard'
import type { BusinessListItem } from '@/services/clients.service'

// ── Received Files card ───────────────────────────────────────────────────────

interface PortalFile {
  id: string
  originalName: string
  size: number
  mimeType: string
  viewedByAgent: boolean
  createdAt: string
}

function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fmtShortDate(d: string): string {
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return d
  }
}

function ReceivedFilesCard({ clientId }: { clientId: string }) {
  const [files, setFiles] = useState<PortalFile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    clientsService.getPortalFiles(clientId)
      .then(setFiles)
      .catch(() => setFiles([]))
      .finally(() => setLoading(false))
  }, [clientId])

  const newCount = files.filter((f) => !f.viewedByAgent).length

  return (
    <Card>
      <CardHeader
        title="Received files"
        right={
          newCount > 0
            ? <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: '#DBEAFE', color: '#1D4ED8' }}>{newCount} new</span>
            : undefined
        }
      />
      <div style={{ padding: '4px 20px 12px' }}>
        {loading ? (
          <p style={{ fontSize: 13, color: B.muted, margin: '8px 0' }}>Loading...</p>
        ) : files.length === 0 ? (
          <p style={{ fontSize: 12, color: B.muted, margin: '8px 0' }}>No files uploaded by client yet.</p>
        ) : (
          files.slice(0, 5).map((f, i) => (
            <div
              key={f.id}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                borderBottom: i < Math.min(files.length, 5) - 1 ? `1px solid ${B.borderLight}` : 'none',
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>
                {f.mimeType.startsWith('image/') ? '🖼' : f.mimeType === 'application/pdf' ? '📄' : '📎'}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: !f.viewedByAgent ? 700 : 400, color: B.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {f.originalName}
                </div>
                <div style={{ fontSize: 11, color: B.muted }}>{fmtBytes(f.size)} · {fmtShortDate(f.createdAt)}</div>
              </div>
              <a
                href={`${env.apiBaseUrl}/clients/${clientId}/portal-files/${f.id}/download`}
                download={f.originalName}
                style={{ fontSize: 11, color: B.blueText, textDecoration: 'none', fontWeight: 500, flexShrink: 0 }}
              >
                ↓
              </a>
            </div>
          ))
        )}
        {files.length > 5 && (
          <p style={{ fontSize: 11, color: B.muted, margin: '8px 0 0' }}>+{files.length - 5} more files</p>
        )}
      </div>
    </Card>
  )
}

// ── Submission history (mock, shows when client not authorised) ───────────────

function SubmissionHistoryCard() {
  return (
    <Card>
      <CardHeader
        title="Submission history 2025-26"
        right={<span style={{ fontSize: 11, color: B.light }}>Read-only. Filed via your accounting software.</span>}
      />
      <div style={{ padding: '16px 20px' }}>
        {quarters.map((q, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'stretch' }}>
            <div style={{ width: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div
                style={{
                  width: 12, height: 12, borderRadius: 6, flexShrink: 0,
                  background: q.status === 'filed' ? B.green : B.light,
                  border: `2px solid ${B.white}`,
                  boxShadow: `0 0 0 2px ${q.status === 'filed' ? '#A7F3D0' : B.borderLight}`,
                }}
              />
              {i < quarters.length - 1 && (
                <div style={{ width: 2, flex: 1, background: B.borderLight, minHeight: 40 }} />
              )}
            </div>
            <div style={{ flex: 1, paddingBottom: 20, paddingLeft: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{q.q}</span>
                  <span style={{ fontSize: 12, color: B.muted, marginLeft: 10 }}>{q.period}</span>
                </div>
                {q.status === 'filed' && (
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20, background: B.greenBg, color: B.greenText, border: '1px solid #A7F3D0' }}>
                    Submitted {q.filed}
                  </span>
                )}
                {q.status === 'pending' && (
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20, background: B.surface, color: B.light, border: `1px solid ${B.borderLight}` }}>
                    Awaiting submission
                  </span>
                )}
              </div>
              {q.status === 'filed' && (
                <div style={{ display: 'flex', gap: 24, marginTop: 8, fontSize: 12, color: B.muted }}>
                  <span>Due: <b style={{ color: B.text }}>{q.due}</b></span>
                  <span>Income: <b style={{ color: B.text }}>£{(q.income || 0).toLocaleString()}</b></span>
                  <span>Expenses: <b style={{ color: B.text }}>£{(q.expenses || 0).toLocaleString()}</b></span>
                  <span>Net: <b style={{ color: B.text }}>£{((q.income || 0) - (q.expenses || 0)).toLocaleString()}</b></span>
                </div>
              )}
              {q.status === 'pending' && (
                <div style={{ marginTop: 8, fontSize: 12, color: B.light }}>Due: {q.due}, no data submitted yet</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Cumulative submitted figures (placeholder) ────────────────────────────────

function CumulativeFiguresCard() {
  return (
    <Card>
      <CardHeader
        title="Cumulative submitted figures"
        right={<span style={{ fontSize: 11, color: B.light }}>As reported to HMRC across filed quarters</span>}
      />
      <div style={{ padding: '16px 20px' }}>
        <div
          style={{
            padding: '14px 16px', background: B.navy, borderRadius: 10,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>CUMULATIVE NET PROFIT (SUBMITTED TO HMRC)</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'rgba(255,255,255,0.35)', marginTop: 4, letterSpacing: '-0.02em' }}>N/A</div>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Income', 'Expenses'].map((label) => (
              <div key={label} style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.3)', fontVariantNumeric: 'tabular-nums' }}>N/A</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: '10px 14px', background: B.purpleBg, borderRadius: 8, border: '1px solid #DDD6FE' }}>
          <span style={{ fontSize: 12, color: B.purpleText }}>
            Per-quarter income and expense figures will be available once the Income Sources API integration is live. Predictive tax liability will follow when Dashanalytix integration is live.
          </span>
        </div>
      </div>
    </Card>
  )
}

// ── Right column cards ────────────────────────────────────────────────────────

function fmtAuthDate(date?: string): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function ClientInfoCard({ client, displayNino }: { client: ClientRecord | null; displayNino: string }) {
  const rows: [string, string][] = [
    ['NINO', displayNino],
    ['Email', client?.email ?? 'Not set'],
    ['Postcode', client?.postcode ?? 'Not set'],
    ['Agent type', client?.agentType ?? 'Main agent'],
    ['Invitation status', client?.invitationStatus ?? 'Unknown'],
    ['Authorised since', fmtAuthDate(client?.authorisedAt)],
  ]
  return (
    <Card>
      <CardHeader title="Client details" />
      <div style={{ padding: '12px 20px' }}>
        {rows.map(([k, v], i) => (
          <div
            key={i}
            style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < rows.length - 1 ? `1px solid ${B.borderLight}` : 'none' }}
          >
            <span style={{ fontSize: 12, color: B.muted }}>{k}</span>
            <span style={{ fontSize: 12, fontWeight: 500, fontFamily: k === 'NINO' ? 'monospace' : 'inherit' }}>{v}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

function PaymentDetailsCard() {
  const bankRows: [string, string, number][] = [
    ['Sort code', '08-32-10', 0],
    ['Account number', '12001039', 1],
    ['Reference', 'Client UTR (10 digits)', 2],
  ]
  return (
    <Card>
      <CardHeader title="HMRC payment details" />
      <div style={{ padding: '12px 20px' }}>
        <div style={{ padding: '14px', background: B.blueBg, borderRadius: 8, border: '1px solid #BAE6FD', marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: B.blueText, marginBottom: 8 }}>Pay by bank transfer</div>
          {bankRows.map(([k, v, idx]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span style={{ fontSize: 12, color: '#0369A1' }}>{k}</span>
              <span style={{ fontSize: idx === 2 ? 11 : 13, fontWeight: 700, fontFamily: 'monospace', color: idx === 2 ? '#60A5FA' : B.blueText, fontStyle: idx === 2 ? 'italic' : 'normal' }}>
                {v}
              </span>
            </div>
          ))}
        </div>
        <div style={{ padding: '8px 10px', background: B.amberBg, border: '1px solid #FDE68A', borderRadius: 6, fontSize: 11, color: B.amberText, marginBottom: 10 }}>
          UTR will be shown here once the Individual Details API integration is live.
        </div>
        <a href="#" style={{ fontSize: 11, color: B.primary, textDecoration: 'none' }}>Pay online at gov.uk →</a>
      </div>
    </Card>
  )
}

// ── Main OverviewTab ──────────────────────────────────────────────────────────

interface OverviewTabProps {
  client: ClientRecord | null
  clientId: string | null
  displayNino: string
  onFirstBusiness: (b: BusinessListItem | null) => void
}

export default function OverviewTab({
  client,
  clientId,
  displayNino,
  onFirstBusiness,
}: OverviewTabProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
      {/* Left column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {client && <ItsaStatusCard client={client} />}
        {client && <BusinessesCard client={client} onFirstBusiness={onFirstBusiness} />}
        {client && <ObligationsCard client={client} />}

        {(!client || !client.authorisedAt) && <SubmissionHistoryCard />}

        <CumulativeFiguresCard />
      </div>

      {/* Right column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <ClientInfoCard client={client} displayNino={displayNino} />
        <PaymentDetailsCard />
        {clientId && <ReceivedFilesCard clientId={clientId} />}
      </div>
    </div>
  )
}

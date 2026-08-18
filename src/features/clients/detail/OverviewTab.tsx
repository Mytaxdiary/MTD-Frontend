import { useEffect, useState } from 'react'
import B from '@/styles/theme'
import { Card, CardHeader } from '@/components/ui/card'
import { mockClientQuarters as quarters } from '@/mocks/clients/clientDetailData'
import { clientsService } from '@/services/clients.service'
import type { ClientRecord, SubmittedFiguresResponse } from '@/services/clients.service'
import axiosClient from '@/lib/api/axiosClient'
import ItsaStatusCard from '@/features/clients/ItsaStatusCard'

import BusinessesCard from '@/features/clients/BusinessesCard'
import ObligationsCard from '@/features/clients/ObligationsCard'
import MtdScopeNotice from '@/components/ui/MtdScopeNotice'
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
    return new Date(d).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return d
  }
}

function ReceivedFilesCard({ clientId }: { clientId: string }) {
  const [files, setFiles] = useState<PortalFile[]>([])
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleDownload = async (fileId: string, fileName: string) => {
    setDownloading(fileId)
    try {
      const res = await axiosClient.get<Blob>(
        `/clients/${clientId}/portal-files/${fileId}/download`,
        { responseType: 'blob' }
      )
      const url = URL.createObjectURL(res.data)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      // silently ignore — file may not exist
    } finally {
      setDownloading(null)
    }
  }

  useEffect(() => {
    clientsService
      .getPortalFiles(clientId)
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
          newCount > 0 ? (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 10,
                background: '#DBEAFE',
                color: '#1D4ED8',
              }}
            >
              {newCount} new
            </span>
          ) : undefined
        }
      />
      <div style={{ padding: '4px 20px 12px' }}>
        {loading ? (
          <p style={{ fontSize: 13, color: B.muted, margin: '8px 0' }}>Loading...</p>
        ) : files.length === 0 ? (
          <p style={{ fontSize: 12, color: B.muted, margin: '8px 0' }}>
            No files uploaded by client yet.
          </p>
        ) : (
          files.slice(0, 5).map((f, i) => (
            <div
              key={f.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 0',
                borderBottom:
                  i < Math.min(files.length, 5) - 1 ? `1px solid ${B.borderLight}` : 'none',
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>
                {f.mimeType.startsWith('image/')
                  ? '🖼'
                  : f.mimeType === 'application/pdf'
                    ? '📄'
                    : '📎'}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: !f.viewedByAgent ? 700 : 400,
                    color: B.text,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {f.originalName}
                </div>
                <div style={{ fontSize: 11, color: B.muted }}>
                  {fmtBytes(f.size)} · {fmtShortDate(f.createdAt)}
                </div>
              </div>
              <button
                onClick={() => void handleDownload(f.id, f.originalName)}
                disabled={downloading === f.id}
                style={{
                  fontSize: 11,
                  color: downloading === f.id ? B.muted : B.blueText,
                  background: 'none',
                  border: 'none',
                  fontWeight: 500,
                  flexShrink: 0,
                  cursor: downloading === f.id ? 'not-allowed' : 'pointer',
                  padding: '2px 6px',
                }}
              >
                {downloading === f.id ? '...' : '↓'}
              </button>
            </div>
          ))
        )}
        {files.length > 5 && (
          <p style={{ fontSize: 11, color: B.muted, margin: '8px 0 0' }}>
            +{files.length - 5} more files
          </p>
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
        right={
          <span style={{ fontSize: 11, color: B.light }}>
            Read-only. Filed via your accounting software.
          </span>
        }
      />
      <div style={{ padding: '16px 20px' }}>
        {quarters.map((q, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'stretch' }}>
            <div
              style={{
                width: 32,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  flexShrink: 0,
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
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>{q.q}</span>
                  <span style={{ fontSize: 12, color: B.muted, marginLeft: 10 }}>{q.period}</span>
                </div>
                {q.status === 'filed' && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 10px',
                      borderRadius: 20,
                      background: B.greenBg,
                      color: B.greenText,
                      border: '1px solid #A7F3D0',
                    }}
                  >
                    Submitted {q.filed}
                  </span>
                )}
                {q.status === 'pending' && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 10px',
                      borderRadius: 20,
                      background: B.surface,
                      color: B.light,
                      border: `1px solid ${B.borderLight}`,
                    }}
                  >
                    Awaiting submission
                  </span>
                )}
              </div>
              {q.status === 'filed' && (
                <div
                  style={{ display: 'flex', gap: 24, marginTop: 8, fontSize: 12, color: B.muted }}
                >
                  <span>
                    Due: <b style={{ color: B.text }}>{q.due}</b>
                  </span>
                  <span>
                    Income: <b style={{ color: B.text }}>£{(q.income || 0).toLocaleString()}</b>
                  </span>
                  <span>
                    Expenses: <b style={{ color: B.text }}>£{(q.expenses || 0).toLocaleString()}</b>
                  </span>
                  <span>
                    Net:{' '}
                    <b style={{ color: B.text }}>
                      £{((q.income || 0) - (q.expenses || 0)).toLocaleString()}
                    </b>
                  </span>
                </div>
              )}
              {q.status === 'pending' && (
                <div style={{ marginTop: 8, fontSize: 12, color: B.light }}>
                  Due: {q.due}, no data submitted yet
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Cumulative submitted figures (BISS + period / cumulative summaries) ───────

function fmtGbp(n: number): string {
  return `£${n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

function fmtShort(d?: string): string {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return d
  }
}

function CumulativeFiguresCard({ client }: { client: ClientRecord | null }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<SubmittedFiguresResponse | null>(null)

  useEffect(() => {
    if (!client?.id || !client.authorisedAt) {
      setData(null)
      setError(null)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    clientsService
      .getSubmittedFigures(client.id)
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setData(null)
          setError((err as Error)?.message ?? 'Failed to load submitted figures from HMRC.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [client?.id, client?.authorisedAt])

  const netDisplay =
    data == null
      ? null
      : data.netLoss > 0
        ? -data.netLoss
        : data.netProfit

  return (
    <Card>
      <CardHeader
        title="Cumulative submitted figures"
        right={
          <span style={{ fontSize: 11, color: B.light }}>
            {data ? `Tax year ${data.taxYear} · BISS + period summaries` : 'As reported to HMRC'}
          </span>
        }
      />
      <div style={{ padding: '16px 20px' }}>
        {!client?.authorisedAt && (
          <div
            style={{
              padding: '10px 14px',
              background: B.amberBg,
              borderRadius: 8,
              border: '1px solid #FDE68A',
              fontSize: 12,
              color: B.amberText,
            }}
          >
            Authorise this client with HMRC to load submitted income and expenses.
          </div>
        )}

        {client?.authorisedAt && loading && (
          <p style={{ fontSize: 13, color: B.muted, margin: 0 }}>Loading submitted figures...</p>
        )}

        {client?.authorisedAt && error && (
          <div
            style={{
              padding: '10px 14px',
              background: B.redBg,
              borderRadius: 8,
              border: '1px solid #FECACA',
              fontSize: 12,
              color: B.redText,
            }}
          >
            {error}
          </div>
        )}

        {client?.authorisedAt && !loading && !error && data && (
          <>
            <div
              style={{
                padding: '14px 16px',
                background: B.navy,
                borderRadius: 10,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                  CUMULATIVE NET {netDisplay != null && netDisplay < 0 ? 'LOSS' : 'PROFIT'} (SUBMITTED
                  TO HMRC)
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: '#fff',
                    marginTop: 4,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {netDisplay == null
                    ? '£0'
                    : netDisplay < 0
                      ? `-${fmtGbp(Math.abs(netDisplay))}`
                      : fmtGbp(netDisplay)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 24 }}>
                {[
                  ['Income', data.totalIncome],
                  ['Expenses', data.totalExpenses],
                ].map(([label, value]) => (
                  <div key={label as string} style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{label}</div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#fff',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {fmtGbp(value as number)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {data.periods.length === 0 ? (
              <div
                style={{
                  padding: '10px 14px',
                  background: B.surface,
                  borderRadius: 8,
                  border: `1px solid ${B.borderLight}`,
                  fontSize: 12,
                  color: B.muted,
                }}
              >
                No quarterly period summaries found for this tax year yet. YTD totals above come from
                HMRC Business Income Source Summary when available.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {data.periods.map((p, i) => (
                  <div
                    key={`${p.businessId}-${p.periodId ?? i}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 0',
                      borderBottom:
                        i < data.periods.length - 1 ? `1px solid ${B.borderLight}` : 'none',
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: B.text }}>
                        {p.label}
                        {p.tradingName ? (
                          <span style={{ fontWeight: 500, color: B.muted, marginLeft: 8 }}>
                            {p.tradingName}
                          </span>
                        ) : null}
                      </div>
                      <div style={{ fontSize: 11, color: B.light, marginTop: 2 }}>
                        {[
                          p.typeOfBusiness.replace(/-/g, ' '),
                          p.cumulative
                            ? 'Cumulative submission'
                            : [fmtShort(p.periodStartDate), fmtShort(p.periodEndDate)]
                                .filter(Boolean)
                                .join(' – '),
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: 16,
                        fontSize: 12,
                        fontVariantNumeric: 'tabular-nums',
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ color: B.muted }}>
                        Inc <b style={{ color: B.text }}>{fmtGbp(p.income)}</b>
                      </span>
                      <span style={{ color: B.muted }}>
                        Exp <b style={{ color: B.text }}>{fmtGbp(p.expenses)}</b>
                      </span>
                      <span style={{ color: B.muted }}>
                        Net{' '}
                        <b style={{ color: p.net < 0 ? B.redText : B.text }}>
                          {p.net < 0 ? `-${fmtGbp(Math.abs(p.net))}` : fmtGbp(p.net)}
                        </b>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  )
}

// ── Right column cards ────────────────────────────────────────────────────────

function fmtAuthDate(date?: string): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function ClientInfoCard({
  client,
  clientId,
  displayNino,
  onClientUpdated,
}: {
  client: ClientRecord | null
  clientId: string | null
  displayNino: string
  onClientUpdated?: (client: ClientRecord) => void
}) {
  const [preferredName, setPreferredName] = useState(client?.preferredName ?? '')
  const [editingPreferred, setEditingPreferred] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    setPreferredName(client?.preferredName ?? '')
  }, [client?.preferredName, client?.id])

  const rows: [string, string][] = [
    ['Full name', client?.name ?? 'Not set'],
    ['NINO', displayNino],
    ['Email', client?.email ?? 'Not set'],
    ['Postcode', client?.postcode ?? 'Not set'],
    ['Agent type', client?.agentType ?? 'Main agent'],
    ['Invitation status', client?.invitationStatus ?? 'Unknown'],
    ['Authorised since', fmtAuthDate(client?.authorisedAt)],
  ]

  const firstNameFallback = client?.name?.trim().split(/\s+/)[0] || 'first name'

  const handleEditPreferred = () => {
    setDraft(preferredName)
    setSaveError(null)
    setEditingPreferred(true)
  }

  const handleSavePreferred = async () => {
    if (!clientId) return
    const trimmed = draft.trim()
    if (trimmed.length > 80) {
      setSaveError('Preferred name must be 80 characters or fewer')
      return
    }
    setSaving(true)
    setSaveError(null)
    try {
      const updated = await clientsService.updateClient(clientId, {
        preferredName: trimmed,
      })
      setPreferredName(updated.preferredName ?? '')
      setEditingPreferred(false)
      onClientUpdated?.(updated)
    } catch {
      setSaveError('Failed to save preferred name. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader title="Client details" />
      <div style={{ padding: '12px 20px' }}>
        {rows.map(([k, v], i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 12,
              padding: '7px 0',
              borderBottom: `1px solid ${B.borderLight}`,
            }}
          >
            <span style={{ fontSize: 13, color: B.muted }}>{k}</span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                fontFamily: k === 'NINO' ? 'monospace' : 'inherit',
                textAlign: 'right',
              }}
            >
              {v}
            </span>
          </div>
        ))}

        {/* Preferred name — used in chase email greetings */}
        <div style={{ padding: '10px 0 4px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 10,
              marginBottom: editingPreferred ? 8 : 0,
            }}
          >
            <div>
              <div style={{ fontSize: 13, color: B.muted }}>Preferred name</div>
              <div style={{ fontSize: 11, color: B.light, marginTop: 2 }}>
                Used in chase emails as {'{name}'}. Defaults to {firstNameFallback}.
              </div>
            </div>
            {!editingPreferred && clientId && (
              <button
                type="button"
                onClick={handleEditPreferred}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: `1px solid ${B.border}`,
                  background: B.white,
                  fontSize: 12,
                  fontWeight: 600,
                  color: B.link,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                Edit
              </button>
            )}
          </div>

          {editingPreferred ? (
            <div>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Preferred name (or leave blank for first name)"
                maxLength={80}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 7,
                  border: `1px solid ${B.border}`,
                  fontSize: 13,
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
              {saveError && (
                <div style={{ fontSize: 12, color: B.redText, marginTop: 6 }}>{saveError}</div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={handleSavePreferred}
                  disabled={saving}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: 'none',
                    background: B.primary,
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPreferred(false)
                    setSaveError(null)
                  }}
                  disabled={saving}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    border: `1px solid ${B.border}`,
                    background: B.white,
                    fontSize: 12,
                    color: B.muted,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: preferredName ? B.text : B.light,
                fontStyle: preferredName ? 'normal' : 'italic',
                marginTop: 6,
              }}
            >
              {preferredName || `Not set (will use ${firstNameFallback})`}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

function PaymentDetailsCard({
  clientId,
  utr: initialUtr,
}: {
  clientId: string | null
  utr?: string
}) {
  const [utr, setUtr] = useState(initialUtr ?? '')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const bankRows: [string, string][] = [
    ['Sort code', '08-32-10'],
    ['Account number', '12001039'],
  ]

  const handleEdit = () => {
    setDraft(utr)
    setSaveError(null)
    setEditing(true)
  }

  const handleSave = async () => {
    if (!clientId) return
    if (draft && !/^\d{10}$/.test(draft)) {
      setSaveError('UTR must be exactly 10 digits')
      return
    }
    setSaving(true)
    setSaveError(null)
    try {
      const updated = await clientsService.updateClient(clientId, { utr: draft || undefined })
      setUtr(updated.utr ?? '')
      setEditing(false)
    } catch {
      setSaveError('Failed to save UTR. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader title="HMRC payment details" />
      <div style={{ padding: '12px 20px' }}>
        <div
          style={{
            padding: '14px',
            background: B.blueBg,
            borderRadius: 8,
            border: '1px solid #BAE6FD',
            marginBottom: 10,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 600, color: B.blueText, marginBottom: 8 }}>
            Pay by bank transfer
          </div>
          {bankRows.map(([k, v]) => (
            <div
              key={k}
              style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}
            >
              <span style={{ fontSize: 13, color: '#0369A1' }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: B.blueText }}>
                {v}
              </span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#0369A1' }}>Reference (UTR)</span>
            {editing ? (
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10 digits"
                  style={{
                    width: 110,
                    fontSize: 13,
                    fontFamily: 'monospace',
                    padding: '3px 8px',
                    border: `1px solid ${saveError ? '#F87171' : '#BAE6FD'}`,
                    borderRadius: 5,
                    outline: 'none',
                    background: '#fff',
                  }}
                />
                <button
                  onClick={() => void handleSave()}
                  disabled={saving}
                  style={{ fontSize: 11, color: B.blueText, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  {saving ? '...' : 'Save'}
                </button>
                <button
                  onClick={() => { setEditing(false); setSaveError(null) }}
                  style={{ fontSize: 11, color: B.muted, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: utr ? B.blueText : '#60A5FA', fontStyle: utr ? 'normal' : 'italic' }}>
                  {utr || 'Not set'}
                </span>
                {clientId && (
                  <button
                    onClick={handleEdit}
                    style={{ fontSize: 10, color: B.muted, background: 'none', border: 'none', cursor: 'pointer', padding: '1px 4px' }}
                  >
                    Edit
                  </button>
                )}
              </div>
            )}
          </div>
          {saveError && (
            <div style={{ fontSize: 11, color: '#EF4444', marginTop: 4 }}>{saveError}</div>
          )}
        </div>
        <a href="https://www.gov.uk/pay-self-assessment-tax-bill" target="_blank" rel="noreferrer" style={{ fontSize: 11, color: B.primary, textDecoration: 'none' }}>
          Pay online at gov.uk →
        </a>
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
  onClientUpdated?: (client: ClientRecord) => void
}

export default function OverviewTab({
  client,
  clientId,
  displayNino,
  onFirstBusiness,
  onClientUpdated,
}: OverviewTabProps) {
  const [hmrcBusinesses, setHmrcBusinesses] = useState<BusinessListItem[]>([])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
      {/* Left column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <MtdScopeNotice />
        {client && <ItsaStatusCard client={client} />}
        {client && (
          <BusinessesCard
            client={client}
            onFirstBusiness={onFirstBusiness}
            onBusinesses={setHmrcBusinesses}
          />
        )}
        {client && <ObligationsCard client={client} businesses={hmrcBusinesses} />}

        {(!client || !client.authorisedAt) && <SubmissionHistoryCard />}

        <CumulativeFiguresCard client={client} />
      </div>

      {/* Right column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <ClientInfoCard
          client={client}
          clientId={clientId}
          displayNino={displayNino}
          onClientUpdated={onClientUpdated}
        />
        <PaymentDetailsCard clientId={clientId} utr={client?.utr} />
        {clientId && <ReceivedFilesCard clientId={clientId} />}
      </div>
    </div>
  )
}

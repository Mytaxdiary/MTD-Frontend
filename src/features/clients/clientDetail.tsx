'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  mockClientQuarters as quarters,
  mockChaseLog as chaseLog,
} from '@/mocks/clients/clientDetailData'

import B from '@/styles/theme'
import { Card, CardHeader } from '@/components/ui/card'
import { useCurrentUser } from '@/components/auth/CurrentUserProvider'
import {
  clientsService,
  type BusinessListItem,
  type ClientRecord,
} from '@/services/clients.service'
import axiosClient from '@/lib/api/axiosClient'
import { env } from '@/lib/env'
import ItsaStatusCard from '@/features/clients/ItsaStatusCard'
import BusinessesCard from '@/features/clients/BusinessesCard'
import ObligationsCard from '@/features/clients/ObligationsCard'
import LiabilitiesTab from '@/features/clients/LiabilitiesTab'
import ChasingTab from '@/features/clients/ChasingTab'
import NotesTab from '@/features/clients/NotesTab'

function clientInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function fmtAuthDate(date?: string): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// ── Received Files card (portal file drops) ──────────────────────────────────

function ReceivedFilesCard({ clientId }: { clientId: string }) {
  const [files, setFiles] = useState<Array<{
    id: string; originalName: string; size: number; mimeType: string;
    viewedByAgent: boolean; createdAt: string
  }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    clientsService.getPortalFiles(clientId)
      .then(setFiles)
      .catch(() => setFiles([]))
      .finally(() => setLoading(false))
  }, [clientId])

  function fmt(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  function fmtD(d: string) {
    try { return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }
    catch { return d }
  }

  const newCount = files.filter((f) => !f.viewedByAgent).length

  return (
    <Card>
      <CardHeader
        title="Received files"
        right={
          newCount > 0
            ? <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: '#DBEAFE', color: '#1D4ED8' }}>
                {newCount} new
              </span>
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
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 0',
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
                <div style={{ fontSize: 11, color: B.muted }}>{fmt(f.size)} · {fmtD(f.createdAt)}</div>
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

// ─────────────────────────────────────────────────────────────────────────────

export default function ClientDetail({
  clientId = null,
  navigate = () => {},
}: {
  clientId?: string | null
  navigate?: (route: string) => void
}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [client, setClient] = useState<ClientRecord | null>(null)
  const [clientLoading, setClientLoading] = useState(!!clientId)
  const [clientError, setClientError] = useState<string | null>(null)

  // Live business data lifted from BusinessesCard
  const [firstBusiness, setFirstBusiness] = useState<BusinessListItem | null>(null)

  // Live outstanding balance from SA Accounts API
  const [outstandingBalance, setOutstandingBalance] = useState<number | null>(null)

  // View client portal (preview)
  const [previewLoading, setPreviewLoading] = useState(false)

  // Message client modal
  const [showMsgModal, setShowMsgModal] = useState(false)
  const [msgSubject, setMsgSubject]     = useState('')
  const [msgBody, setMsgBody]           = useState('')
  const [msgSending, setMsgSending]     = useState(false)
  const [msgSuccess, setMsgSuccess]     = useState(false)
  const [msgError, setMsgError]         = useState('')
  const msgBodyRef = useRef<HTMLTextAreaElement>(null)

  const { user } = useCurrentUser()

  console.log("clientId", outstandingBalance)
  useEffect(() => {
    if (!clientId) {
      setClient(null)
      setClientLoading(false)
      return
    }
    setClientLoading(true)
    setClientError(null)
    clientsService
      .getOne(clientId)
      .then(setClient)
      .catch((err: unknown) => {
        setClientError((err as Error)?.message ?? 'Failed to load client.')
        setClient(null)
      })
      .finally(() => setClientLoading(false))
  }, [clientId])

  const fetchOutstanding = useCallback(async (id: string) => {
    try {
      const data = await clientsService.getBalanceAndTransactions(id, {
        onlyOpenItems: true,
      })
      setOutstandingBalance(data.balanceDetails?.totalBalance ?? null)
    } catch {
      setOutstandingBalance(null)
    }
  }, [])

  useEffect(() => {
    if (client?.authorisedAt) {
      void fetchOutstanding(client.id)
    } else {
      setOutstandingBalance(null)
    }
  }, [client?.id, client?.authorisedAt, fetchOutstanding])

  const displayName = client?.name ?? 'Priya Sharma'
  const displayNino = client?.nino ?? '-'
  const mtdBadge = client?.authorisedAt
    ? 'MTD Authorised'
    : client?.invitationStatus === 'accepted'
      ? 'Invite accepted'
      : 'MTD Pending'

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: '12px 32px',
          background: B.white,
          borderBottom: `1px solid ${B.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 13,
          flexShrink: 0,
        }}
      >
        <span
          style={{ color: B.primary, cursor: 'pointer', fontWeight: 500 }}
          onClick={() => navigate('clients')}
        >
          Clients
        </span>
        <span style={{ color: B.xlight }}>/</span>
        <span style={{ fontWeight: 600 }}>{clientLoading ? 'Loading...' : displayName}</span>
      </div>

      <div
        style={{
          padding: '24px 32px 20px',
          background: B.white,
          borderBottom: `1px solid ${B.border}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: 'linear-gradient(135deg,#E0F2FE,#BAE6FD)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                fontWeight: 700,
                color: B.blueText,
              }}
            >
              {client ? clientInitials(client.name) : 'PS'}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
                {displayName}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                  marginTop: 4,
                  flexWrap: 'wrap',
                }}
              >
                {firstBusiness ? (
                  <>
                    {firstBusiness.tradingName && (
                      <>
                        <span style={{ fontSize: 13, color: B.muted }}>
                          {firstBusiness.tradingName}
                        </span>
                        <span style={{ width: 4, height: 4, borderRadius: 2, background: B.xlight }} />
                      </>
                    )}
                    <span style={{ fontSize: 12, color: B.muted, textTransform: 'capitalize' }}>
                      {firstBusiness.typeOfBusiness.replace(/-/g, ' ')}
                    </span>
                    <span style={{ width: 4, height: 4, borderRadius: 2, background: B.xlight }} />
                  </>
                ) : null}
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
                  {mtdBadge}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '2px 10px',
                    borderRadius: 20,
                    background: B.blueBg,
                    color: B.blueText,
                    border: '1px solid #BAE6FD',
                  }}
                >
                  Main agent
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: `1px solid ${B.border}`,
                background: B.white,
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                color: B.text,
              }}
            >
              Chase client
            </button>
            <button
              onClick={() => { setShowMsgModal(true); setMsgSuccess(false); setMsgError('') }}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: `1px solid ${B.border}`,
                background: B.white,
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                color: B.text,
              }}
            >
              Message client
            </button>
            <button
              disabled={previewLoading || !clientId}
              onClick={async () => {
                if (!clientId) return
                setPreviewLoading(true)
                try {
                  const res = await axiosClient.post<{ data: { previewToken: string } }>(
                    `/clients/${clientId}/portal-preview-token`,
                  )
                  const token = res.data.data.previewToken
                  window.open(`/portal/preview?token=${token}`, '_blank')
                } catch {
                  alert('Could not open portal preview. Please try again.')
                } finally {
                  setPreviewLoading(false)
                }
              }}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                background: previewLoading ? B.muted : B.primary,
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                cursor: previewLoading ? 'not-allowed' : 'pointer',
                opacity: previewLoading ? 0.7 : 1,
              }}
            >
              {previewLoading ? 'Opening...' : 'View client portal'}
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 0, marginTop: 20 }}>
          {['overview', 'liabilities', 'chasing', 'notes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 20px',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                border: 'none',
                background: 'transparent',
                color: activeTab === tab ? B.primary : B.muted,
                borderBottom: `2px solid ${activeTab === tab ? B.primary : 'transparent'}`,
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '24px 32px', flex: 1 }}>
        {/* Summary strip */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          {(() => {
            const outstanding = outstandingBalance
            console.log("outstanding1", outstanding)
            const outstandingColor =
              outstanding != null && outstanding > 0 ? B.red : B.green
            const metrics = [
              {
                label: 'Submitted income (YTD)',
                value: 'N/A',
                sub: 'Available via Income Sources API',
                color: B.green,
              },
              {
                label: 'Submitted expenses (YTD)',
                value: 'N/A',
                sub: 'Available via Income Sources API',
                color: B.amber,
              },
              {
                label: 'Submitted net profit',
                value: 'N/A',
                sub: 'Available via Income Sources API',
                color: B.primary,
              },
              {
                label: 'Outstanding to HMRC',
                value:
                  outstanding != null
                    ? `£${outstanding.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
                    : 'N/A',
                sub:
                  outstanding == null
                    ? client?.authorisedAt
                      ? 'Loading...'
                      : 'Authorise client to load'
                    : outstanding > 0
                      ? 'Payment due'
                      : 'All clear',
                color: outstanding != null ? outstandingColor : B.light,
              },
            ]
            return metrics.map((m, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  background: B.white,
                  borderRadius: 10,
                  padding: '14px 16px',
                  border: `1px solid ${B.border}`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: m.color,
                  }}
                />
                <div
                  style={{ fontSize: 11, fontWeight: 500, color: B.muted, letterSpacing: '0.02em' }}
                >
                  {m.label}
                </div>
                <div
                  style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 3, color: i < 3 ? B.light : B.text }}
                >
                  {m.value}
                </div>
                <div style={{ fontSize: 11, color: B.light, marginTop: 2 }}>{m.sub}</div>
              </div>
            ))
          })()}
        </div>

        {clientError && (
          <div
            style={{
              marginBottom: 16,
              padding: '10px 12px',
              background: B.redBg,
              border: '1px solid #FECACA',
              borderRadius: 8,
              fontSize: 12,
              color: B.redText,
            }}
          >
            {clientError}
          </div>
        )}

        {!clientId && (
          <div
            style={{
              marginBottom: 16,
              padding: '10px 12px',
              background: B.amberBg,
              border: '1px solid #FDE68A',
              borderRadius: 8,
              fontSize: 12,
              color: B.amberText,
            }}
          >
            Open a client from the Clients list to view live HMRC ITSA status. Demo layout below uses
            sample data.
          </div>
        )}

        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {client && <ItsaStatusCard client={client} />}
              {client && (
                <BusinessesCard client={client} onFirstBusiness={setFirstBusiness} />
              )}
              {client && <ObligationsCard client={client} />}

              {/* Submission history — demo mock when client not yet HMRC-authorised */}
              {(!client || !client.authorisedAt) && (
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
                          <div
                            style={{ width: 2, flex: 1, background: B.borderLight, minHeight: 40 }}
                          />
                        )}
                      </div>
                      <div style={{ flex: 1, paddingBottom: 20, paddingLeft: 12 }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <span style={{ fontSize: 14, fontWeight: 700 }}>{q.q}</span>
                            <span style={{ fontSize: 12, color: B.muted, marginLeft: 10 }}>
                              {q.period}
                            </span>
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
                            style={{
                              display: 'flex',
                              gap: 24,
                              marginTop: 8,
                              fontSize: 12,
                              color: B.muted,
                            }}
                          >
                            <span>
                              Due: <b style={{ color: B.text }}>{q.due}</b>
                            </span>
                            <span>
                              Income:{' '}
                              <b style={{ color: B.text }}>£{(q.income || 0).toLocaleString()}</b>
                            </span>
                            <span>
                              Expenses:{' '}
                              <b style={{ color: B.text }}>£{(q.expenses || 0).toLocaleString()}</b>
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
              )}

              {/* Cumulative submitted figures */}
              <Card>
                <CardHeader
                  title="Cumulative submitted figures"
                  right={
                    <span style={{ fontSize: 11, color: B.light }}>
                      As reported to HMRC across filed quarters
                    </span>
                  }
                />
                <div style={{ padding: '16px 20px' }}>
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
                        CUMULATIVE NET PROFIT (SUBMITTED TO HMRC)
                      </div>
                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: 800,
                          color: 'rgba(255,255,255,0.35)',
                          marginTop: 4,
                          letterSpacing: '-0.02em',
                        }}
                      >
                        N/A
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 24 }}>
                      {['Income', 'Expenses'].map((label) => (
                        <div key={label} style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{label}</div>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: 'rgba(255,255,255,0.3)',
                              fontVariantNumeric: 'tabular-nums',
                            }}
                          >
                            N/A
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '10px 14px',
                      background: B.purpleBg,
                      borderRadius: 8,
                      border: '1px solid #DDD6FE',
                    }}
                  >
                    <span style={{ fontSize: 12, color: B.purpleText }}>
                      Per-quarter income and expense figures will be available once the Income Sources
                      API integration is live. Predictive tax liability will follow when Dashanalytix
                      integration is live.
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Card>
                <CardHeader title="Client details" />
                <div style={{ padding: '12px 20px' }}>
                  {[
                    ['NINO', displayNino],
                    ['Email', client?.email ?? 'Not set'],
                    ['Postcode', client?.postcode ?? 'Not set'],
                    ['Agent type', client?.agentType ?? 'Main agent'],
                    ['Invitation status', client?.invitationStatus ?? 'Unknown'],
                    ['Authorised since', fmtAuthDate(client?.authorisedAt)],
                  ].map(([k, v], i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '7px 0',
                        borderBottom: i < 5 ? `1px solid ${B.borderLight}` : 'none',
                      }}
                    >
                      <span style={{ fontSize: 12, color: B.muted }}>{k}</span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 500,
                          fontFamily: k === 'NINO' ? 'monospace' : 'inherit',
                        }}
                      >
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

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
                    <div
                      style={{ fontSize: 11, fontWeight: 600, color: B.blueText, marginBottom: 8 }}
                    >
                      Pay by bank transfer
                    </div>
                    {[
                      ['Sort code', '08-32-10'],
                      ['Account number', '12001039'],
                      ['Reference', 'Client UTR (10 digits)'],
                    ].map(([k, v], i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '4px 0',
                        }}
                      >
                        <span style={{ fontSize: 12, color: '#0369A1' }}>{k}</span>
                        <span
                          style={{
                            fontSize: i === 2 ? 11 : 13,
                            fontWeight: 700,
                            fontFamily: 'monospace',
                            color: i === 2 ? '#60A5FA' : B.blueText,
                            fontStyle: i === 2 ? 'italic' : 'normal',
                          }}
                        >
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      padding: '8px 10px',
                      background: B.amberBg,
                      border: '1px solid #FDE68A',
                      borderRadius: 6,
                      fontSize: 11,
                      color: B.amberText,
                      marginBottom: 10,
                    }}
                  >
                    UTR will be shown here once the Individual Details API integration is live.
                  </div>
                  <a href="#" style={{ fontSize: 11, color: B.primary, textDecoration: 'none' }}>
                    Pay online at gov.uk →
                  </a>
                </div>
              </Card>

              <Card>
                <CardHeader
                  title="Chase history"
                  right={
                    <button
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '4px 12px',
                        borderRadius: 6,
                        border: `1px solid ${B.border}`,
                        background: 'transparent',
                        cursor: 'pointer',
                        color: B.muted,
                      }}
                    >
                      Send chase
                    </button>
                  }
                />
                <div style={{ padding: '4px 20px 12px' }}>
                  {chaseLog.map((c, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '10px 0',
                        borderBottom:
                          i < chaseLog.length - 1 ? `1px solid ${B.borderLight}` : 'none',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 4,
                              background: B.blueBg,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 10,
                              color: B.blueText,
                            }}
                          >
                            @
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 500 }}>{c.msg}</span>
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            padding: '2px 8px',
                            borderRadius: 10,
                            background: c.status === 'Responded' ? B.greenBg : B.amberBg,
                            color: c.status === 'Responded' ? B.greenText : B.amberText,
                          }}
                        >
                          {c.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: B.light, marginTop: 3, paddingLeft: 28 }}>
                        {c.date}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Received Files from client portal */}
              {clientId && <ReceivedFilesCard clientId={clientId} />}

              <Card>
                <CardHeader title="Accountant notes" />
                <div style={{ padding: '12px 20px' }}>
                  <div
                    style={{
                      padding: 12,
                      background: B.surface,
                      borderRadius: 8,
                      fontSize: 12,
                      color: B.muted,
                      lineHeight: 1.6,
                      border: `1px solid ${B.borderLight}`,
                    }}
                  >
                    Client uses Xero for bookkeeping. Submits own Q updates via Xero. We monitor and chase. 2nd POA due 31 Jul, remind client. May exceed £90k next year.
                  </div>
                  <div style={{ fontSize: 10, color: B.light, marginTop: 6 }}>
                    Last edited 22 Apr 2026 by {user?.name ?? 'you'}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'liabilities' && client && (
          <LiabilitiesTab client={client} />
        )}

        {activeTab === 'liabilities' && !client && (
          <div
            style={{
              padding: '10px 12px',
              background: B.amberBg,
              border: '1px solid #FDE68A',
              borderRadius: 8,
              fontSize: 12,
              color: B.amberText,
            }}
          >
            Open a client from the Clients list to view HMRC liabilities.
          </div>
        )}

        {activeTab === 'chasing' && <ChasingTab clientId={clientId} />}

        {activeTab === 'notes' && <NotesTab />}
      </div>

      {/* Message client modal */}
      {showMsgModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowMsgModal(false) }}
        >
          <div
            style={{
              background: B.white, borderRadius: 12, width: 520, maxWidth: '95vw',
              boxShadow: '0 8px 32px rgba(0,0,0,0.18)', overflow: 'hidden',
            }}
          >
            <div style={{ padding: '18px 24px', borderBottom: `1px solid ${B.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: B.text }}>
                Message {client?.name ?? 'client'}
              </span>
              <button onClick={() => setShowMsgModal(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: B.muted }}>✕</button>
            </div>
            <div style={{ padding: '20px 24px' }}>
              {msgSuccess ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>✓</div>
                  <p style={{ fontSize: 14, color: B.greenText, fontWeight: 600, margin: 0 }}>Message sent successfully</p>
                  <p style={{ fontSize: 13, color: B.muted, marginTop: 6 }}>The client will receive an email notification and can read it in their portal.</p>
                  <button
                    onClick={() => { setShowMsgModal(false); setMsgSubject(''); setMsgBody('') }}
                    style={{ marginTop: 16, padding: '8px 20px', background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <label style={{ display: 'block', marginBottom: 14 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: B.text }}>Subject</span>
                    <input
                      value={msgSubject}
                      onChange={(e) => setMsgSubject(e.target.value)}
                      placeholder="e.g. Your Q2 records are ready"
                      style={{ display: 'block', width: '100%', marginTop: 5, padding: '9px 12px', borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, boxSizing: 'border-box', outline: 'none' }}
                    />
                  </label>
                  <label style={{ display: 'block', marginBottom: 16 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: B.text }}>Message</span>
                    <textarea
                      ref={msgBodyRef}
                      value={msgBody}
                      onChange={(e) => setMsgBody(e.target.value)}
                      rows={6}
                      placeholder="Write your message here..."
                      style={{ display: 'block', width: '100%', marginTop: 5, padding: '9px 12px', borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, boxSizing: 'border-box', resize: 'vertical', outline: 'none' }}
                    />
                  </label>
                  {msgError && (
                    <div style={{ background: B.redBg, border: `1px solid #FECACA`, borderRadius: 8, padding: '8px 12px', fontSize: 12, color: B.redText, marginBottom: 14 }}>
                      {msgError}
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button onClick={() => setShowMsgModal(false)} style={{ padding: '8px 18px', background: B.white, border: `1px solid ${B.border}`, borderRadius: 8, fontSize: 13, cursor: 'pointer', color: B.muted }}>
                      Cancel
                    </button>
                    <button
                      disabled={msgSending || !msgSubject.trim() || !msgBody.trim()}
                      onClick={async () => {
                        setMsgSending(true); setMsgError('')
                        try {
                          await axiosClient.post(`/clients/${clientId}/portal-message`, { subject: msgSubject.trim(), body: msgBody.trim() })
                          setMsgSuccess(true)
                        } catch {
                          setMsgError('Failed to send message. Please try again.')
                        } finally {
                          setMsgSending(false)
                        }
                      }}
                      style={{ padding: '8px 20px', background: '#1E3A5F', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: msgSending ? 'not-allowed' : 'pointer', opacity: msgSending ? 0.7 : 1 }}
                    >
                      {msgSending ? 'Sending...' : 'Send message'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

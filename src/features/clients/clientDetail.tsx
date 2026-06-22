'use client'
import { useCallback, useEffect, useState } from 'react'
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
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

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
  const displayNino = client?.nino ?? '—'
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
        <span style={{ fontWeight: 600 }}>{clientLoading ? 'Loading…' : displayName}</span>
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
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                background: B.primary,
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              View client portal
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
                value: '—',
                sub: 'Available via Income Sources API',
                color: B.green,
              },
              {
                label: 'Submitted expenses (YTD)',
                value: '—',
                sub: 'Available via Income Sources API',
                color: B.amber,
              },
              {
                label: 'Submitted net profit',
                value: '—',
                sub: 'Available via Income Sources API',
                color: B.primary,
              },
              {
                label: 'Outstanding to HMRC',
                value:
                  outstanding != null
                    ? `£${outstanding.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
                    : '—',
                sub:
                  outstanding == null
                    ? client?.authorisedAt
                      ? 'Loading…'
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
                  title="Submission history — 2025-26"
                  right={
                    <span style={{ fontSize: 11, color: B.light }}>
                      Read-only — filed via your accounting software
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
                            Due: {q.due} — no data submitted yet
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
                        —
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
                            —
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
                    ['Email', client?.email ?? '—'],
                    ['Postcode', client?.postcode ?? '—'],
                    ['Agent type', client?.agentType ?? 'Main agent'],
                    ['Invitation status', client?.invitationStatus ?? '—'],
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
                    Client uses Xero for bookkeeping. Submits own Q updates via Xero — we monitor
                    and chase. 2nd POA due 31 Jul — remind client. May exceed £90k next year.
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

        {activeTab === 'chasing' && <ChasingTab />}

        {activeTab === 'notes' && <NotesTab />}
      </div>
    </div>
  )
}

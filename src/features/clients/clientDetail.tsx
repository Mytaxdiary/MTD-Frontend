'use client'
import { useCallback, useEffect, useState } from 'react'
import B from '@/styles/theme'
import {
  clientsService,
  type BusinessListItem,
  type ClientRecord,
  type IncomeSummaryResponse,
} from '@/services/clients.service'
import { sanitizeHmrcAmount } from '@/lib/hmrc/liabilityLabel'
import LiabilitiesTab from '@/features/clients/LiabilitiesTab'
import ChasingTab from '@/features/clients/ChasingTab'
import NotesTab from '@/features/clients/NotesTab'
import { useCurrentUser } from '@/components/auth/CurrentUserProvider'
import { usePermissions } from '@/hooks/usePermissions'

import ClientDetailBreadcrumb from './detail/Breadcrumb'
import ClientDetailHeader from './detail/Header'
import MetricsStrip from './detail/MetricsStrip'
import MessageModal from './detail/MessageModal'
import OverviewTab from './detail/OverviewTab'

export default function ClientDetail({
  clientId = null,
  navigate = () => {},
}: {
  clientId?: string | null
  navigate?: (route: string) => void
}) {
  const { user } = useCurrentUser()
  const { canChase, canViewLiabilities, canViewNotes } = usePermissions()
  const [activeTab, setActiveTab] = useState('overview')
  const [client, setClient] = useState<ClientRecord | null>(null)
  const [clientLoading, setClientLoading] = useState(!!clientId)
  const [clientError, setClientError] = useState<string | null>(null)

  const [firstBusiness, setFirstBusiness] = useState<BusinessListItem | null>(null)
  const [outstandingBalance, setOutstandingBalance] = useState<number | null>(null)
  const [outstandingLoading, setOutstandingLoading] = useState(false)
  const [outstandingError, setOutstandingError] = useState(false)
  const [incomeSummary, setIncomeSummary] = useState<IncomeSummaryResponse | null>(null)
  const [incomeSummaryLoading, setIncomeSummaryLoading] = useState(false)

  const [previewLoading, setPreviewLoading] = useState(false)
  const [showMsgModal, setShowMsgModal] = useState(false)

  // ── Data fetching ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (!clientId) {
      setClient(null)
      setClientLoading(false)
      return
    }
    setClientLoading(true)
    setClientError(null)
    setFirstBusiness(null)
    clientsService
      .getOne(clientId)
      .then((record) => {
        if (
          user?.role === 'staff' &&
          record.assignedToUserId &&
          record.assignedToUserId !== user.id
        ) {
          setClient(null)
          setClientError('Client not found')
          return
        }
        setClient(record)
      })
      .catch((err: unknown) => {
        setClientError((err as Error)?.message ?? 'Failed to load client.')
        setClient(null)
      })
      .finally(() => setClientLoading(false))
  }, [clientId, user?.id, user?.role])

  const fetchOutstanding = useCallback(async (id: string) => {
    setOutstandingLoading(true)
    setOutstandingError(false)
    try {
      const data = await clientsService.getBalanceAndTransactions(id, { onlyOpenItems: true })
      setOutstandingBalance(sanitizeHmrcAmount(data.balanceDetails?.totalBalance))
    } catch {
      setOutstandingBalance(null)
      setOutstandingError(true)
    } finally {
      setOutstandingLoading(false)
    }
  }, [])

  const fetchIncomeSummary = useCallback(async (id: string) => {
    setIncomeSummaryLoading(true)
    try {
      const data = await clientsService.getIncomeSummary(id)
      setIncomeSummary(data)
    } catch {
      setIncomeSummary(null)
    } finally {
      setIncomeSummaryLoading(false)
    }
  }, [])

  useEffect(() => {
    if (client?.authorisedAt) {
      if (canViewLiabilities) void fetchOutstanding(client.id)
      else {
        setOutstandingBalance(null)
        setOutstandingLoading(false)
        setOutstandingError(false)
      }
      void fetchIncomeSummary(client.id)
    } else {
      setOutstandingBalance(null)
      setOutstandingLoading(false)
      setOutstandingError(false)
      setIncomeSummary(null)
    }
  }, [client?.id, client?.authorisedAt, fetchOutstanding, fetchIncomeSummary, canViewLiabilities])

  useEffect(() => {
    if (activeTab === 'liabilities' && !canViewLiabilities) setActiveTab('overview')
    if (activeTab === 'notes' && !canViewNotes) setActiveTab('overview')
    if (activeTab === 'chasing' && !canChase) setActiveTab('overview')
  }, [activeTab, canViewLiabilities, canViewNotes, canChase])

  // ── Derived display values ──────────────────────────────────────────────────

  const displayName = client?.name ?? 'Priya Sharma'
  const displayNino = client?.nino ?? '-'
  const mtdBadge = client?.authorisedAt
    ? 'MTD Authorised'
    : client?.invitationStatus === 'accepted'
      ? 'Invite accepted'
      : 'MTD Pending'

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
      <ClientDetailBreadcrumb
        clientLoading={clientLoading}
        displayName={displayName}
        navigate={navigate}
      />

      <ClientDetailHeader
        client={client}
        clientLoading={clientLoading}
        firstBusiness={firstBusiness}
        mtdBadge={mtdBadge}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        clientId={clientId}
        previewLoading={previewLoading}
        setPreviewLoading={setPreviewLoading}
        onMessageClick={() => setShowMsgModal(true)}
        onAssigned={(assignedToUserId) =>
          setClient((prev) => (prev ? { ...prev, assignedToUserId } : prev))
        }
      />

      <div style={{ padding: '18px 28px', flex: 1 }}>
        <MetricsStrip
          authorised={!!client?.authorisedAt}
          outstandingBalance={outstandingBalance}
          outstandingLoading={outstandingLoading}
          outstandingError={outstandingError}
          incomeSummary={incomeSummary}
          incomeSummaryLoading={incomeSummaryLoading}
          showOutstanding={canViewLiabilities}
        />

        {clientError && !client && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 24px',
              gap: 12,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 36 }}>⚠️</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: B.text }}>Client not found</div>
            <div style={{ fontSize: 13, color: B.muted, maxWidth: 320 }}>{clientError}</div>
            <button
              onClick={() => navigate('clients')}
              style={{
                marginTop: 8,
                padding: '8px 20px',
                borderRadius: 8,
                border: `1px solid ${B.border}`,
                background: B.white,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                color: B.text,
              }}
            >
              Back to clients
            </button>
          </div>
        )}

        {clientError && !client ? null : !clientId && (
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
            Open a client from the Clients list to view live HMRC ITSA status. Demo layout below
            uses sample data.
          </div>
        )}

        {!clientError && activeTab === 'overview' && (
          <OverviewTab
            client={client}
            clientId={clientId}
            displayNino={displayNino}
            onFirstBusiness={setFirstBusiness}
            onClientUpdated={setClient}
          />
        )}

        {!clientError && activeTab === 'liabilities' && canViewLiabilities && client && (
          <LiabilitiesTab client={client} />
        )}

        {!clientError && activeTab === 'liabilities' && canViewLiabilities && !client && (
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

        {!clientError && activeTab === 'chasing' && canChase && <ChasingTab clientId={clientId} />}

        {!clientError && activeTab === 'notes' && canViewNotes && <NotesTab clientId={clientId} />}
      </div>

      {canChase && (
        <MessageModal
          show={showMsgModal}
          onClose={() => setShowMsgModal(false)}
          clientId={clientId}
          clientName={client?.name ?? 'client'}
        />
      )}
    </div>
  )
}

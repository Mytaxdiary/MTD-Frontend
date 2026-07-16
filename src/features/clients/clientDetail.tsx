'use client'
import { useCallback, useEffect, useState } from 'react'
import B from '@/styles/theme'
import {
  clientsService,
  type BusinessListItem,
  type ClientRecord,
  type IncomeSummaryResponse,
} from '@/services/clients.service'
import LiabilitiesTab from '@/features/clients/LiabilitiesTab'
import ChasingTab from '@/features/clients/ChasingTab'
import NotesTab from '@/features/clients/NotesTab'

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
  const [activeTab, setActiveTab] = useState('overview')
  const [client, setClient] = useState<ClientRecord | null>(null)
  const [clientLoading, setClientLoading] = useState(!!clientId)
  const [clientError, setClientError] = useState<string | null>(null)

  const [firstBusiness, setFirstBusiness] = useState<BusinessListItem | null>(null)
  const [outstandingBalance, setOutstandingBalance] = useState<number | null>(null)
  const [incomeSummary, setIncomeSummary] = useState<IncomeSummaryResponse | null>(null)
  const [incomeSummaryLoading, setIncomeSummaryLoading] = useState(false)

  const [previewLoading, setPreviewLoading] = useState(false)
  const [showMsgModal, setShowMsgModal] = useState(false)

  // ── Data fetching ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (!clientId) { setClient(null); setClientLoading(false); return }
    setClientLoading(true)
    setClientError(null)
    setFirstBusiness(null)
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
      const data = await clientsService.getBalanceAndTransactions(id, { onlyOpenItems: true })
      setOutstandingBalance(data.balanceDetails?.totalBalance ?? null)
    } catch {
      setOutstandingBalance(null)
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
      void fetchOutstanding(client.id)
      void fetchIncomeSummary(client.id)
    } else {
      setOutstandingBalance(null)
      setIncomeSummary(null)
    }
  }, [client?.id, client?.authorisedAt, fetchOutstanding, fetchIncomeSummary])

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
        firstBusiness={firstBusiness}
        mtdBadge={mtdBadge}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        clientId={clientId}
        previewLoading={previewLoading}
        setPreviewLoading={setPreviewLoading}
        onMessageClick={() => setShowMsgModal(true)}
      />

      <div style={{ padding: '24px 32px', flex: 1 }}>
        <MetricsStrip
          authorised={!!client?.authorisedAt}
          outstandingBalance={outstandingBalance}
          incomeSummary={incomeSummary}
          incomeSummaryLoading={incomeSummaryLoading}
        />

        {clientError && (
          <div style={{ marginBottom: 16, padding: '10px 12px', background: B.redBg, border: '1px solid #FECACA', borderRadius: 8, fontSize: 12, color: B.redText }}>
            {clientError}
          </div>
        )}

        {!clientId && (
          <div style={{ marginBottom: 16, padding: '10px 12px', background: B.amberBg, border: '1px solid #FDE68A', borderRadius: 8, fontSize: 12, color: B.amberText }}>
            Open a client from the Clients list to view live HMRC ITSA status. Demo layout below uses sample data.
          </div>
        )}

        {activeTab === 'overview' && (
          <OverviewTab
            client={client}
            clientId={clientId}
            displayNino={displayNino}
            onFirstBusiness={setFirstBusiness}
          />
        )}

        {activeTab === 'liabilities' && client && <LiabilitiesTab client={client} />}

        {activeTab === 'liabilities' && !client && (
          <div style={{ padding: '10px 12px', background: B.amberBg, border: '1px solid #FDE68A', borderRadius: 8, fontSize: 12, color: B.amberText }}>
            Open a client from the Clients list to view HMRC liabilities.
          </div>
        )}

        {activeTab === 'chasing' && <ChasingTab clientId={clientId} />}

        {activeTab === 'notes' && <NotesTab clientId={clientId} />}
      </div>

      <MessageModal
        show={showMsgModal}
        onClose={() => setShowMsgModal(false)}
        clientId={clientId}
        clientName={client?.name ?? 'client'}
      />
    </div>
  )
}

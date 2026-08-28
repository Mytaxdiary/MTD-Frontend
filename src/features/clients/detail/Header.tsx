'use client'
import B from '@/styles/theme'
import type { BusinessListItem, ClientRecord } from '@/services/clients.service'
import axiosClient from '@/lib/api/axiosClient'
import { useAssignableStaff } from '@/features/clients/useAssignableStaff'
import AssigneeSelect from '@/features/clients/AssigneeSelect'
import { usePermissions } from '@/hooks/usePermissions'

function clientInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

const ALL_TABS = ['overview', 'liabilities', 'chasing', 'notes'] as const

interface Props {
  client: ClientRecord | null
  clientLoading?: boolean
  firstBusiness: BusinessListItem | null
  mtdBadge: string
  activeTab: string
  setActiveTab: (tab: string) => void
  clientId: string | null
  previewLoading: boolean
  setPreviewLoading: (v: boolean) => void
  onMessageClick: () => void
  onAssigned?: (assignedToUserId: string | null) => void
}

export default function ClientDetailHeader({
  client,
  clientLoading = false,
  firstBusiness,
  mtdBadge,
  activeTab,
  setActiveTab,
  clientId,
  previewLoading,
  setPreviewLoading,
  onMessageClick,
  onAssigned,
}: Props) {
  const { isOwner, isStaff, people } = useAssignableStaff()
  const { canChase, canViewLiabilities, canViewNotes } = usePermissions()
  const displayName = client?.name ?? ''
  const tabs = ALL_TABS.filter((tab) => {
    if (tab === 'liabilities') return canViewLiabilities
    if (tab === 'chasing') return canChase
    if (tab === 'notes') return canViewNotes
    return true
  })

  const handlePreview = async () => {
    if (!clientId) return
    setPreviewLoading(true)
    try {
      const res = await axiosClient.post<{ data: { previewToken: string } }>(
        `/clients/${clientId}/portal-preview-token`
      )
      const token = res.data.data.previewToken
      window.open(`/portal/preview?token=${token}`, '_blank')
    } catch {
      alert('Could not open portal preview. Please try again.')
    } finally {
      setPreviewLoading(false)
    }
  }

  return (
    <div
      style={{
        padding: '18px 28px 16px',
        background: B.white,
        borderBottom: `1px solid ${B.border}`,
        flexShrink: 0,
      }}
    >
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Avatar + name + badges */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: clientLoading
                ? B.borderLight
                : 'linear-gradient(135deg,#E0F2FE,#BAE6FD)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 700,
              color: B.blueText,
            }}
          >
            {!clientLoading && (client ? clientInitials(client.name) : '')}
          </div>
          <div>
            {clientLoading ? (
              <div
                style={{
                  height: 28,
                  width: 180,
                  borderRadius: 6,
                  background: `linear-gradient(90deg, ${B.surface} 25%, ${B.borderLight} 50%, ${B.surface} 75%)`,
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.4s infinite',
                  marginBottom: 8,
                }}
              />
            ) : (
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
                {displayName}
              </div>
            )}
            {!clientLoading && <div
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                marginTop: 4,
                flexWrap: 'wrap',
              }}
            >
              {firstBusiness && (
                <>
                  {firstBusiness.tradingName && (
                    <>
                      <span style={{ fontSize: 13, color: B.muted }}>
                        {firstBusiness.tradingName}
                      </span>
                      <span
                        style={{ width: 4, height: 4, borderRadius: 2, background: B.xlight }}
                      />
                    </>
                  )}
                  <span style={{ fontSize: 12, color: B.muted, textTransform: 'capitalize' }}>
                    {firstBusiness.typeOfBusiness.replace(/-/g, ' ')}
                  </span>
                  <span style={{ width: 4, height: 4, borderRadius: 2, background: B.xlight }} />
                </>
              )}
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
              {isOwner && client && (
                <label
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 12,
                    color: B.muted,
                  }}
                >
                  Assigned to
                  <AssigneeSelect
                    clientId={client.id}
                    assignedToUserId={client.assignedToUserId}
                    people={people}
                    onAssigned={(id) => onAssigned?.(id)}
                  />
                </label>
              )}
              {isStaff && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '2px 10px',
                    borderRadius: 20,
                    background: B.surface,
                    color: B.muted,
                    border: `1px solid ${B.borderLight}`,
                  }}
                >
                  Assigned to you
                </span>
              )}
            </div>}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          {canChase && (
            <button
              onClick={() => setActiveTab('chasing')}
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
          )}
          {canChase && (
            <button
              onClick={onMessageClick}
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
          )}
          <button
            disabled={previewLoading || !clientId}
            onClick={handlePreview}
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

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 0, marginTop: 20 }}>
        {tabs.map((tab) => (
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
  )
}

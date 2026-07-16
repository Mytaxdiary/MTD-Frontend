import B from '@/styles/theme'
import type { BusinessListItem, ClientRecord } from '@/services/clients.service'
import axiosClient from '@/lib/api/axiosClient'

function clientInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

const TABS = ['overview', 'liabilities', 'chasing', 'notes'] as const

interface Props {
  client: ClientRecord | null
  firstBusiness: BusinessListItem | null
  mtdBadge: string
  activeTab: string
  setActiveTab: (tab: string) => void
  clientId: string | null
  previewLoading: boolean
  setPreviewLoading: (v: boolean) => void
  onMessageClick: () => void
}

export default function ClientDetailHeader({
  client,
  firstBusiness,
  mtdBadge,
  activeTab,
  setActiveTab,
  clientId,
  previewLoading,
  setPreviewLoading,
  onMessageClick,
}: Props) {
  const displayName = client?.name ?? 'Priya Sharma'

  const handlePreview = async () => {
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
  }

  return (
    <div
      style={{
        padding: '24px 32px 20px',
        background: B.white,
        borderBottom: `1px solid ${B.border}`,
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Avatar + name + badges */}
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
              style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 4, flexWrap: 'wrap' }}
            >
              {firstBusiness && (
                <>
                  {firstBusiness.tradingName && (
                    <>
                      <span style={{ fontSize: 13, color: B.muted }}>{firstBusiness.tradingName}</span>
                      <span style={{ width: 4, height: 4, borderRadius: 2, background: B.xlight }} />
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
                  fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
                  background: B.greenBg, color: B.greenText, border: '1px solid #A7F3D0',
                }}
              >
                {mtdBadge}
              </span>
              <span
                style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
                  background: B.blueBg, color: B.blueText, border: '1px solid #BAE6FD',
                }}
              >
                Main agent
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            style={{
              padding: '8px 16px', borderRadius: 8, border: `1px solid ${B.border}`,
              background: B.white, fontSize: 12, fontWeight: 500, cursor: 'pointer', color: B.text,
            }}
          >
            Chase client
          </button>
          <button
            onClick={onMessageClick}
            style={{
              padding: '8px 16px', borderRadius: 8, border: `1px solid ${B.border}`,
              background: B.white, fontSize: 12, fontWeight: 500, cursor: 'pointer', color: B.text,
            }}
          >
            Message client
          </button>
          <button
            disabled={previewLoading || !clientId}
            onClick={handlePreview}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: previewLoading ? B.muted : B.primary,
              color: '#fff', fontSize: 12, fontWeight: 600,
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
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              border: 'none', background: 'transparent',
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

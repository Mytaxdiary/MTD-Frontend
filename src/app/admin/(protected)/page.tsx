'use client'

import { useEffect, useState } from 'react'
import B from '@/styles/theme'
import { adminService, type AdminOverviewStats } from '@/services/admin.service'

function StatCard({
  label,
  value,
  hint,
}: {
  label: string
  value: number | string
  hint?: string
}) {
  return (
    <div
      style={{
        background: B.white,
        border: `1px solid ${B.border}`,
        borderRadius: 12,
        padding: '18px 20px',
        boxShadow: B.cardShadow,
      }}
    >
      <div style={{ fontSize: 12.5, fontWeight: 600, color: B.muted, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: B.text, letterSpacing: '-0.02em' }}>
        {value}
      </div>
      {hint && (
        <div style={{ fontSize: 12, color: B.light, marginTop: 6 }}>{hint}</div>
      )}
    </div>
  )
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<AdminOverviewStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await adminService.getOverview()
        if (!cancelled) setStats(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load overview')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px', color: B.text }}>
        Platform overview
      </h1>
      <p style={{ margin: '0 0 24px', fontSize: 14, color: B.muted }}>
        Read-only snapshot of firms and marketing enquiries.
      </p>

      {loading && <div style={{ color: B.muted, fontSize: 14 }}>Loading…</div>}
      {error && (
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 8,
            background: B.redBg,
            color: B.redText,
            fontSize: 13,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      {stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 14,
          }}
        >
          <StatCard label="Total firms" value={stats.totalFirms} />
          <StatCard label="Active firms" value={stats.activeFirms} />
          <StatCard label="Inactive firms" value={stats.inactiveFirms} />
          <StatCard
            label="New signups (7 days)"
            value={stats.newSignupsThisWeek}
            hint="Firms created in the last week"
          />
          <StatCard
            label="New signups (this month)"
            value={stats.newSignupsThisMonth}
          />
          <StatCard
            label="Open enquiries"
            value={stats.openEnquiries}
            hint="Not closed"
          />
        </div>
      )}
    </div>
  )
}

'use client'
import { useState, useEffect, useCallback } from 'react'
import B from '@/styles/theme'
import { Card, CardHeader as CardHead } from '@/components/ui/card'
import tenantsService, { type FirmDetails } from '@/services/tenants.service'

export default function FirmDetailsSection() {
  const [firmDetails, setFirmDetails] = useState<FirmDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await tenantsService.getFirmDetails()
      setFirmDetails(data)
    } catch {
      setError('Failed to load firm details.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async () => {
    if (!firmDetails) return
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      const updated = await tenantsService.updateFirmDetails({
        firmName: firmDetails.firmName,
        contactName: firmDetails.contactName,
        contactEmail: firmDetails.contactEmail,
        phone: firmDetails.phone,
        address: firmDetails.address,
        postcode: firmDetails.postcode,
      })
      setFirmDetails(updated)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Failed to save changes.')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '9px 14px',
    borderRadius: 8,
    border: `1px solid ${B.border}`,
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: B.muted,
    display: 'block',
    marginBottom: 5,
  }

  return (
    <Card>
      <CardHead
        titleSize={15}
        padding="16px 20px"
        title="Firm details"
        sub="Your practice information"
      />
      <div style={{ padding: '20px' }}>
        {loading ? (
          <div style={{ fontSize: 13, color: B.muted, padding: '12px 0' }}>Loading…</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {([
                ['Firm name', 'firmName', 'text'],
                ['Primary contact', 'contactName', 'text'],
                ['Email', 'contactEmail', 'email'],
                ['Phone', 'phone', 'text'],
              ] as [string, keyof FirmDetails, string][]).map(([label, field, type]) => (
                <div key={field}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    type={type}
                    value={(firmDetails?.[field] as string) ?? ''}
                    onChange={(e) =>
                      setFirmDetails((prev) => (prev ? { ...prev, [field]: e.target.value } : prev))
                    }
                    style={inputStyle}
                  />
                </div>
              ))}

              <div style={{ gridColumn: '1/-1' }}>
                <label style={labelStyle}>Address</label>
                <input
                  value={firmDetails?.address ?? ''}
                  onChange={(e) =>
                    setFirmDetails((prev) => (prev ? { ...prev, address: e.target.value } : prev))
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Postcode</label>
                <input
                  value={firmDetails?.postcode ?? ''}
                  onChange={(e) =>
                    setFirmDetails((prev) => (prev ? { ...prev, postcode: e.target.value } : prev))
                  }
                  style={inputStyle}
                />
              </div>
            </div>

            {error && (
              <div style={{ fontSize: 12, color: B.redText, marginTop: 10 }}>{error}</div>
            )}
            {success && (
              <div style={{ fontSize: 12, color: B.greenText, marginTop: 10 }}>Changes saved.</div>
            )}

            <div
              style={{
                borderTop: `1px solid ${B.border}`,
                paddingTop: 16,
                marginTop: 16,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '8px 20px',
                  borderRadius: 8,
                  border: 'none',
                  background: saving ? B.light : B.primary,
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}

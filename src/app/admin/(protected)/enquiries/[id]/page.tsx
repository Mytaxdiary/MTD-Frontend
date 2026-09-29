'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import B from '@/styles/theme'
import {
  adminService,
  type AdminEnquiryItem,
  type EnquiryStatus,
} from '@/services/admin.service'

const STATUSES: EnquiryStatus[] = ['new', 'contacted', 'closed']

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function buildEnquiryClipboard(e: AdminEnquiryItem): string {
  const lines = [
    `Name: ${e.name}`,
    `Firm: ${e.firm}`,
    `Email: ${e.email}`,
    e.phone ? `Phone: ${e.phone}` : null,
    e.planInterest ? `Plan interest: ${e.planInterest}` : null,
    e.sourcePage ? `Source: ${e.sourcePage}` : null,
    '',
    'Message:',
    e.message,
  ]
  return lines.filter((l) => l !== null).join('\n')
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '140px 1fr',
        gap: 12,
        padding: '12px 0',
        borderBottom: `1px solid ${B.borderLight}`,
        fontSize: 14,
      }}
    >
      <div style={{ color: B.muted, fontWeight: 500 }}>{label}</div>
      <div style={{ color: B.text, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {value ?? '—'}
      </div>
    </div>
  )
}

export default function AdminEnquiryDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [enquiry, setEnquiry] = useState<AdminEnquiryItem | null>(null)
  const [status, setStatus] = useState<EnquiryStatus>('new')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [quickBusy, setQuickBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const [copyMsg, setCopyMsg] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await adminService.getEnquiry(id)
      setEnquiry(data)
      setStatus(data.status)
      setNote(data.internalNote ?? '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load enquiry')
      setEnquiry(null)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void load()
  }, [load])

  const save = async () => {
    if (!id || !enquiry) return
    setSaving(true)
    setSaveMsg(null)
    setError(null)
    try {
      const updated = await adminService.updateEnquiry(id, {
        status,
        internalNote: note.trim() || null,
      })
      setEnquiry(updated)
      setStatus(updated.status)
      setNote(updated.internalNote ?? '')
      setSaveMsg('Saved.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const markContacted = async () => {
    if (!id || !enquiry || enquiry.status === 'contacted') return
    setQuickBusy(true)
    setError(null)
    setSaveMsg(null)
    try {
      const updated = await adminService.updateEnquiry(id, { status: 'contacted' })
      setEnquiry(updated)
      setStatus(updated.status)
      setSaveMsg('Marked as contacted.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setQuickBusy(false)
    }
  }

  const copyDetails = async () => {
    if (!enquiry) return
    setCopyMsg(null)
    try {
      await navigator.clipboard.writeText(buildEnquiryClipboard(enquiry))
      setCopyMsg('Copied.')
      setTimeout(() => setCopyMsg(null), 2500)
    } catch {
      setError('Could not copy to clipboard.')
    }
  }

  const dirty =
    enquiry &&
    (status !== enquiry.status || (note.trim() || null) !== (enquiry.internalNote ?? null))

  const mailtoHref = enquiry
    ? `mailto:${encodeURIComponent(enquiry.email)}?subject=${encodeURIComponent(
        `Re: My Tax Diary enquiry from ${enquiry.firm}`,
      )}`
    : '#'

  const btnSecondary: React.CSSProperties = {
    padding: '9px 14px',
    borderRadius: 8,
    border: `1px solid ${B.border}`,
    background: B.white,
    color: B.text,
    fontSize: 13.5,
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 800 }}>
      <Link
        href="/admin/enquiries"
        style={{
          fontSize: 13,
          color: B.link,
          fontWeight: 600,
          textDecoration: 'none',
          display: 'inline-block',
          marginBottom: 16,
        }}
      >
        ← Back to enquiries
      </Link>

      {loading && <div style={{ color: B.muted }}>Loading…</div>}
      {error && (
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 8,
            background: B.redBg,
            color: B.redText,
            fontSize: 13,
            marginBottom: 14,
          }}
        >
          {error}
        </div>
      )}

      {enquiry && (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 16,
              marginBottom: 8,
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px', color: B.text }}>
                {enquiry.name}
              </h1>
              <p style={{ margin: 0, fontSize: 13.5, color: B.muted }}>
                Enquiry from {enquiry.firm} · {formatDate(enquiry.createdAt)}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {enquiry.status !== 'contacted' && (
                <button
                  type="button"
                  onClick={() => void markContacted()}
                  disabled={quickBusy}
                  style={{
                    ...btnSecondary,
                    border: `1px solid ${B.primaryBtn}`,
                    background: B.primaryBtn,
                    color: '#fff',
                    cursor: quickBusy ? 'not-allowed' : 'pointer',
                  }}
                >
                  {quickBusy ? 'Updating…' : 'Mark as contacted'}
                </button>
              )}
              <button type="button" onClick={() => void copyDetails()} style={btnSecondary}>
                Copy details
              </button>
              <a href={mailtoHref} style={btnSecondary}>
                Email contact
              </a>
              {copyMsg && (
                <span style={{ fontSize: 13, color: B.greenText, fontWeight: 600 }}>{copyMsg}</span>
              )}
            </div>
          </div>

          <div
            style={{
              background: B.white,
              border: `1px solid ${B.border}`,
              borderRadius: 12,
              padding: '8px 20px',
              boxShadow: B.cardShadow,
              marginBottom: 18,
              marginTop: 16,
            }}
          >
            <Row label="Firm" value={enquiry.firm} />
            <Row label="Email" value={enquiry.email} />
            <Row label="Phone" value={enquiry.phone} />
            <Row label="Plan interest" value={enquiry.planInterest} />
            <Row label="Source page" value={enquiry.sourcePage} />
            <Row label="Status" value={enquiry.status} />
            <Row label="Message" value={enquiry.message} />
            <Row label="Updated" value={formatDate(enquiry.updatedAt)} />
          </div>

          <div
            style={{
              background: B.white,
              border: `1px solid ${B.border}`,
              borderRadius: 12,
              padding: 20,
              boxShadow: B.cardShadow,
            }}
          >
            <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 14px', color: B.text }}>
              Follow-up
            </h2>

            <label
              style={{
                display: 'block',
                fontSize: 12.5,
                fontWeight: 600,
                color: B.muted,
                marginBottom: 6,
              }}
            >
              Status
            </label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {STATUSES.map((s) => {
                const active = status === s
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setStatus(s)
                      setSaveMsg(null)
                    }}
                    style={{
                      padding: '7px 12px',
                      borderRadius: 8,
                      border: `1px solid ${active ? B.primaryBtn : B.border}`,
                      background: active ? B.primaryBtn : B.white,
                      color: active ? '#fff' : B.muted,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {s}
                  </button>
                )
              })}
            </div>

            <label
              style={{
                display: 'block',
                fontSize: 12.5,
                fontWeight: 600,
                color: B.muted,
                marginBottom: 6,
              }}
            >
              Internal note
            </label>
            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value)
                setSaveMsg(null)
              }}
              rows={4}
              placeholder="Notes for the team (not sent to the enquiry contact)"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 7,
                border: `1px solid ${B.border}`,
                fontSize: 13.5,
                resize: 'vertical',
                marginBottom: 14,
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                type="button"
                onClick={() => void save()}
                disabled={saving || !dirty}
                style={{
                  padding: '9px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: saving || !dirty ? B.light : B.primaryBtn,
                  color: '#fff',
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: saving || !dirty ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              {saveMsg && (
                <span style={{ fontSize: 13, color: B.greenText, fontWeight: 600 }}>{saveMsg}</span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

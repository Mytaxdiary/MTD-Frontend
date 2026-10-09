'use client'

import { FormEvent, useEffect, useState } from 'react'
import B from '@/styles/theme'
import { adminService } from '@/services/admin.service'

export default function AdminSupportPage() {
  const [trialDays, setTrialDays] = useState<number | null>(null)
  const [draftDays, setDraftDays] = useState('7')
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(true)
  const [savingDays, setSavingDays] = useState(false)
  const [clearingDomain, setClearingDomain] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await adminService.getTrialDays()
        if (!cancelled) {
          setTrialDays(res.days)
          setDraftDays(String(res.days))
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load trial settings')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const saveTrialDays = async (ev: FormEvent) => {
    ev.preventDefault()
    const days = Number.parseInt(draftDays, 10)
    if (!Number.isFinite(days) || days < 0 || days > 365) {
      setError('Trial days must be a whole number between 0 and 365.')
      return
    }
    setSavingDays(true)
    setError(null)
    setMsg(null)
    try {
      const res = await adminService.setTrialDays(days)
      setTrialDays(res.days)
      setDraftDays(String(res.days))
      setMsg(`Default trial length updated to ${res.days} day${res.days === 1 ? '' : 's'}.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update trial days')
    } finally {
      setSavingDays(false)
    }
  }

  const clearDomain = async (ev: FormEvent) => {
    ev.preventDefault()
    const value = domain.trim().toLowerCase()
    if (!value) {
      setError('Enter a corporate email domain to clear.')
      return
    }
    setClearingDomain(true)
    setError(null)
    setMsg(null)
    try {
      const res = await adminService.clearTrialDomain(value)
      setDomain('')
      setMsg(`Trial lock cleared for ${res.domain}. Another signup on that domain can start a trial.`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear trial domain')
    } finally {
      setClearingDomain(false)
    }
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 800 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px', color: B.text }}>Support</h1>
      <p style={{ margin: '0 0 22px', fontSize: 14, color: B.muted }}>
        Platform billing settings and support unlocks. Extending an individual firm trial is not in
        v1.
      </p>

      {error && (
        <div
          style={{
            padding: '10px 12px',
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
      {msg && (
        <div
          style={{
            padding: '10px 12px',
            borderRadius: 8,
            background: B.greenBg,
            color: B.greenText,
            fontSize: 13,
            marginBottom: 14,
            fontWeight: 600,
          }}
        >
          {msg}
        </div>
      )}

      <section
        style={{
          background: B.white,
          border: `1px solid ${B.border}`,
          borderRadius: 12,
          padding: 20,
          marginBottom: 16,
          boxShadow: B.cardShadow,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: B.text }}>
          Default trial length
        </h2>
        <p style={{ margin: '0 0 14px', fontSize: 13.5, color: B.muted, lineHeight: 1.5 }}>
          Used when a new firm registers (0 = no free trial). Current value:{' '}
          <strong style={{ color: B.text }}>
            {loading ? '…' : `${trialDays ?? '—'} day${trialDays === 1 ? '' : 's'}`}
          </strong>
          . Changing this does not alter firms already on a trial.
        </p>
        <form onSubmit={(e) => void saveTrialDays(e)} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="number"
            min={0}
            max={365}
            step={1}
            value={draftDays}
            onChange={(e) => setDraftDays(e.target.value)}
            disabled={loading || savingDays}
            style={{
              width: 120,
              padding: '9px 12px',
              borderRadius: 8,
              border: `1px solid ${B.border}`,
              fontSize: 14,
            }}
          />
          <button
            type="submit"
            disabled={loading || savingDays}
            style={{
              padding: '9px 14px',
              borderRadius: 8,
              border: 'none',
              background: B.primaryBtn,
              color: '#fff',
              fontSize: 13.5,
              fontWeight: 600,
              cursor: savingDays ? 'not-allowed' : 'pointer',
              opacity: savingDays ? 0.7 : 1,
            }}
          >
            {savingDays ? 'Saving…' : 'Save'}
          </button>
        </form>
      </section>

      <section
        style={{
          background: B.white,
          border: `1px solid ${B.border}`,
          borderRadius: 12,
          padding: 20,
          boxShadow: B.cardShadow,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: B.text }}>
          Clear corporate trial domain lock
        </h2>
        <p style={{ margin: '0 0 14px', fontSize: 13.5, color: B.muted, lineHeight: 1.5 }}>
          Corporate domains (e.g. <code>neweffect.co.uk</code>) can only take one free trial. Clear a
          lock if support needs to allow another signup on that domain. Personal mailboxes
          (gmail/outlook/yahoo) are never locked.
        </p>
        <form onSubmit={(e) => void clearDomain(e)} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="example.co.uk"
            disabled={clearingDomain}
            style={{
              flex: '1 1 220px',
              padding: '9px 12px',
              borderRadius: 8,
              border: `1px solid ${B.border}`,
              fontSize: 14,
            }}
          />
          <button
            type="submit"
            disabled={clearingDomain}
            style={{
              padding: '9px 14px',
              borderRadius: 8,
              border: `1px solid ${B.border}`,
              background: B.white,
              color: B.text,
              fontSize: 13.5,
              fontWeight: 600,
              cursor: clearingDomain ? 'not-allowed' : 'pointer',
            }}
          >
            {clearingDomain ? 'Clearing…' : 'Clear lock'}
          </button>
        </form>
      </section>
    </div>
  )
}

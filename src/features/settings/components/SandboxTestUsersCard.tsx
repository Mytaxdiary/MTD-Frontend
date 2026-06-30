'use client'
import { useState } from 'react'
import B from '@/styles/theme'
import { Card, CardHeader as CardHead } from '@/components/ui/card'
import {
  hmrcService,
  type HmrcSandboxAgentUser,
  type HmrcSandboxIndividualUser,
  type SandboxTestUsersResult,
} from '@/services/hmrc.service'

const outlineBtn: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 8,
  border: `1px solid ${B.border}`,
  background: B.white,
  fontSize: 12,
  fontWeight: 500,
  cursor: 'pointer',
  color: B.text,
}

const primaryBtn: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 8,
  border: 'none',
  background: B.primary,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  color: '#fff',
}

interface Props {
  hmrcConnected: boolean
  onSaveArn: (arn: string) => Promise<void>
}

function formatAgentCopy(agent: HmrcSandboxAgentUser): string {
  return [
    `User ID: ${agent.userId}`,
    `Password: ${agent.password}`,
    `ARN: ${agent.agentServicesAccountNumber}`,
    `Agent code: ${agent.agentCode}`,
    `Group ID: ${agent.groupIdentifier}`,
    `Email: ${agent.emailAddress}`,
    `Name: ${agent.userFullName}`,
  ].join('\n')
}

function formatClientCopy(ind: HmrcSandboxIndividualUser): string {
  const addr = ind.individualDetails?.address
  const addressParts = [addr?.line1, addr?.line2].filter(Boolean).join(', ')
  return [
    `NINO: ${ind.nino}`,
    `Postcode: ${ind.postcode}`,
    ind.mtdItId ? `MTD IT ID: ${ind.mtdItId}` : null,
    `User ID: ${ind.userId}`,
    `Password: ${ind.password}`,
    ind.groupIdentifier ? `Group ID: ${ind.groupIdentifier}` : null,
    `Email: ${ind.emailAddress}`,
    `Name: ${ind.userFullName}`,
    addressParts ? `Address: ${addressParts}` : null,
    ind.individualDetails?.dateOfBirth
      ? `Date of birth: ${ind.individualDetails.dateOfBirth}`
      : null,
  ]
    .filter(Boolean)
    .join('\n')
}

function agentRows(agent: HmrcSandboxAgentUser): [string, string][] {
  return [
    ['User ID', agent.userId],
    ['Password', agent.password],
    ['ARN', agent.agentServicesAccountNumber],
    ['Agent code', agent.agentCode],
    ['Group ID', agent.groupIdentifier],
    ['Email', agent.emailAddress],
    ['Name', agent.userFullName],
  ]
}

function clientRows(ind: HmrcSandboxIndividualUser): [string, string][] {
  const addr = ind.individualDetails?.address
  const addressParts = [addr?.line1, addr?.line2].filter(Boolean).join(', ')
  const rows: [string, string][] = [
    ['NINO', ind.nino],
    ['Postcode', ind.postcode],
  ]
  if (ind.mtdItId) rows.push(['MTD IT ID', ind.mtdItId])
  rows.push(
    ['User ID', ind.userId],
    ['Password', ind.password],
  )
  if (ind.groupIdentifier) rows.push(['Group ID', ind.groupIdentifier])
  rows.push(['Email', ind.emailAddress], ['Name', ind.userFullName])
  if (addressParts) rows.push(['Address', addressParts])
  if (ind.individualDetails?.dateOfBirth) {
    rows.push(['Date of birth', ind.individualDetails.dateOfBirth])
  }
  return rows
}

function UserBlock({
  title,
  rows,
  copyLabel,
  copyText,
}: {
  title: string
  rows: [string, string][]
  copyLabel: string
  copyText: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div
      style={{
        padding: '14px 16px',
        background: B.surface,
        borderRadius: 8,
        border: `1px solid ${B.borderLight}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          marginBottom: 10,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: B.text }}>{title}</div>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            padding: '4px 10px',
            borderRadius: 6,
            border: `1px solid ${B.border}`,
            background: B.white,
            fontSize: 11,
            fontWeight: 500,
            cursor: 'pointer',
            color: B.muted,
            flexShrink: 0,
          }}
        >
          {copied ? 'Copied' : copyLabel}
        </button>
      </div>
      {rows.map(([label, value], i) => (
        <div
          key={label}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 12,
            padding: '8px 0',
            borderBottom: i < rows.length - 1 ? `1px solid ${B.borderLight}` : 'none',
          }}
        >
          <span style={{ fontSize: 12, color: B.muted, flexShrink: 0 }}>{label}</span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              fontFamily: label === 'Name' || label === 'Email' ? 'inherit' : 'monospace',
              wordBreak: 'break-all',
              textAlign: 'right',
            }}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  )
}

function downloadBulkCsv(individuals: HmrcSandboxIndividualUser[]): void {
  const headers = 'name,nino,postcode,email,phone,agent_type,personal_message'

  const escCsv = (v: string) =>
    v.includes(',') || v.includes('"') || v.includes('\n')
      ? `"${v.replace(/"/g, '""')}"`
      : v

  const dataRows = individuals.map((ind) =>
    [
      escCsv(ind.userFullName),
      ind.nino,
      ind.postcode,
      escCsv(ind.emailAddress),
      '',
      'main',
      '',
    ].join(','),
  )

  const csv = [headers, ...dataRows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'sandbox-bulk-import-test.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function SandboxTestUsersCard({ hmrcConnected, onSaveArn }: Props) {
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SandboxTestUsersResult | null>(null)
  const [savingArn, setSavingArn] = useState(false)
  const [arnSaved, setArnSaved] = useState(false)

  async function handleCreate() {
    setCreating(true)
    setError(null)
    setResult(null)
    setArnSaved(false)
    try {
      const data = await hmrcService.createSandboxTestUsers()
      setResult(data)
      // Auto-download the CSV with all 5 real sandbox individuals
      downloadBulkCsv(data.individuals)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err as { message?: string })?.message ??
        'Failed to create sandbox test users.'
      setError(msg)
    } finally {
      setCreating(false)
    }
  }

  async function handleSaveArn() {
    if (!result?.agent.agentServicesAccountNumber) return
    setSavingArn(true)
    setError(null)
    try {
      await onSaveArn(result.agent.agentServicesAccountNumber)
      setArnSaved(true)
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message ?? 'Failed to save ARN.'
      setError(msg)
    } finally {
      setSavingArn(false)
    }
  }

  return (
    <Card>
      <CardHead
        titleSize={15}
        padding="16px 20px"
        title="Sandbox demo setup"
        sub="Create HMRC test agent & client (Postman steps 0–2)"
      />
      <div style={{ padding: '20px' }}>
        <p style={{ fontSize: 13, color: B.muted, lineHeight: 1.6, margin: '0 0 16px' }}>
          One click creates a sandbox agent and individual in HMRC, same as the
          Postman &quot;00 - Test Users&quot; folder. Use the agent credentials to connect HMRC,
          then add a client with the individual NINO and postcode.
        </p>

        <button
          type="button"
          style={{
            ...primaryBtn,
            opacity: creating ? 0.7 : 1,
            cursor: creating ? 'not-allowed' : 'pointer',
          }}
          disabled={creating}
          onClick={handleCreate}
        >
          {creating ? 'Creating test users…' : 'Create sandbox agent & client'}
        </button>

        {error && (
          <div
            style={{
              marginTop: 14,
              padding: '8px 12px',
              background: B.redBg,
              border: '1px solid #FECACA',
              borderRadius: 8,
              fontSize: 12,
              color: B.redText,
            }}
          >
            {error}
          </div>
        )}

        {result && (
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <UserBlock
              title="Agent (connect HMRC with these)"
              rows={agentRows(result.agent)}
              copyLabel="Copy agent"
              copyText={formatAgentCopy(result.agent)}
            />

            <UserBlock
              title="Individual (add as client in the app)"
              rows={clientRows(result.individual)}
              copyLabel="Copy client"
              copyText={formatClientCopy(result.individual)}
            />

            {/* Bulk import test CSV */}
            <div
              style={{
                padding: '14px 16px',
                background: B.blueBg,
                borderRadius: 8,
                border: `1px solid #BAE6FD`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: B.blueText, marginBottom: 2 }}>
                  Bulk import test CSV
                </div>
                <div style={{ fontSize: 11, color: B.blueText, opacity: 0.8 }}>
                  5 real HMRC sandbox clients — ready to use for bulk import testing
                </div>
              </div>
              <button
                type="button"
                onClick={() => downloadBulkCsv(result.individuals)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  border: `1px solid #BAE6FD`,
                  background: B.white,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: B.blueText,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
                Download CSV
              </button>
            </div>

            <div
              style={{
                padding: '14px 16px',
                background: B.amberBg,
                borderRadius: 8,
                border: `1px solid ${B.amber}`,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: B.text, marginBottom: 8 }}>
                Next steps
              </div>
              <ol
                style={{
                  margin: 0,
                  paddingLeft: 18,
                  fontSize: 12,
                  color: B.muted,
                  lineHeight: 1.7,
                }}
              >
                {result.nextSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>

            {hmrcConnected && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  type="button"
                  style={{
                    ...outlineBtn,
                    opacity: savingArn ? 0.7 : 1,
                    cursor: savingArn ? 'not-allowed' : 'pointer',
                  }}
                  disabled={savingArn || arnSaved}
                  onClick={handleSaveArn}
                >
                  {savingArn ? 'Saving ARN…' : arnSaved ? 'ARN saved' : 'Save ARN to this firm'}
                </button>
                {arnSaved && (
                  <span style={{ fontSize: 12, color: B.greenText }}>
                    ARN applied to HMRC connection
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

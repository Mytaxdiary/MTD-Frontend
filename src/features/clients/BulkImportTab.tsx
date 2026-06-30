'use client'
import { useRef, useState } from 'react'
import B from '@/styles/theme'
import { clientsService, type BulkImportResult, type BulkImportRowError } from '@/services/clients.service'

// ─── CSV template ─────────────────────────────────────────────────────────────

const CSV_HEADERS = 'name,nino,postcode,email,phone,agent_type,personal_message'
const CSV_EXAMPLE =
  'John Smith,AB123456C,SW1A 1AA,john@example.com,,main,"Hi John, your MTD account is being set up."'

function downloadTemplate() {
  const content = `${CSV_HEADERS}\n${CSV_EXAMPLE}\n`
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'mtd-clients-import-template.csv'
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Error extraction helper ──────────────────────────────────────────────────

function extractErrors(err: unknown): BulkImportRowError[] | null {
  // The Axios interceptor attaches the full response body as `responseData`
  const msg = (err as { responseData?: { message?: { errors?: BulkImportRowError[] } } })
    ?.responseData?.message
  if (msg && typeof msg === 'object' && Array.isArray((msg as { errors?: unknown }).errors)) {
    return (msg as { errors: BulkImportRowError[] }).errors
  }
  return null
}

function extractMessage(err: unknown): string {
  const raw = (err as { response?: { data?: { message?: string | string[] | { errors?: unknown[] } } } })
    ?.response?.data?.message
  if (typeof raw === 'string') return raw
  if (Array.isArray(raw)) return raw.join(' ')
  return (err as { message?: string })?.message ?? 'Something went wrong. Please try again.'
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldPill({ label }: { label: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 11,
        fontWeight: 600,
        padding: '2px 7px',
        borderRadius: 4,
        background: B.blueBg,
        color: B.blueText,
        border: `1px solid #BAE6FD`,
        marginRight: 4,
        marginBottom: 4,
      }}
    >
      {label}
    </span>
  )
}

function RequiredPill({ label }: { label: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 11,
        fontWeight: 600,
        padding: '2px 7px',
        borderRadius: 4,
        background: '#FEF2F2',
        color: '#991B1B',
        border: '1px solid #FECACA',
        marginRight: 4,
        marginBottom: 4,
      }}
    >
      {label} *
    </span>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  onSuccess: () => void
}

export default function BulkImportTab({ onSuccess }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [rowErrors, setRowErrors] = useState<BulkImportRowError[] | null>(null)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [result, setResult] = useState<BulkImportResult | null>(null)

  function reset() {
    setFile(null)
    setRowErrors(null)
    setGeneralError(null)
    setResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleFile(f: File) {
    if (!f.name.match(/\.(csv|txt)$/i)) {
      setGeneralError('Only .csv files are accepted. Please download the template and fill it in.')
      return
    }
    setFile(f)
    setRowErrors(null)
    setGeneralError(null)
    setResult(null)
  }

  async function handleSubmit() {
    if (!file) return
    setSubmitting(true)
    setRowErrors(null)
    setGeneralError(null)
    setResult(null)
    try {
      const res = await clientsService.bulkImport(file)
      setResult(res)
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      onSuccess()
    } catch (err) {
      const errors = extractErrors(err)
      if (errors) {
        setRowErrors(errors)
      } else {
        setGeneralError(extractMessage(err))
      }
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (result) {
    return (
      <div>
        {/* Success banner */}
        <div
          style={{
            background: B.greenBg,
            border: `1px solid #A7F3D0`,
            borderRadius: 10,
            padding: '16px 20px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 20 }}>✓</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: B.greenText, marginBottom: 4 }}>
              Import complete
            </div>
            <div style={{ fontSize: 13, color: B.greenText }}>
              {result.created} client{result.created !== 1 ? 's' : ''} added successfully.
            </div>
          </div>
        </div>

        {/* Next step hint */}
        <div
          style={{
            background: B.amberBg,
            border: `1px solid #FDE68A`,
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 20,
            fontSize: 13,
            color: B.amberText,
            lineHeight: 1.6,
          }}
        >
          <strong>Next step:</strong> Go to the <strong>Clients</strong> page and send HMRC invitations to each client individually.
        </div>

        <button
          type="button"
          onClick={reset}
          style={{
            fontSize: 13,
            fontWeight: 600,
            padding: '8px 16px',
            borderRadius: 8,
            border: `1px solid ${B.border}`,
            background: B.white,
            color: B.text,
            cursor: 'pointer',
          }}
        >
          Import another file
        </button>
      </div>
    )
  }

  // ── Upload + validation screen ──────────────────────────────────────────────
  return (
    <div>
      {/* Column reference */}
      <div
        style={{
          background: B.surface,
          border: `1px solid ${B.borderLight}`,
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 20,
          fontSize: 12,
        }}
      >
        <div style={{ fontWeight: 600, color: B.text, marginBottom: 8 }}>CSV column reference</div>
        <div style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: B.muted, marginRight: 6 }}>Required:</span>
          {['name', 'nino', 'postcode', 'email'].map((f) => (
            <RequiredPill key={f} label={f} />
          ))}
        </div>
        <div>
          <span style={{ fontSize: 11, color: B.muted, marginRight: 6 }}>Optional:</span>
          {['phone', 'agent_type', 'personal_message'].map((f) => (
            <FieldPill key={f} label={f} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: B.light, marginTop: 8 }}>
          NINO format: AB123456C (2 letters, 6 digits, 1 letter A–D) &nbsp;·&nbsp;
          agent_type: <code>main</code> or <code>supporting</code> (defaults to main)
        </div>
      </div>

      {/* Download template */}
      <div style={{ marginBottom: 20 }}>
        <button
          type="button"
          onClick={downloadTemplate}
          style={{
            fontSize: 13,
            fontWeight: 600,
            padding: '8px 16px',
            borderRadius: 8,
            border: `1px solid ${B.primary}`,
            background: B.blueBg,
            color: B.blueText,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
          Download CSV template
        </button>
        <span style={{ fontSize: 11, color: B.light, marginLeft: 10 }}>
          Fill in the template and upload below
        </span>
      </div>

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload CSV file"
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          const f = e.dataTransfer.files[0]
          if (f) handleFile(f)
        }}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
        style={{
          border: `2px dashed ${dragOver ? B.primary : file ? '#A7F3D0' : B.border}`,
          borderRadius: 10,
          padding: '32px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragOver ? B.blueBg : file ? B.greenBg : B.surface,
          transition: 'all 0.15s',
          marginBottom: 16,
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
        />
        {file ? (
          <>
            <div style={{ fontSize: 22, marginBottom: 6 }}>📄</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: B.greenText }}>{file.name}</div>
            <div style={{ fontSize: 11, color: B.muted, marginTop: 4 }}>
              {(file.size / 1024).toFixed(1)} KB &nbsp;·&nbsp; Click to replace
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 22, marginBottom: 8 }}>📂</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: B.text }}>
              Drop your CSV here or click to browse
            </div>
            <div style={{ fontSize: 11, color: B.light, marginTop: 4 }}>
              .csv files only &nbsp;·&nbsp; Max 2 MB &nbsp;·&nbsp; Max 200 clients per import
            </div>
          </>
        )}
      </div>

      {/* General error */}
      {generalError && (
        <div
          role="alert"
          style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 13,
            color: '#991B1B',
            marginBottom: 16,
          }}
        >
          {generalError}
        </div>
      )}

      {/* Row-level validation errors */}
      {rowErrors && rowErrors.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: '#991B1B',
              }}
            >
              {rowErrors.length} issue{rowErrors.length !== 1 ? 's' : ''} found — fix the file and re-upload
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 20,
                background: '#FEF2F2',
                color: '#991B1B',
                border: '1px solid #FECACA',
              }}
            >
              No clients were created
            </span>
          </div>

          <div
            style={{
              border: `1px solid #FECACA`,
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '64px 120px 1fr',
                padding: '8px 14px',
                background: '#FEF2F2',
                borderBottom: '1px solid #FECACA',
                fontSize: 11,
                fontWeight: 700,
                color: '#991B1B',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              <span>Row</span>
              <span>Column</span>
              <span>Issue</span>
            </div>
            {rowErrors.map((e, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '64px 120px 1fr',
                  padding: '9px 14px',
                  background: i % 2 === 0 ? '#FFF' : '#FEF2F2',
                  borderBottom: i < rowErrors.length - 1 ? '1px solid #FECACA' : 'none',
                  fontSize: 12,
                  alignItems: 'center',
                }}
              >
                <span style={{ fontWeight: 600, color: B.muted }}>{e.row}</span>
                <span>
                  <code
                    style={{
                      fontSize: 11,
                      background: '#FEE2E2',
                      padding: '1px 5px',
                      borderRadius: 3,
                      color: '#991B1B',
                    }}
                  >
                    {e.field}
                  </code>
                </span>
                <span style={{ color: B.text }}>{e.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Import button */}
      <button
        type="button"
        disabled={!file || submitting}
        onClick={handleSubmit}
        style={{
          fontSize: 14,
          fontWeight: 700,
          padding: '10px 24px',
          borderRadius: 8,
          border: 'none',
          background: !file || submitting ? B.borderLight : B.primary,
          color: !file || submitting ? B.muted : '#fff',
          cursor: !file || submitting ? 'not-allowed' : 'pointer',
          transition: 'background 0.15s',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
        }}
        aria-busy={submitting}
      >
        {submitting ? (
          <>
            <span
              style={{
                width: 14,
                height: 14,
                border: '2px solid rgba(255,255,255,0.4)',
                borderTop: '2px solid #fff',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin 0.7s linear infinite',
              }}
            />
            Importing…
          </>
        ) : (
          'Import clients'
        )}
      </button>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import portalService, { type PortalFileRecord } from '@/services/portal.service'
import B from '@/styles/theme'

const ALLOWED_EXTS = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp', '.csv', '.xls', '.xlsx', '.doc', '.docx', '.zip', '.txt']
const MAX_MB = 10

function FileIcon({ mime }: { mime: string }) {
  if (mime.startsWith('image/')) return <>🖼</>
  if (mime === 'application/pdf') return <>📄</>
  if (mime.includes('spreadsheet') || mime.includes('excel') || mime.includes('csv')) return <>📊</>
  if (mime.includes('word')) return <>📝</>
  if (mime === 'application/zip') return <>📦</>
  return <>📎</>
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(d: string): string {
  try {
    return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch { return d }
}

export default function PortalFilesPage() {
  const router = useRouter()
  const [files, setFiles]       = useState<PortalFileRecord[]>([])
  const [loading, setLoading]   = useState(true)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    portalService.getFiles()
      .then((f) => { setFiles(f); setLoading(false) })
      .catch(() => router.push('/portal/login'))
  }, [router])

  const handleFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    setError(''); setSuccess('')
    const file = fileList[0]

    // Client-side validation
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!ALLOWED_EXTS.includes(ext)) {
      setError(`File type "${ext}" is not allowed. Allowed: ${ALLOWED_EXTS.join(', ')}`)
      return
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum is ${MAX_MB} MB.`)
      return
    }

    setUploading(true)
    try {
      const record = await portalService.uploadFile(file)
      setFiles((prev) => [record, ...prev])
      setSuccess(`"${file.name}" uploaded successfully. Your accountant has been notified.`)
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault(); setDragging(false)
      void handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: B.text }}>Files</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: B.muted }}>
            Upload bank statements, receipts, or any documents your accountant has requested.
          </p>
        </div>
      </div>

      {/* Drag & drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? '#1E3A5F' : B.border}`,
          borderRadius: 12,
          padding: '40px 32px',
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          background: dragging ? '#EFF6FF' : B.white,
          marginBottom: 24,
          transition: 'all 0.15s',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          accept={ALLOWED_EXTS.join(',')}
          onChange={(e) => void handleFiles(e.target.files)}
          disabled={uploading}
        />
        <div style={{ fontSize: 36, marginBottom: 10 }}>
          {uploading ? '⏳' : '📤'}
        </div>
        <p style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 600, color: B.text }}>
          {uploading ? 'Uploading…' : 'Drop a file here or click to browse'}
        </p>
        <p style={{ margin: 0, fontSize: 12, color: B.muted }}>
          PDF, images, spreadsheets, Word documents, CSV, ZIP · Max {MAX_MB} MB
        </p>
      </div>

      {/* Feedback messages */}
      {error && (
        <div style={{ background: B.redBg, border: `1px solid #FECACA`, borderRadius: 8, padding: '10px 16px', fontSize: 13, color: B.redText, marginBottom: 16 }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: B.greenBg, border: `1px solid #A7F3D0`, borderRadius: 8, padding: '10px 16px', fontSize: 13, color: B.greenText, marginBottom: 16 }}>
          {success}
        </div>
      )}

      {/* File list */}
      {loading ? (
        <p style={{ fontSize: 14, color: B.muted }}>Loading files…</p>
      ) : files.length === 0 ? (
        <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, padding: '48px 32px', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: B.muted, margin: 0 }}>No files uploaded yet.</p>
        </div>
      ) : (
        <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, overflow: 'hidden' }}>
          <div style={{ padding: '12px 20px', borderBottom: `1px solid ${B.border}`, fontSize: 12, fontWeight: 600, color: B.muted }}>
            {files.length} file{files.length !== 1 ? 's' : ''} uploaded
          </div>
          {files.map((f, i) => (
            <div
              key={f.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 20px',
                borderBottom: i < files.length - 1 ? `1px solid ${B.borderLight}` : 'none',
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>
                <FileIcon mime={f.mimeType} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: B.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {f.originalName}
                </div>
                <div style={{ fontSize: 12, color: B.muted, marginTop: 2 }}>
                  {formatBytes(f.size)} · Uploaded {formatDate(f.createdAt)}
                </div>
              </div>
              <a
                href={portalService.downloadFileUrl(f.id)}
                download={f.originalName}
                style={{
                  padding: '5px 12px',
                  fontSize: 12,
                  color: B.blueText,
                  border: `1px solid #BAE6FD`,
                  borderRadius: 6,
                  background: B.blueBg,
                  textDecoration: 'none',
                  fontWeight: 500,
                  flexShrink: 0,
                }}
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

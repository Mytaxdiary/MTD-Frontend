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
  const [files, setFiles]         = useState<PortalFileRecord[]>([])
  const [loading, setLoading]     = useState(true)
  const [dragging, setDragging]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')
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

    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!ALLOWED_EXTS.includes(ext)) {
      setError(`File type "${ext}" is not allowed.`)
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
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: B.text, letterSpacing: '-0.3px' }}>Files</h2>
        <p style={{ margin: '5px 0 0', fontSize: 14, color: B.muted }}>
          Upload bank statements, receipts, or any documents your accountant has requested.
        </p>
      </div>

      {/* Drag and drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? '#1E3A5F' : '#94A3B8'}`,
          borderRadius: 14,
          padding: '44px 32px',
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          background: dragging ? '#EFF6FF' : B.white,
          marginBottom: 22,
          transition: 'all 0.15s',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
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
        <div style={{ fontSize: 40, marginBottom: 12 }}>
          {uploading ? '⏳' : '📤'}
        </div>
        <p style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: B.text }}>
          {uploading ? 'Uploading...' : 'Drop a file here or click to browse'}
        </p>
        <p style={{ margin: 0, fontSize: 13, color: B.muted }}>
          PDF, images, spreadsheets, Word, CSV, ZIP up to {MAX_MB} MB
        </p>
      </div>

      {/* Feedback */}
      {error && (
        <div style={{ background: B.redBg, border: `1px solid #FECACA`, borderRadius: 9, padding: '12px 18px', fontSize: 14, color: B.redText, marginBottom: 16, fontWeight: 500 }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: B.greenBg, border: `1px solid #A7F3D0`, borderRadius: 9, padding: '12px 18px', fontSize: 14, color: B.greenText, marginBottom: 16, fontWeight: 500 }}>
          {success}
        </div>
      )}

      {/* File list */}
      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: 40 }}>
          <p style={{ fontSize: 15, color: B.muted }}>Loading files...</p>
        </div>
      ) : files.length === 0 ? (
        <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, padding: '48px 32px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <p style={{ fontSize: 15, color: B.muted, margin: 0 }}>No files uploaded yet.</p>
        </div>
      ) : (
        <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '13px 22px', borderBottom: `1px solid ${B.border}`, fontSize: 13, fontWeight: 700, color: B.muted, background: B.surface, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            {files.length} file{files.length !== 1 ? 's' : ''} uploaded
          </div>
          {files.map((f, i) => (
            <div
              key={f.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '15px 22px',
                borderBottom: i < files.length - 1 ? `1px solid ${B.borderLight}` : 'none',
              }}
            >
              <span style={{ fontSize: 26, flexShrink: 0 }}>
                <FileIcon mime={f.mimeType} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: B.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {f.originalName}
                </div>
                <div style={{ fontSize: 13, color: B.muted, marginTop: 3 }}>
                  {formatBytes(f.size)} &nbsp;·&nbsp; Uploaded {formatDate(f.createdAt)}
                </div>
              </div>
              <a
                href={portalService.downloadFileUrl(f.id)}
                download={f.originalName}
                style={{
                  padding: '7px 16px',
                  fontSize: 13,
                  color: B.blueText,
                  border: `1px solid #BAE6FD`,
                  borderRadius: 7,
                  background: B.blueBg,
                  textDecoration: 'none',
                  fontWeight: 600,
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

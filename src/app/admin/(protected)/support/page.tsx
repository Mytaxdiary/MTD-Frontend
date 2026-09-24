import B from '@/styles/theme'

export default function AdminSupportPlaceholderPage() {
  return (
    <div style={{ padding: '28px 32px', maxWidth: 800 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px', color: B.text }}>
        Support
      </h1>
      <p style={{ margin: 0, fontSize: 14, color: B.muted }}>
        Support actions (force logout, deletion queue, email notes) will appear here in later
        tasks.
      </p>
    </div>
  )
}

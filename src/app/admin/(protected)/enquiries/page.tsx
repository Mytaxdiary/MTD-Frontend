import B from '@/styles/theme'

export default function AdminEnquiriesPlaceholderPage() {
  return (
    <div style={{ padding: '28px 32px', maxWidth: 800 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px', color: B.text }}>
        Enquiries
      </h1>
      <p style={{ margin: 0, fontSize: 14, color: B.muted }}>
        Enquiry list and status updates land in a later admin task. Submissions are already stored
        from the marketing site.
      </p>
    </div>
  )
}

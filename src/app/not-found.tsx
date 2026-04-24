export default function NotFound() {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: '#F8FAFC',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 56, fontWeight: 800, color: '#1B2A4A', letterSpacing: '-0.04em' }}>404</div>
        <div style={{ fontSize: 16, color: '#64748B', marginTop: 8 }}>Page not found</div>
      </div>
    </div>
  )
}

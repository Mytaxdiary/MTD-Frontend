// Placeholder login page — implement real auth UI in a future phase

export default function LoginPage() {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
        background: '#F8FAFC',
        color: '#0F172A',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #0EA5C9, #0284A8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#fff', margin: '0 auto 20px' }}>
          NE
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#1B2A4A', letterSpacing: '-0.02em' }}>NewEffect MTD ITSA</div>
        <div style={{ fontSize: 14, color: '#64748B', marginTop: 6 }}>
          {/* TODO: Replace with real login form */}
          Login — coming in a future phase
        </div>
      </div>
    </div>
  )
}

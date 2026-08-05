import B from '@/styles/theme'
import LegalFooter from '@/components/ui/LegalFooter'
import BrandLogo from '@/components/ui/BrandLogo'

type AuthPageLayoutProps = {
  subtitle: string
  maxWidth?: number
  children: React.ReactNode
  footerContent?: React.ReactNode
}

export default function AuthPageLayout({
  subtitle,
  maxWidth = 420,
  children,
  footerContent,
}: AuthPageLayoutProps) {
  return (
    // WCAG 1.3.6 — <main> identifies the primary content region on auth pages.
    <main
      id="main-content"
      tabIndex={-1}
      style={{
        minHeight: '100vh',
        background: B.surface,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif",
        padding: '24px 16px',
        outline: 'none',
      }}
    >
      <div style={{ width: '100%', maxWidth }}>
        {/* Logo — product name is in the image alt text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 28,
          }}
        >
          <div
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(15,23,42,0.12)',
              marginBottom: 12,
            }}
          >
            <BrandLogo width={260} priority />
          </div>
          {/* WCAG 1.4.3 — subtitle: #64748B on #F8FAFC → 4.6:1 ✓ */}
          <div style={{ fontSize: 13, color: B.muted, marginTop: 4 }}>{subtitle}</div>
        </div>

        {/* Card — heading inside provides page-level context for screen readers */}
        <div
          style={{
            background: B.white,
            borderRadius: 16,
            border: `1px solid ${B.border}`,
            padding: '32px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          {/* Visually hidden page heading for screen reader navigation */}
          <h1 className="sr-only">{subtitle}</h1>
          {children}
        </div>

        {footerContent && (
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: B.muted }}>
            {footerContent}
          </div>
        )}

        <LegalFooter />
      </div>
    </main>
  )
}

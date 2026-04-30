import B from "@/styles/theme";

type AuthPageLayoutProps = {
  subtitle: string;
  maxWidth?: number;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
};

export default function AuthPageLayout({ subtitle, maxWidth = 420, children, footerContent }: AuthPageLayoutProps) {
  return (
    <div style={{ minHeight: "100vh", background: B.surface, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif", padding: "24px 16px" }}>
      <div style={{ width: "100%", maxWidth }}>

        {/* Logo */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg,${B.primary},${B.primaryDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#fff", marginBottom: 14, boxShadow: "0 4px 12px rgba(14,165,201,0.3)" }}>
            NE
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: B.navy, letterSpacing: "-0.02em" }}>NewEffect MTD ITSA</div>
          <div style={{ fontSize: 13, color: B.muted, marginTop: 4 }}>{subtitle}</div>
        </div>

        {/* Card */}
        <div style={{ background: B.white, borderRadius: 16, border: `1px solid ${B.border}`, padding: "32px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          {children}
        </div>

        {footerContent && (
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: B.muted }}>
            {footerContent}
          </div>
        )}

      </div>
    </div>
  );
}

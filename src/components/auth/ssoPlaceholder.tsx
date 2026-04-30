import B from "@/styles/theme";

export default function SSOPlaceholder({ dividerText = "or continue with" }: { dividerText?: string }) {
  const btnStyle: React.CSSProperties = {
    flex: 1, padding: "9px 14px", borderRadius: 8,
    border: `1px solid ${B.border}`, background: B.white,
    fontSize: 12, fontWeight: 500, color: B.muted,
    cursor: "not-allowed", display: "flex", alignItems: "center",
    justifyContent: "center", gap: 8, opacity: 0.7,
  };

  return (
    <>
      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
        <div style={{ flex: 1, height: 1, background: B.border }} />
        <span style={{ fontSize: 11, color: B.light, fontWeight: 500, whiteSpace: "nowrap" }}>{dividerText}</span>
        <div style={{ flex: 1, height: 1, background: B.border }} />
      </div>

      {/* SSO placeholder buttons */}
      {/* TODO: wire up real OAuth providers (Google Workspace, Microsoft 365) in next phase */}
      <div style={{ display: "flex", gap: 10 }}>
        <button type="button" disabled style={btnStyle}>
          <span style={{ fontSize: 14 }}>G</span> Google Workspace
        </button>
        <button type="button" disabled style={btnStyle}>
          <span style={{ fontSize: 14 }}>⊞</span> Microsoft 365
        </button>
      </div>
      <div style={{ textAlign: "center", marginTop: 8, fontSize: 11, color: B.light }}>SSO coming soon</div>
    </>
  );
}

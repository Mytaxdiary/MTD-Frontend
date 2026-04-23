import { useState } from "react";

const B = {
  primary: "#0EA5C9", primaryDark: "#0284A8", navy: "#1B2A4A",
  surface: "#F8FAFC", white: "#FFFFFF", border: "#E2E8F0", borderLight: "#F1F5F9",
  text: "#0F172A", muted: "#64748B", light: "#94A3B8", xlight: "#CBD5E1",
  red: "#EF4444", redBg: "#FEF2F2", redText: "#991B1B",
  amber: "#F59E0B", amberBg: "#FFFBEB", amberText: "#92400E",
  green: "#10B981", greenBg: "#ECFDF5", greenText: "#065F46",
  purple: "#8B5CF6", purpleBg: "#F5F3FF", purpleText: "#5B21B6",
  blueBg: "#F0F9FF", blueText: "#0C4A6E",
};

const pendingInvites = [
  { id: 1, name: "Aisha Patel", nino: "AB 12 34 56 C", sent: "12 Apr 2026", expires: "3 May 2026", daysLeft: 14, agentType: "Main" },
  { id: 2, name: "—", nino: "CD 65 43 21 B", sent: "18 Apr 2026", expires: "9 May 2026", daysLeft: 20, agentType: "Supporting" },
];

const recentlyAdded = [
  { name: "Priya Sharma", business: "Sharma Design Studio", added: "15 Mar 2025", status: "Active" },
  { name: "David Okafor", business: "Okafor Plumbing", added: "20 Mar 2025", status: "Active" },
  { name: "Rebecca Hall", business: "Hall Interiors", added: "2 Apr 2025", status: "Active" },
];

const NavItem = ({ label, active, icon, count, onClick }) => (
  <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 8, cursor: "pointer", background: active ? "rgba(14,165,201,0.12)" : "transparent", color: active ? B.primary : "rgba(255,255,255,0.65)", fontSize: 13, fontWeight: active ? 600 : 400, marginBottom: 2 }}>
    <span style={{ fontSize: 15, opacity: active ? 1 : 0.6 }}>{icon}</span>
    <span style={{ flex: 1 }}>{label}</span>
    {count > 0 && <span style={{ fontSize: 10, fontWeight: 700, background: B.red, color: "#fff", borderRadius: 10, padding: "1px 7px" }}>{count}</span>}
  </div>
);

export default function AddClient({ navigate = () => {} }) {
  const [nino, setNino] = useState("");
  const [agentType, setAgentType] = useState("main");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [mode, setMode] = useState("single");

  const ninoFormatted = nino.toUpperCase().replace(/[^A-Z0-9]/g, "").replace(/(.{2})(?=.)/g, "$1 ").trim();
  const ninoValid = nino.replace(/\s/g, "").length === 9;

  const handleSend = () => { if (ninoValid) setSent(true); };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", background: B.surface, color: B.text }}>
      <div style={{ width: 230, background: B.navy, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "22px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${B.primary}, ${B.primaryDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#fff" }}>NE</div>
            <div><div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>NewEffect</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>MTD ITSA</div></div>
          </div>
        </div>
        <div style={{ padding: "16px 12px", flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", padding: "0 14px", marginBottom: 8 }}>MAIN</div>
          <NavItem label="Dashboard" icon="⊞" onClick={() => navigate("dashboard")} />
          <NavItem label="Clients" icon="⊡" onClick={() => navigate("clients")} />
          <NavItem label="Chase manager" icon="↗" count={2} onClick={() => navigate("chase")} />
          <NavItem label="Filing status" icon="◎" onClick={() => navigate("dashboard")} />
          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", padding: "0 14px", marginTop: 24, marginBottom: 8 }}>MANAGE</div>
          <NavItem label="Add client" active icon="+" onClick={() => navigate("add-client")} />
          <NavItem label="Settings" icon="⚙" onClick={() => navigate("settings")} />
          <NavItem label="HMRC connection" icon="⟷" onClick={() => navigate("settings")} />
        </div>
        <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 20, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>JW</div>
            <div><div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Jane Walker</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Walker & Co</div></div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 32px", background: B.white, borderBottom: `1px solid ${B.border}`, flexShrink: 0 }}>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Add client</div>
          <div style={{ fontSize: 13, color: B.muted, marginTop: 2 }}>Send an HMRC authorisation invitation to a new client</div>
        </div>

        <div style={{ padding: "24px 32px", flex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
            {/* Left — form */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Mode tabs */}
              <div style={{ display: "flex", gap: 4, padding: 4, background: B.borderLight, borderRadius: 10, width: "fit-content" }}>
                {[{ k: "single", l: "Single client" }, { k: "bulk", l: "Bulk import (CSV)" }].map(m => (
                  <button key={m.k} onClick={() => setMode(m.k)} style={{
                    padding: "7px 18px", borderRadius: 7, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
                    background: mode === m.k ? B.white : "transparent", color: mode === m.k ? B.text : B.muted,
                    boxShadow: mode === m.k ? "0 1px 3px rgba(0,0,0,0.06)" : "none"
                  }}>{m.l}</button>
                ))}
              </div>

              {mode === "single" && !sent && (
                <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, padding: "24px" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Client details</div>

                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: "block", marginBottom: 6 }}>National Insurance number (NINO) *</label>
                    <input value={ninoFormatted} onChange={e => setNino(e.target.value)} placeholder="QQ 12 34 56 C" maxLength={13} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${nino.length > 0 && !ninoValid ? "#FECACA" : B.border}`, fontSize: 15, fontFamily: "monospace", letterSpacing: "0.08em", outline: "none", background: B.white, color: B.text }} />
                    {nino.length > 0 && !ninoValid && <div style={{ fontSize: 11, color: B.red, marginTop: 4 }}>NINO must be 9 characters (2 letters, 6 digits, 1 letter)</div>}
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: "block", marginBottom: 6 }}>Client name (for your records)</label>
                    <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="e.g. John Smith" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, outline: "none", background: B.white, color: B.text }} />
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: "block", marginBottom: 6 }}>Client email (to send invitation link)</label>
                    <input value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="client@example.com" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, outline: "none", background: B.white, color: B.text }} />
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: "block", marginBottom: 8 }}>Agent type *</label>
                    <div style={{ display: "flex", gap: 12 }}>
                      {[
                        { k: "main", l: "Main agent", d: "Full access — quarterly updates, final declarations, tax calculations" },
                        { k: "supporting", l: "Supporting agent", d: "Limited — in-year quarterly updates only, no final declarations" },
                      ].map(a => (
                        <div key={a.k} onClick={() => setAgentType(a.k)} style={{
                          flex: 1, padding: "14px 16px", borderRadius: 10, cursor: "pointer",
                          border: `1.5px solid ${agentType === a.k ? B.primary : B.border}`,
                          background: agentType === a.k ? B.blueBg : B.white, transition: "all 0.15s"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 16, height: 16, borderRadius: 8, border: `2px solid ${agentType === a.k ? B.primary : B.xlight}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {agentType === a.k && <div style={{ width: 8, height: 8, borderRadius: 4, background: B.primary }} />}
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: agentType === a.k ? B.blueText : B.text }}>{a.l}</span>
                          </div>
                          <div style={{ fontSize: 11, color: B.muted, marginTop: 6, paddingLeft: 24 }}>{a.d}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: `1px solid ${B.border}`, paddingTop: 20, display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button onClick={handleSend} disabled={!ninoValid} style={{
                      padding: "10px 24px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 700, cursor: ninoValid ? "pointer" : "not-allowed",
                      background: ninoValid ? B.primary : B.xlight, color: ninoValid ? "#fff" : B.muted
                    }}>Send HMRC invitation</button>
                  </div>
                </div>
              )}

              {mode === "single" && sent && (
                <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, padding: "40px", textAlign: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: 28, background: B.greenBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 24, border: "2px solid #A7F3D0" }}>✓</div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Invitation sent</div>
                  <div style={{ fontSize: 13, color: B.muted, lineHeight: 1.6, maxWidth: 400, margin: "0 auto" }}>
                    An HMRC authorisation request has been created. The client will receive an email with a link to accept — they need to sign in with their Government Gateway credentials.
                  </div>
                  <div style={{ marginTop: 16, padding: "12px 16px", background: B.amberBg, borderRadius: 8, border: "1px solid #FDE68A", fontSize: 12, color: B.amberText, lineHeight: 1.5 }}>
                    The invitation expires in 21 days. If the client doesn't accept, you can re-send from the pending invitations list below.
                  </div>
                  <button onClick={() => { setSent(false); setNino(""); setClientName(""); setClientEmail(""); }} style={{ marginTop: 20, padding: "8px 20px", borderRadius: 8, border: `1px solid ${B.border}`, background: B.white, fontSize: 13, fontWeight: 500, cursor: "pointer", color: B.text }}>Add another client</button>
                </div>
              )}

              {mode === "bulk" && (
                <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, padding: "24px" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Bulk import clients</div>
                  <div style={{ fontSize: 13, color: B.muted, marginBottom: 20, lineHeight: 1.6 }}>Upload a CSV file with your client NINOs to send multiple invitations at once. We'll create an HMRC authorisation request for each client.</div>
                  <div style={{ border: `2px dashed ${B.border}`, borderRadius: 12, padding: "40px 20px", textAlign: "center", background: B.surface }}>
                    <div style={{ fontSize: 32, color: B.xlight, marginBottom: 12 }}>+</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: B.text, marginBottom: 4 }}>Drop your CSV file here or click to browse</div>
                    <div style={{ fontSize: 12, color: B.light }}>Required columns: NINO, Client name, Email</div>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <button style={{ padding: "6px 14px", borderRadius: 6, border: `1px solid ${B.border}`, background: "transparent", fontSize: 12, fontWeight: 500, cursor: "pointer", color: B.primary }}>Download CSV template</button>
                  </div>
                </div>
              )}
            </div>

            {/* Right — pending + recent */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Pending invitations */}
              <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${B.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>Pending invitations</div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20, background: B.purpleBg, color: B.purpleText, border: "1px solid #DDD6FE" }}>{pendingInvites.length}</span>
                </div>
                <div style={{ padding: "4px 20px 12px" }}>
                  {pendingInvites.map((inv, i) => (
                    <div key={inv.id} style={{ padding: "12px 0", borderBottom: i < pendingInvites.length - 1 ? `1px solid ${B.borderLight}` : "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{inv.name}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10, background: B.amberBg, color: B.amberText }}>Pending</span>
                      </div>
                      <div style={{ fontSize: 11, fontFamily: "monospace", color: B.muted, marginTop: 3 }}>{inv.nino}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                        <span style={{ fontSize: 11, color: B.light }}>Sent {inv.sent} — Expires {inv.expires} ({inv.daysLeft}d)</span>
                        <button style={{ fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 6, border: `1px solid ${B.border}`, background: "transparent", cursor: "pointer", color: B.muted }}>Resend</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* How it works */}
              <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${B.border}`, fontSize: 14, fontWeight: 700 }}>How the invitation works</div>
                <div style={{ padding: "14px 20px" }}>
                  {[
                    { n: "1", t: "You send the invitation", d: "We create an HMRC authorisation request using the Agent Authorisation API" },
                    { n: "2", t: "Client receives email", d: "They get a link to HMRC's Government Gateway to accept your request" },
                    { n: "3", t: "Client accepts", d: "They sign in with their individual Government Gateway credentials and confirm" },
                    { n: "4", t: "Relationship active", d: "We fetch their business details and obligations — they appear on your dashboard" },
                  ].map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, marginBottom: i < 3 ? 14 : 0 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 12, background: B.blueBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: B.blueText, flexShrink: 0, border: "1px solid #BAE6FD" }}>{s.n}</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{s.t}</div>
                        <div style={{ fontSize: 11, color: B.muted, marginTop: 1, lineHeight: 1.5 }}>{s.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recently added */}
              <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${B.border}`, fontSize: 14, fontWeight: 700 }}>Recently added</div>
                <div style={{ padding: "4px 20px 8px" }}>
                  {recentlyAdded.map((c, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < recentlyAdded.length - 1 ? `1px solid ${B.borderLight}` : "none" }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: B.light }}>{c.business}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 10, background: B.greenBg, color: B.greenText }}>{c.status}</span>
                        <div style={{ fontSize: 10, color: B.light, marginTop: 2 }}>{c.added}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

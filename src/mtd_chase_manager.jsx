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

const chaseClients = [
  { id: 1, name: "Sarah Mitchell", business: "Mitchell Consulting", deadline: "7 Apr 2026", daysOverdue: 12, lastChase: "10 Apr 2026", chaseCount: 3, status: "no-response", email: "sarah@mitchell.co.uk" },
  { id: 2, name: "James Cooper", business: "Cooper Properties", deadline: "7 Apr 2026", daysOverdue: 12, lastChase: "14 Apr 2026", chaseCount: 2, status: "opened", email: "james@cooperprops.co.uk" },
  { id: 4, name: "Tom Grant", business: "Grant Rentals", deadline: "7 May 2026", daysOverdue: -19, lastChase: "16 Apr 2026", chaseCount: 1, status: "opened", email: "tom@grantrentals.co.uk" },
  { id: 7, name: "Marcus Chen", business: "Chen Photography", deadline: "7 May 2026", daysOverdue: -19, lastChase: null, chaseCount: 0, status: "not-started", email: "marcus@chenphotos.com" },
  { id: 9, name: "George Whitfield", business: "Whitfield Electricals", deadline: "7 May 2026", daysOverdue: -19, lastChase: "12 Apr 2026", chaseCount: 1, status: "no-response", email: "george@whitfield-elec.co.uk" },
  { id: 11, name: "Oliver Stone", business: "Stone Lettings", deadline: "7 May 2026", daysOverdue: -19, lastChase: null, chaseCount: 0, status: "not-started", email: "oliver@stonelettings.co.uk" },
];

const templates = [
  { id: "gentle", name: "Gentle reminder", subject: "Quarterly records needed — {business}", preview: "Hi {name}, just a reminder that your quarterly records for {quarter} are due by {deadline}. Please log in to your NewEffect portal to submit your income and expenses..." },
  { id: "urgent", name: "Urgent — deadline passed", subject: "Action required: overdue quarterly update — {business}", preview: "Hi {name}, the deadline for your {quarter} quarterly update has now passed. To avoid potential penalties, please submit your records as soon as possible..." },
  { id: "final", name: "Final notice", subject: "Final reminder: {business} quarterly records overdue", preview: "Hi {name}, this is our final reminder regarding your overdue {quarter} quarterly update. We need your records urgently to submit to HMRC on your behalf..." },
];

const NavItem = ({ label, active, icon, count, onClick }) => (
  <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 8, cursor: "pointer", background: active ? "rgba(14,165,201,0.12)" : "transparent", color: active ? B.primary : "rgba(255,255,255,0.65)", fontSize: 13, fontWeight: active ? 600 : 400, marginBottom: 2 }}>
    <span style={{ fontSize: 15, opacity: active ? 1 : 0.6 }}>{icon}</span>
    <span style={{ flex: 1 }}>{label}</span>
    {count > 0 && <span style={{ fontSize: 10, fontWeight: 700, background: B.red, color: "#fff", borderRadius: 10, padding: "1px 7px" }}>{count}</span>}
  </div>
);

const ResponseBadge = ({ status }) => {
  const m = {
    "no-response": { bg: B.redBg, c: B.redText, b: "#FECACA", l: "No response" },
    opened: { bg: B.amberBg, c: B.amberText, b: "#FDE68A", l: "Opened" },
    responded: { bg: B.greenBg, c: B.greenText, b: "#A7F3D0", l: "Responded" },
    "not-started": { bg: B.surface, c: B.light, b: B.border, l: "Not chased" },
  };
  const s = m[status];
  return <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: s.bg, color: s.c, border: `1px solid ${s.b}` }}>{s.l}</span>;
};

export default function ChaseManager({ navigate = () => {} }) {
  const [selectedTemplate, setSelectedTemplate] = useState("gentle");
  const [selected, setSelected] = useState(new Set());
  const [sent, setSent] = useState(new Set());

  const toggleSelect = (id) => setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected(p => p.size === chaseClients.length ? new Set() : new Set(chaseClients.map(c => c.id)));

  const overdueClients = chaseClients.filter(c => c.daysOverdue > 0);
  const upcomingClients = chaseClients.filter(c => c.daysOverdue <= 0);

  const handleSend = () => { setSent(new Set([...sent, ...selected])); setSelected(new Set()); };

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
          <NavItem label="Chase manager" active icon="↗" count={2} onClick={() => navigate("chase")} />
          <NavItem label="Filing status" icon="◎" onClick={() => navigate("dashboard")} />
          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", padding: "0 14px", marginTop: 24, marginBottom: 8 }}>MANAGE</div>
          <NavItem label="Add client" icon="+" onClick={() => navigate("add-client")} />
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
        <div style={{ padding: "16px 32px", background: B.white, borderBottom: `1px solid ${B.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Chase manager</div>
            <div style={{ fontSize: 13, color: B.muted, marginTop: 2 }}>{chaseClients.length} clients needing records — {overdueClients.length} overdue, {upcomingClients.length} upcoming</div>
          </div>
          {selected.size > 0 && (
            <button onClick={handleSend} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: B.primary, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Send to {selected.size} client{selected.size > 1 ? "s" : ""}
            </button>
          )}
        </div>

        <div style={{ padding: "24px 32px", flex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
            {/* Left — client list */}
            <div>
              {/* Overdue section */}
              {overdueClients.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: B.red }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: B.redText }}>Overdue — deadline passed</span>
                    <span style={{ fontSize: 11, color: B.muted }}>({overdueClients.length})</span>
                  </div>
                  <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, overflow: "hidden" }}>
                    {overdueClients.map((c, i) => (
                      <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: i < overdueClients.length - 1 ? `1px solid ${B.borderLight}` : "none", background: sent.has(c.id) ? B.greenBg : selected.has(c.id) ? "#F0F9FF" : "transparent", transition: "background 0.15s" }}>
                        <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleSelect(c.id)} style={{ cursor: "pointer", accentColor: B.primary }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <span style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</span>
                              <span style={{ color: B.muted, fontSize: 12, marginLeft: 8 }}>{c.business}</span>
                            </div>
                            <ResponseBadge status={sent.has(c.id) ? "responded" : c.status} />
                          </div>
                          <div style={{ display: "flex", gap: 20, marginTop: 6, fontSize: 11, color: B.light }}>
                            <span>Due: <b style={{ color: B.redText }}>{c.deadline}</b> ({c.daysOverdue} days overdue)</span>
                            <span>Chased: <b style={{ color: B.text }}>{c.chaseCount}x</b></span>
                            {c.lastChase && <span>Last: {c.lastChase}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming section */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: B.amber }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: B.amberText }}>Upcoming — chase window open</span>
                  <span style={{ fontSize: 11, color: B.muted }}>({upcomingClients.length})</span>
                </div>
                <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, overflow: "hidden" }}>
                  {upcomingClients.map((c, i) => (
                    <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: i < upcomingClients.length - 1 ? `1px solid ${B.borderLight}` : "none", background: sent.has(c.id) ? B.greenBg : selected.has(c.id) ? "#F0F9FF" : "transparent", transition: "background 0.15s" }}>
                      <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleSelect(c.id)} style={{ cursor: "pointer", accentColor: B.primary }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <span style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</span>
                            <span style={{ color: B.muted, fontSize: 12, marginLeft: 8 }}>{c.business}</span>
                          </div>
                          <ResponseBadge status={sent.has(c.id) ? "responded" : c.status} />
                        </div>
                        <div style={{ display: "flex", gap: 20, marginTop: 6, fontSize: 11, color: B.light }}>
                          <span>Due: <b style={{ color: B.text }}>{c.deadline}</b> ({Math.abs(c.daysOverdue)} days left)</span>
                          <span>Chased: <b style={{ color: B.text }}>{c.chaseCount}x</b></span>
                          {c.lastChase && <span>Last: {c.lastChase}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — template picker + preview */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${B.border}`, fontSize: 14, fontWeight: 700 }}>Chase template</div>
                <div style={{ padding: "8px 12px" }}>
                  {templates.map(t => (
                    <div key={t.id} onClick={() => setSelectedTemplate(t.id)} style={{
                      padding: "10px 12px", borderRadius: 8, cursor: "pointer", marginBottom: 4,
                      background: selectedTemplate === t.id ? B.blueBg : "transparent",
                      border: `1px solid ${selectedTemplate === t.id ? "#BAE6FD" : "transparent"}`,
                      transition: "all 0.15s"
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: selectedTemplate === t.id ? B.blueText : B.text }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: B.muted, marginTop: 2 }}>Subject: {t.subject}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, overflow: "hidden" }}>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${B.border}`, fontSize: 14, fontWeight: 700 }}>Preview</div>
                <div style={{ padding: "16px 20px" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: B.muted, marginBottom: 4 }}>Subject</div>
                  <div style={{ fontSize: 12, color: B.text, marginBottom: 16, padding: "8px 12px", background: B.surface, borderRadius: 6, border: `1px solid ${B.borderLight}` }}>
                    {templates.find(t => t.id === selectedTemplate)?.subject}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: B.muted, marginBottom: 4 }}>Body</div>
                  <div style={{ fontSize: 12, color: B.muted, lineHeight: 1.7, padding: "12px", background: B.surface, borderRadius: 6, border: `1px solid ${B.borderLight}` }}>
                    {templates.find(t => t.id === selectedTemplate)?.preview}
                  </div>
                  <div style={{ fontSize: 10, color: B.light, marginTop: 10 }}>Variables like {"{name}"}, {"{business}"}, {"{quarter}"}, {"{deadline}"} are replaced per client automatically.</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1, padding: "14px", background: B.white, borderRadius: 10, border: `1px solid ${B.border}`, textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{chaseClients.reduce((s, c) => s + c.chaseCount, 0)}</div>
                  <div style={{ fontSize: 11, color: B.muted, marginTop: 2 }}>Total chases sent</div>
                </div>
                <div style={{ flex: 1, padding: "14px", background: B.white, borderRadius: 10, border: `1px solid ${B.border}`, textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: B.amberText }}>{chaseClients.filter(c => c.status === "no-response").length}</div>
                  <div style={{ fontSize: 11, color: B.muted, marginTop: 2 }}>No response</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

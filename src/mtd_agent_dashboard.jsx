import { useState } from "react";

const BRAND = {
  primary: "#0EA5C9", primaryDark: "#0284A8", navy: "#1B2A4A", navyLight: "#243656",
  dark: "#0F172A", surface: "#F8FAFC", white: "#FFFFFF", border: "#E2E8F0", borderLight: "#F1F5F9",
  text: "#0F172A", textMuted: "#64748B", textLight: "#94A3B8",
  red: "#EF4444", redBg: "#FEF2F2", redText: "#991B1B",
  amber: "#F59E0B", amberBg: "#FFFBEB", amberText: "#92400E",
  green: "#10B981", greenBg: "#ECFDF5", greenText: "#065F46",
  purple: "#8B5CF6", purpleBg: "#F5F3FF", purpleText: "#5B21B6",
};

const clients = [
  { id: 1, name: "Sarah Mitchell", business: "Mitchell Consulting", type: "Self-employment", status: "overdue", q: "Q1", deadline: "7 Apr 2026", daysLeft: -11, chase: "No response", records: false, balance: 2400 },
  { id: 2, name: "James Cooper", business: "Cooper Properties", type: "UK Property", status: "overdue", q: "Q1", deadline: "7 Apr 2026", daysLeft: -11, chase: "Opened email", records: false, balance: 0 },
  { id: 3, name: "Priya Sharma", business: "Sharma Design Studio", type: "Self-employment", status: "due-soon", q: "Q1", deadline: "7 May 2026", daysLeft: 19, chase: "Records received", records: true, balance: 3620 },
  { id: 4, name: "Tom & Lisa Grant", business: "Grant Rentals", type: "UK Property", status: "due-soon", q: "Q1", deadline: "7 May 2026", daysLeft: 19, chase: "Chased 3 days ago", records: false, balance: 1800 },
  { id: 5, name: "David Okafor", business: "Okafor Plumbing", type: "Self-employment", status: "filed", q: "Q1", deadline: "7 Apr 2026", daysLeft: 0, chase: "Complete", records: true, balance: 0 },
  { id: 6, name: "Rebecca Hall", business: "Hall Interiors", type: "Self-employment", status: "filed", q: "Q1", deadline: "7 Apr 2026", daysLeft: 0, chase: "Complete", records: true, balance: 0 },
  { id: 7, name: "Marcus Chen", business: "Chen Photography", type: "Self-employment", status: "due-soon", q: "Q1", deadline: "7 May 2026", daysLeft: 19, chase: "Not started", records: false, balance: 950 },
  { id: 8, name: "Aisha Patel", business: "Patel Tutoring", type: "Self-employment", status: "pending-invite", q: "—", deadline: "—", daysLeft: 0, chase: "Invite sent 12 Apr", records: false, balance: 0 },
];

const StatusBadge = ({ status }) => {
  const map = {
    overdue: { bg: BRAND.redBg, color: BRAND.redText, border: "#FECACA", label: "Overdue" },
    "due-soon": { bg: BRAND.amberBg, color: BRAND.amberText, border: "#FDE68A", label: "Due soon" },
    filed: { bg: BRAND.greenBg, color: BRAND.greenText, border: "#A7F3D0", label: "Filed" },
    "pending-invite": { bg: BRAND.purpleBg, color: BRAND.purpleText, border: "#DDD6FE", label: "Pending invite" },
  };
  const s = map[status];
  return <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: "nowrap" }}>{s.label}</span>;
};

const MetricCard = ({ label, value, sub, color, icon }) => (
  <div style={{ flex: 1, background: BRAND.white, borderRadius: 12, padding: "18px 20px", border: `1px solid ${BRAND.border}`, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 500, color: BRAND.textMuted, letterSpacing: "0.02em", marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: BRAND.text, lineHeight: 1, letterSpacing: "-0.02em" }}>{value}</div>
        <div style={{ fontSize: 11, color: BRAND.textLight, marginTop: 4 }}>{sub}</div>
      </div>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{icon}</div>
    </div>
  </div>
);

const NavItem = ({ label, active, icon, count, onClick }) => (
  <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 8, cursor: "pointer", background: active ? "rgba(14,165,201,0.12)" : "transparent", color: active ? BRAND.primary : "rgba(255,255,255,0.65)", fontSize: 13, fontWeight: active ? 600 : 400, marginBottom: 2 }}>
    <span style={{ fontSize: 15, opacity: active ? 1 : 0.6 }}>{icon}</span>
    <span style={{ flex: 1 }}>{label}</span>
    {count > 0 && <span style={{ fontSize: 10, fontWeight: 700, background: BRAND.red, color: "#fff", borderRadius: 10, padding: "1px 7px", minWidth: 18, textAlign: "center" }}>{count}</span>}
  </div>
);

export default function Dashboard({ navigate = () => {} }) {
  const [filter, setFilter] = useState("all");
  const [selectedClient, setSelectedClient] = useState(null);

  const filtered = filter === "all" ? clients : clients.filter(c => c.status === filter);
  const overdueCount = clients.filter(c => c.status === "overdue").length;
  const dueSoonCount = clients.filter(c => c.status === "due-soon").length;
  const recordsReady = clients.filter(c => c.records && c.status !== "filed").length;
  const pendingInvites = clients.filter(c => c.status === "pending-invite").length;
  const totalOutstanding = clients.reduce((s, c) => s + c.balance, 0);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", background: BRAND.surface, color: BRAND.text }}>
      <div style={{ width: 230, background: BRAND.navy, display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "22px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#fff", letterSpacing: "-0.5px" }}>NE</div>
            <div><div style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>NewEffect</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>MTD ITSA</div></div>
          </div>
        </div>
        <div style={{ padding: "16px 12px", flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", padding: "0 14px", marginBottom: 8 }}>MAIN</div>
          <NavItem label="Dashboard" active icon="⊞" onClick={() => navigate("dashboard")} />
          <NavItem label="Clients" icon="⊡" onClick={() => navigate("clients")} />
          <NavItem label="Chase manager" icon="↗" count={overdueCount} onClick={() => navigate("chase")} />
          <NavItem label="Filing status" icon="◎" onClick={() => navigate("dashboard")} />
          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", padding: "0 14px", marginTop: 24, marginBottom: 8 }}>MANAGE</div>
          <NavItem label="Add client" icon="+" onClick={() => navigate("add-client")} />
          <NavItem label="Settings" icon="⚙" onClick={() => navigate("settings")} />
          <NavItem label="HMRC connection" icon="⟷" onClick={() => navigate("settings")} />
        </div>
        <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 32, height: 32, borderRadius: 20, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>JW</div><div><div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Jane Walker</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Walker & Co Accountants</div></div></div></div>
      </div>

      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 32px", background: BRAND.white, borderBottom: `1px solid ${BRAND.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Good morning, Jane</div>
            <div style={{ fontSize: 13, color: BRAND.textMuted, marginTop: 2 }}>Wednesday 22 April 2026 — Tax year 2025-26, Q4</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => navigate("add-client")} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${BRAND.border}`, background: BRAND.white, fontSize: 13, fontWeight: 500, cursor: "pointer", color: BRAND.text, display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 14 }}>+</span> Add client</button>
            <button onClick={() => navigate("chase")} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: BRAND.primary, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 14 }}>↗</span> Chase all overdue</button>
          </div>
        </div>

        <div style={{ padding: "24px 32px", flex: 1 }}>
          <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>
            <MetricCard label="OVERDUE" value={overdueCount} sub="Past deadline — act now" color={BRAND.red} icon={<span style={{ color: BRAND.red }}>!</span>} />
            <MetricCard label="DUE WITHIN 30 DAYS" value={dueSoonCount} sub="Chase window open" color={BRAND.amber} icon={<span style={{ color: BRAND.amber }}>◷</span>} />
            <MetricCard label="RECORDS READY" value={recordsReady} sub="Ready for review" color={BRAND.green} icon={<span style={{ color: BRAND.green }}>✓</span>} />
            <MetricCard label="PENDING INVITES" value={pendingInvites} sub="Awaiting acceptance" color={BRAND.purple} icon={<span style={{ color: BRAND.purple }}>⟳</span>} />
            <MetricCard label="OUTSTANDING TO HMRC" value={`£${Math.round(totalOutstanding/1000)}k`} sub={`${clients.filter(c=>c.balance>0).length} clients with balance`} color={BRAND.navy} icon={<span style={{ color: BRAND.navy }}>£</span>} />
          </div>

          <div style={{ background: BRAND.white, borderRadius: 12, border: `1px solid ${BRAND.border}`, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BRAND.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em" }}>Client overview</div>
              <div style={{ display: "flex", gap: 4 }}>
                {[{ key: "all", label: "All", count: clients.length },{ key: "overdue", label: "Overdue", count: overdueCount },{ key: "due-soon", label: "Due soon", count: dueSoonCount },{ key: "filed", label: "Filed", count: clients.filter(c => c.status === "filed").length },{ key: "pending-invite", label: "Pending", count: pendingInvites }].map(f => (
                  <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding: "5px 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer", background: filter === f.key ? BRAND.navy : "transparent", color: filter === f.key ? "#fff" : BRAND.textMuted, transition: "all 0.15s" }}>{f.label} ({f.count})</button>
                ))}
              </div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ borderBottom: `1px solid ${BRAND.border}` }}>
                {["Client", "Business type", "Quarter", "Deadline", "Status", "Chase status", "Balance", ""].map((h, i) => (
                  <th key={i} style={{ padding: "10px 16px", textAlign: h === "Balance" ? "right" : "left", fontSize: 11, fontWeight: 600, color: BRAND.textLight, letterSpacing: "0.04em" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id} onClick={() => navigate("client-detail")} style={{ borderBottom: `1px solid ${BRAND.borderLight}`, cursor: "pointer", background: selectedClient === c.id ? "#F0F9FF" : i % 2 === 1 ? "#FAFBFC" : "transparent", transition: "background 0.1s" }}>
                    <td style={{ padding: "12px 16px" }}><div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div><div style={{ fontSize: 11, color: BRAND.textLight, marginTop: 1 }}>{c.business}</div></td>
                    <td style={{ padding: "12px 16px", color: BRAND.textMuted }}>{c.type}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>{c.q}</td>
                    <td style={{ padding: "12px 16px" }}><div>{c.deadline}</div>{c.daysLeft < 0 && <div style={{ fontSize: 11, color: BRAND.red, fontWeight: 600 }}>{Math.abs(c.daysLeft)} days overdue</div>}{c.daysLeft > 0 && <div style={{ fontSize: 11, color: BRAND.textLight }}>{c.daysLeft} days left</div>}</td>
                    <td style={{ padding: "12px 16px" }}><StatusBadge status={c.status} /></td>
                    <td style={{ padding: "12px 16px" }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}>{c.records && <span style={{ width: 6, height: 6, borderRadius: 3, background: BRAND.green, display: "inline-block" }} />}<span style={{ color: c.records ? BRAND.greenText : BRAND.textMuted, fontSize: 12 }}>{c.chase}</span></div></td>
                    <td style={{ padding: "12px 16px", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 500, fontSize: 12, color: c.balance > 0 ? BRAND.text : BRAND.textLight }}>{c.balance > 0 ? `£${c.balance.toLocaleString()}` : "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      {c.status === "overdue" && <button onClick={e => { e.stopPropagation(); navigate("chase"); }} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: BRAND.red, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Chase</button>}
                      {c.status === "due-soon" && c.records && <button onClick={e => { e.stopPropagation(); navigate("quarterly-review"); }} style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: BRAND.primary, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Review</button>}
                      {c.status === "due-soon" && !c.records && <button onClick={e => { e.stopPropagation(); navigate("chase"); }} style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${BRAND.border}`, background: "transparent", color: BRAND.textMuted, fontSize: 11, fontWeight: 500, cursor: "pointer" }}>Chase</button>}
                      {c.status === "pending-invite" && <button style={{ padding: "5px 12px", borderRadius: 6, border: `1px solid ${BRAND.border}`, background: "transparent", color: BRAND.textMuted, fontSize: 11, fontWeight: 500, cursor: "pointer" }}>Resend</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 24, background: BRAND.white, borderRadius: 12, border: `1px solid ${BRAND.border}`, padding: "20px" }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, letterSpacing: "-0.01em" }}>Upcoming deadlines</div>
            <div style={{ display: "flex", gap: 0, position: "relative" }}>
              <div style={{ position: "absolute", top: 18, left: 20, right: 20, height: 2, background: BRAND.borderLight, zIndex: 0 }} />
              {[{ date: "7 Apr", label: "Q4 25-26 due", status: "overdue", note: "2 clients overdue" },{ date: "7 May", label: "Q1 filing window", status: "upcoming", note: "3 clients pending" },{ date: "7 Aug", label: "Q1 26-27 due", status: "future", note: "First >£50k quarter" },{ date: "31 Jan 2027", label: "Final declaration", status: "future", note: "2025-26 tax year" }].map((d, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center", position: "relative", zIndex: 1 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 6, margin: "12px auto", background: d.status === "overdue" ? BRAND.red : d.status === "upcoming" ? BRAND.amber : BRAND.border, border: `2px solid ${BRAND.white}` }} />
                  <div style={{ fontSize: 13, fontWeight: 700, marginTop: 8, color: d.status === "overdue" ? BRAND.red : BRAND.text }}>{d.date}</div>
                  <div style={{ fontSize: 11, color: BRAND.textMuted, marginTop: 2 }}>{d.label}</div>
                  <div style={{ fontSize: 10, color: d.status === "overdue" ? BRAND.red : BRAND.textLight, marginTop: 4, fontWeight: 500 }}>{d.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

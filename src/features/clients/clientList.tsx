'use client'
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

const allClients = [
  { id: 1, name: "Sarah Mitchell", business: "Mitchell Consulting", type: "Self-employment", mtd: "Mandated", deadline: "7 Apr 2026", filing: "overdue", chase: "No response", agentType: "Main", income: 68000, selected: false },
  { id: 2, name: "James Cooper", business: "Cooper Properties", type: "UK Property", mtd: "Mandated", deadline: "7 Apr 2026", filing: "overdue", chase: "Opened email", agentType: "Main", income: 52000, selected: false },
  { id: 3, name: "Priya Sharma", business: "Sharma Design Studio", type: "Self-employment", mtd: "Mandated", deadline: "7 May 2026", filing: "ready", chase: "Records received", agentType: "Main", income: 52000, selected: false },
  { id: 4, name: "Tom Grant", business: "Grant Rentals", type: "UK Property", mtd: "Mandated", deadline: "7 May 2026", filing: "due-soon", chase: "Chased 3 days ago", agentType: "Main", income: 44000, selected: false },
  { id: 5, name: "David Okafor", business: "Okafor Plumbing", type: "Self-employment", mtd: "Mandated", deadline: "—", filing: "filed", chase: "Complete", agentType: "Main", income: 71000, selected: false },
  { id: 6, name: "Rebecca Hall", business: "Hall Interiors", type: "Self-employment", mtd: "Mandated", deadline: "—", filing: "filed", chase: "Complete", agentType: "Main", income: 58000, selected: false },
  { id: 7, name: "Marcus Chen", business: "Chen Photography", type: "Self-employment", mtd: "Voluntary", deadline: "7 May 2026", filing: "due-soon", chase: "Not started", agentType: "Supporting", income: 28000, selected: false },
  { id: 8, name: "Aisha Patel", business: "Patel Tutoring", type: "Self-employment", mtd: "Mandated", deadline: "—", filing: "pending", chase: "Invite sent 12 Apr", agentType: "—", income: 0, selected: false },
  { id: 9, name: "George Whitfield", business: "Whitfield Electricals", type: "Self-employment", mtd: "Mandated", deadline: "7 May 2026", filing: "due-soon", chase: "Chased 7 days ago", agentType: "Main", income: 62000, selected: false },
  { id: 10, name: "Fatima Al-Rashid", business: "Al-Rashid Catering", type: "Self-employment", mtd: "Mandated", deadline: "—", filing: "filed", chase: "Complete", agentType: "Main", income: 89000, selected: false },
  { id: 11, name: "Oliver Stone", business: "Stone Lettings", type: "UK Property", mtd: "Voluntary", deadline: "7 May 2026", filing: "due-soon", chase: "Not started", agentType: "Main", income: 31000, selected: false },
  { id: 12, name: "Nina Kowalski", business: "Kowalski Translations", type: "Self-employment", mtd: "Mandated", deadline: "—", filing: "filed", chase: "Complete", agentType: "Main", income: 54000, selected: false },
];

const Badge = ({ status }) => {
  const m = {
    overdue: { bg: B.redBg, c: B.redText, b: "#FECACA", l: "Overdue" },
    "due-soon": { bg: B.amberBg, c: B.amberText, b: "#FDE68A", l: "Due soon" },
    ready: { bg: B.greenBg, c: B.greenText, b: "#A7F3D0", l: "Records ready" },
    filed: { bg: B.greenBg, c: B.greenText, b: "#A7F3D0", l: "Filed" },
    pending: { bg: B.purpleBg, c: B.purpleText, b: "#DDD6FE", l: "Pending invite" },
  };
  const s = m[status] || m.filed;
  return <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: s.bg, color: s.c, border: `1px solid ${s.b}`, whiteSpace: "nowrap" }}>{s.l}</span>;
};


export default function ClientList({ navigate = () => {} }: { navigate?: (route: string) => void }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortCol, setSortCol] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [selected, setSelected] = useState(new Set());

  let filtered = allClients.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.business.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    if (statusFilter !== "all" && c.filing !== statusFilter) return false;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    let va = (a as Record<string, unknown>)[sortCol], vb = (b as Record<string, unknown>)[sortCol];
    if (typeof va === "string") { va = va.toLowerCase(); vb = vb.toLowerCase(); }
    if (va < vb) return sortDir === "asc" ? -1 : 1;
    if (va > vb) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const toggleSelect = (id) => setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(c => c.id)));

  const SortIcon = ({ col }) => (
    <span style={{ fontSize: 10, marginLeft: 4, opacity: sortCol === col ? 1 : 0.3 }}>{sortCol === col && sortDir === "desc" ? "▼" : "▲"}</span>
  );

  return (
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 32px", background: B.white, borderBottom: `1px solid ${B.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Clients</div>
            <div style={{ fontSize: 13, color: B.muted, marginTop: 2 }}>{allClients.length} clients — {allClients.filter(c => c.filing !== "pending").length} authorised, {allClients.filter(c => c.filing === "pending").length} pending</div>
          </div>
          <button onClick={() => navigate("add-client")} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: B.primary, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <span>+</span> Add client
          </button>
        </div>

        <div style={{ padding: "20px 32px", flex: 1 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 320 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients or businesses..." style={{ width: "100%", padding: "8px 14px 8px 36px", borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, outline: "none", background: B.white, color: B.text }} />
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: B.light }}>⌕</span>
            </div>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 12, color: B.text, background: B.white, cursor: "pointer" }}>
              <option value="all">All types</option>
              <option value="Self-employment">Self-employment</option>
              <option value="UK Property">UK Property</option>
            </select>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 12, color: B.text, background: B.white, cursor: "pointer" }}>
              <option value="all">All statuses</option>
              <option value="overdue">Overdue</option>
              <option value="due-soon">Due soon</option>
              <option value="ready">Records ready</option>
              <option value="filed">Filed</option>
              <option value="pending">Pending invite</option>
            </select>
            {selected.size > 0 && (
              <div style={{ display: "flex", gap: 8, marginLeft: "auto", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: B.muted, fontWeight: 500 }}>{selected.size} selected</span>
                <button style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: B.navy, color: "#fff", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Chase selected</button>
                <button onClick={() => setSelected(new Set())} style={{ padding: "6px 10px", borderRadius: 6, border: `1px solid ${B.border}`, background: "transparent", fontSize: 11, cursor: "pointer", color: B.muted }}>Clear</button>
              </div>
            )}
          </div>

          <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${B.border}` }}>
                  <th style={{ padding: "10px 16px", width: 36 }}>
                    <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleAll} style={{ cursor: "pointer", accentColor: B.primary }} />
                  </th>
                  {[
                    { key: "name", label: "Client" },
                    { key: "type", label: "Business type" },
                    { key: "mtd", label: "MTD status" },
                    { key: "deadline", label: "Next deadline" },
                    { key: "filing", label: "Filing status" },
                    { key: "chase", label: "Chase status" },
                    { key: "income", label: "YTD income" },
                  ].map(col => (
                    <th key={col.key} onClick={() => toggleSort(col.key)} style={{ padding: "10px 14px", textAlign: col.key === "income" ? "right" : "left", fontSize: 11, fontWeight: 600, color: B.light, letterSpacing: "0.04em", cursor: "pointer", userSelect: "none" }}>
                      {col.label}<SortIcon col={col.key} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id} onClick={() => navigate("client-detail")} style={{ borderBottom: `1px solid ${B.borderLight}`, background: selected.has(c.id) ? "#F0F9FF" : i % 2 === 1 ? "#FAFBFC" : "transparent", cursor: "pointer", transition: "background 0.1s" }}>
                    <td style={{ padding: "10px 16px" }}>
                      <input type="checkbox" checked={selected.has(c.id)} onChange={e => { e.stopPropagation(); toggleSelect(c.id); }} style={{ cursor: "pointer", accentColor: B.primary }} />
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: B.light, marginTop: 1 }}>{c.business}</div>
                    </td>
                    <td style={{ padding: "10px 14px", color: B.muted, fontSize: 12 }}>{c.type}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 20, background: c.mtd === "Mandated" ? B.greenBg : B.blueBg, color: c.mtd === "Mandated" ? B.greenText : B.blueText, border: `1px solid ${c.mtd === "Mandated" ? "#A7F3D0" : "#BAE6FD"}` }}>{c.mtd}</span>
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 12 }}>{c.deadline}</td>
                    <td style={{ padding: "10px 14px" }}><Badge status={c.filing} /></td>
                    <td style={{ padding: "10px 14px", fontSize: 12, color: B.muted }}>{c.chase}</td>
                    <td style={{ padding: "10px 14px", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 500, fontSize: 12 }}>{c.income > 0 ? `£${c.income.toLocaleString()}` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: "12px 20px", borderTop: `1px solid ${B.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: B.muted }}>
              <span>Showing {filtered.length} of {allClients.length} clients</span>
              <span>Total YTD income: <b style={{ color: B.text }}>£{filtered.reduce((s, c) => s + c.income, 0).toLocaleString()}</b></span>
            </div>
          </div>
        </div>
      </div>
  );
}

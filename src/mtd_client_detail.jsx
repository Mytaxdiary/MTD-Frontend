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

const quarters = [
  { q: "Q1", period: "6 Apr – 5 Jul 2025", due: "7 Aug 2025", status: "filed", filed: "2 Aug 2025", income: 12400, expenses: 3200 },
  { q: "Q2", period: "6 Jul – 5 Oct 2025", due: "7 Nov 2025", status: "filed", filed: "1 Nov 2025", income: 14800, expenses: 4100 },
  { q: "Q3", period: "6 Oct – 5 Jan 2026", due: "7 Feb 2026", status: "filed", filed: "5 Feb 2026", income: 11200, expenses: 3800 },
  { q: "Q4", period: "6 Jan – 5 Apr 2026", due: "7 May 2026", status: "ready", filed: null, income: 13600, expenses: 4400 },
];

const liabilities = [
  { desc: "1st payment on account 2025-26", due: "31 Jan 2026", original: 3620, outstanding: 0, interest: 0, status: "paid" },
  { desc: "2nd payment on account 2025-26", due: "31 Jul 2026", original: 3620, outstanding: 3620, interest: 0, status: "upcoming" },
  { desc: "Balancing payment 2024-25", due: "31 Jan 2026", original: 1240, outstanding: 0, interest: 0, status: "paid" },
];

const paymentHistory = [
  { date: "28 Jan 2026", amount: 4860, ref: "1234567890 — POA1 + balancing", method: "Bank transfer" },
  { date: "30 Jan 2025", amount: 3200, ref: "1234567890 — POA1 2024-25", method: "Bank transfer" },
];

const chaseLog = [
  { date: "14 Apr 2026", type: "email", msg: "Quarterly records reminder sent", status: "Opened" },
  { date: "10 Apr 2026", type: "email", msg: "Q4 deadline approaching — records needed", status: "Opened" },
  { date: "2 Feb 2026", type: "email", msg: "Q3 records reminder sent", status: "Responded" },
  { date: "28 Jan 2026", type: "email", msg: "Q3 deadline approaching", status: "Responded" },
];

const expenses = [
  { cat: "Premises running costs", amount: 1200 },
  { cat: "Travel costs", amount: 680 },
  { cat: "Admin & office costs", amount: 540 },
  { cat: "Advertising costs", amount: 320 },
  { cat: "Professional fees", amount: 450 },
  { cat: "Interest & bank charges", amount: 180 },
  { cat: "Other allowable expenses", amount: 1030 },
];

const NavItem = ({ label, active, icon, count, onClick }) => (
  <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 8, cursor: "pointer", background: active ? "rgba(14,165,201,0.12)" : "transparent", color: active ? B.primary : "rgba(255,255,255,0.65)", fontSize: 13, fontWeight: active ? 600 : 400, marginBottom: 2 }}>
    <span style={{ fontSize: 15, opacity: active ? 1 : 0.6 }}>{icon}</span>
    <span style={{ flex: 1 }}>{label}</span>
    {count > 0 && <span style={{ fontSize: 10, fontWeight: 700, background: B.red, color: "#fff", borderRadius: 10, padding: "1px 7px" }}>{count}</span>}
  </div>
);

const Card = ({ children, style }) => <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, overflow: "hidden", ...style }}>{children}</div>;
const CardHeader = ({ title, right }) => (
  <div style={{ padding: "14px 20px", borderBottom: `1px solid ${B.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em" }}>{title}</div>
    {right}
  </div>
);

export default function ClientDetail({ navigate = () => {} }) {
  const [activeTab, setActiveTab] = useState("overview");
  const totalIncome = quarters.reduce((s, q) => s + q.income, 0);
  const totalExpenses = quarters.reduce((s, q) => s + q.expenses, 0);
  const totalExpQ4 = expenses.reduce((s, e) => s + e.amount, 0);
  const totalOutstanding = liabilities.reduce((s, l) => s + l.outstanding, 0);

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
          <NavItem label="Clients" active icon="⊡" onClick={() => navigate("clients")} />
          <NavItem label="Chase manager" icon="↗" count={2} onClick={() => navigate("chase")} />
          <NavItem label="Filing status" icon="◎" onClick={() => navigate("dashboard")} />
          <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", padding: "0 14px", marginTop: 24, marginBottom: 8 }}>MANAGE</div>
          <NavItem label="Add client" icon="+" onClick={() => navigate("add-client")} />
          <NavItem label="Settings" icon="⚙" onClick={() => navigate("settings")} />
          <NavItem label="HMRC connection" icon="⟷" onClick={() => navigate("settings")} />
        </div>
        <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 32, height: 32, borderRadius: 20, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>JW</div><div><div style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>Jane Walker</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Walker & Co</div></div></div></div>
      </div>

      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "12px 32px", background: B.white, borderBottom: `1px solid ${B.border}`, display: "flex", alignItems: "center", gap: 8, fontSize: 13, flexShrink: 0 }}>
          <span style={{ color: B.primary, cursor: "pointer", fontWeight: 500 }} onClick={() => navigate("clients")}>Clients</span><span style={{ color: B.xlight }}>/</span><span style={{ fontWeight: 600 }}>Priya Sharma</span>
        </div>

        <div style={{ padding: "24px 32px 20px", background: B.white, borderBottom: `1px solid ${B.border}`, flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #E0F2FE, #BAE6FD)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: B.blueText }}>PS</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>Priya Sharma</div>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 4, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, color: B.muted }}>Sharma Design Studio</span>
                  <span style={{ width: 4, height: 4, borderRadius: 2, background: B.xlight }} />
                  <span style={{ fontSize: 12, color: B.muted }}>Self-employment</span>
                  <span style={{ width: 4, height: 4, borderRadius: 2, background: B.xlight }} />
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20, background: B.greenBg, color: B.greenText, border: "1px solid #A7F3D0" }}>MTD Mandated</span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20, background: B.blueBg, color: B.blueText, border: "1px solid #BAE6FD" }}>Main agent</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${B.border}`, background: B.white, fontSize: 12, fontWeight: 500, cursor: "pointer", color: B.text }}>Send notification</button>
              <button style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${B.border}`, background: B.white, fontSize: 12, fontWeight: 500, cursor: "pointer", color: B.text }}>Tax calculation</button>
              <button onClick={() => navigate("quarterly-review")} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: B.primary, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Review Q4 update</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 0, marginTop: 20 }}>
            {["overview", "liabilities", "records", "chasing", "notes"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "8px 20px", fontSize: 13, fontWeight: 500, cursor: "pointer", border: "none", background: "transparent", color: activeTab === tab ? B.primary : B.muted, borderBottom: `2px solid ${activeTab === tab ? B.primary : "transparent"}`, textTransform: "capitalize" }}>{tab}</button>
            ))}
          </div>
        </div>

        <div style={{ padding: "24px 32px", flex: 1 }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            {[
              { label: "YTD Income", value: `£${totalIncome.toLocaleString()}`, sub: "4 quarters", color: B.green },
              { label: "YTD Expenses", value: `£${totalExpenses.toLocaleString()}`, sub: "Itemised", color: B.amber },
              { label: "Net profit", value: `£${(totalIncome - totalExpenses).toLocaleString()}`, sub: "Before tax", color: B.primary },
              { label: "Est. tax due", value: "£7,240", sub: "Disclaimer applies", color: B.navy },
              { label: "Outstanding to HMRC", value: `£${totalOutstanding.toLocaleString()}`, sub: totalOutstanding > 0 ? "Payment due" : "All clear", color: totalOutstanding > 0 ? B.red : B.green },
            ].map((m, i) => (
              <div key={i} style={{ flex: 1, background: B.white, borderRadius: 10, padding: "14px 16px", border: `1px solid ${B.border}`, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: m.color }} />
                <div style={{ fontSize: 11, fontWeight: 500, color: B.muted, letterSpacing: "0.02em" }}>{m.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginTop: 3 }}>{m.value}</div>
                <div style={{ fontSize: 11, color: B.light, marginTop: 2 }}>{m.sub}</div>
              </div>
            ))}
          </div>

          {activeTab === "overview" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Card><CardHeader title="Obligation timeline — 2025-26" />
                  <div style={{ padding: "16px 20px" }}>
                    {quarters.map((q, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "stretch" }}>
                        <div style={{ width: 32, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                          <div style={{ width: 12, height: 12, borderRadius: 6, flexShrink: 0, background: q.status === "filed" ? B.green : B.amber, border: `2px solid ${B.white}`, boxShadow: `0 0 0 2px ${q.status === "filed" ? "#A7F3D0" : "#FDE68A"}` }} />
                          {i < quarters.length - 1 && <div style={{ width: 2, flex: 1, background: B.borderLight, minHeight: 40 }} />}
                        </div>
                        <div style={{ flex: 1, paddingBottom: 20, paddingLeft: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div><span style={{ fontSize: 14, fontWeight: 700 }}>{q.q}</span><span style={{ fontSize: 12, color: B.muted, marginLeft: 10 }}>{q.period}</span></div>
                            {q.status === "filed" && <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20, background: B.greenBg, color: B.greenText, border: "1px solid #A7F3D0" }}>Filed {q.filed}</span>}
                            {q.status === "ready" && <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20, background: B.amberBg, color: B.amberText, border: "1px solid #FDE68A" }}>Records ready</span>}
                          </div>
                          <div style={{ display: "flex", gap: 24, marginTop: 8, fontSize: 12, color: B.muted }}>
                            <span>Due: <b style={{ color: B.text }}>{q.due}</b></span><span>Income: <b style={{ color: B.text }}>£{q.income.toLocaleString()}</b></span><span>Expenses: <b style={{ color: B.text }}>£{q.expenses.toLocaleString()}</b></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card><CardHeader title="Q4 expense breakdown" right={<span style={{ fontSize: 12, color: B.muted }}>£{totalExpQ4.toLocaleString()} total</span>} />
                  <div style={{ padding: "4px 20px 12px" }}>
                    {expenses.map((e, i) => (<div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: i < expenses.length - 1 ? `1px solid ${B.borderLight}` : "none" }}><span style={{ fontSize: 13 }}>{e.cat}</span><span style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>£{e.amount.toLocaleString()}</span></div>))}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 4px", borderTop: `2px solid ${B.border}`, marginTop: 4 }}><span style={{ fontSize: 13, fontWeight: 700 }}>Total expenses</span><span style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>£{totalExpQ4.toLocaleString()}</span></div>
                  </div>
                </Card>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Card><CardHeader title="Client details" />
                  <div style={{ padding: "12px 20px" }}>
                    {[["NINO","QQ 12 34 56 C"],["UTR","12345 67890"],["Business ID","XAIS12345678901"],["Trading name","Sharma Design Studio"],["Quarterly type","Standard"],["Accounting period","6 Apr – 5 Apr"],["Agent type","Main agent"],["Authorised since","15 Mar 2025"]].map(([k,v],i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 7 ? `1px solid ${B.borderLight}` : "none" }}><span style={{ fontSize: 12, color: B.muted }}>{k}</span><span style={{ fontSize: 12, fontWeight: 500, fontFamily: ["NINO","UTR","Business ID"].includes(k) ? "monospace" : "inherit" }}>{v}</span></div>
                    ))}
                  </div>
                </Card>
                <Card><CardHeader title="HMRC payment details" />
                  <div style={{ padding: "12px 20px" }}>
                    <div style={{ padding: "14px", background: B.blueBg, borderRadius: 8, border: "1px solid #BAE6FD", marginBottom: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: B.blueText, marginBottom: 8 }}>Pay by bank transfer</div>
                      {[["Sort code","08-32-10"],["Account number","12001039"],["Reference","12345 67890"]].map(([k,v],i)=>(<div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><span style={{ fontSize: 12, color: "#0369A1" }}>{k}</span><span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: B.blueText }}>{v}</span></div>))}
                    </div>
                    <div style={{ fontSize: 10, color: B.light, lineHeight: 1.5 }}>Reference is the client's UTR. Client can also pay at gov.uk/pay-self-assessment-tax-bill.</div>
                  </div>
                </Card>
                <Card><CardHeader title="Chase history" right={<button style={{ fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 6, border: `1px solid ${B.border}`, background: "transparent", cursor: "pointer", color: B.muted }}>Send chase</button>} />
                  <div style={{ padding: "4px 20px 12px" }}>
                    {chaseLog.map((c, i) => (<div key={i} style={{ padding: "10px 0", borderBottom: i < chaseLog.length - 1 ? `1px solid ${B.borderLight}` : "none" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 20, height: 20, borderRadius: 4, background: B.blueBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: B.blueText }}>@</span><span style={{ fontSize: 12, fontWeight: 500 }}>{c.msg}</span></div><span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 10, background: c.status === "Responded" ? B.greenBg : B.amberBg, color: c.status === "Responded" ? B.greenText : B.amberText }}>{c.status}</span></div><div style={{ fontSize: 11, color: B.light, marginTop: 3, paddingLeft: 28 }}>{c.date}</div></div>))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "liabilities" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Card><CardHeader title="HMRC liabilities" right={<span style={{ fontSize: 12, color: B.muted }}>Source: SA Accounts API</span>} />
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}><thead><tr style={{ borderBottom: `1px solid ${B.border}` }}>{["Description","Due date","Original","Outstanding","Interest","Status"].map((h,i)=>(<th key={i} style={{ padding: "10px 16px", textAlign: i>=2&&i<=4?"right":"left", fontSize: 11, fontWeight: 600, color: B.light, letterSpacing: "0.04em" }}>{h}</th>))}</tr></thead>
                    <tbody>{liabilities.map((l,i)=>(<tr key={i} style={{ borderBottom: `1px solid ${B.borderLight}`, background: i%2===1?"#FAFBFC":"transparent" }}><td style={{ padding: "12px 16px", fontWeight: 500 }}>{l.desc}</td><td style={{ padding: "12px 16px", color: B.muted }}>{l.due}</td><td style={{ padding: "12px 16px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>£{l.original.toLocaleString()}</td><td style={{ padding: "12px 16px", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 600, color: l.outstanding>0?B.text:B.light }}>{l.outstanding>0?`£${l.outstanding.toLocaleString()}`:"—"}</td><td style={{ padding: "12px 16px", textAlign: "right", fontVariantNumeric: "tabular-nums", color: l.interest>0?B.redText:B.light }}>{l.interest>0?`£${l.interest.toFixed(2)}`:"—"}</td><td style={{ padding: "12px 16px" }}><span style={{ fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20, background: l.status==="paid"?B.greenBg:l.status==="overdue"?B.redBg:B.amberBg, color: l.status==="paid"?B.greenText:l.status==="overdue"?B.redText:B.amberText, border: `1px solid ${l.status==="paid"?"#A7F3D0":l.status==="overdue"?"#FECACA":"#FDE68A"}` }}>{l.status==="paid"?"Paid":l.status==="overdue"?"Overdue":"Upcoming"}</span></td></tr>))}</tbody>
                    <tfoot><tr style={{ background: B.surface, borderTop: `2px solid ${B.border}` }}><td colSpan={3} style={{ padding: "12px 16px", fontWeight: 700 }}>Total outstanding</td><td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 700, fontSize: 15, fontVariantNumeric: "tabular-nums" }}>£{totalOutstanding.toLocaleString()}</td><td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: B.light }}>£0.00</td><td/></tr></tfoot>
                  </table>
                </Card>
                <Card><CardHeader title="Payment history" />
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}><thead><tr style={{ borderBottom: `1px solid ${B.border}` }}>{["Date","Amount","Reference","Method"].map((h,i)=>(<th key={i} style={{ padding: "10px 16px", textAlign: i===1?"right":"left", fontSize: 11, fontWeight: 600, color: B.light }}>{h}</th>))}</tr></thead>
                    <tbody>{paymentHistory.map((p,i)=>(<tr key={i} style={{ borderBottom: `1px solid ${B.borderLight}` }}><td style={{ padding: "12px 16px" }}>{p.date}</td><td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, fontVariantNumeric: "tabular-nums", color: B.greenText }}>£{p.amount.toLocaleString()}</td><td style={{ padding: "12px 16px", fontFamily: "monospace", fontSize: 11, color: B.muted }}>{p.ref}</td><td style={{ padding: "12px 16px", color: B.muted }}>{p.method}</td></tr>))}</tbody>
                  </table>
                </Card>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <Card><CardHeader title="HMRC payment details" /><div style={{ padding: "12px 20px" }}><div style={{ padding: "14px", background: B.blueBg, borderRadius: 8, border: "1px solid #BAE6FD", marginBottom: 12 }}><div style={{ fontSize: 11, fontWeight: 600, color: B.blueText, marginBottom: 8 }}>Pay by bank transfer</div>{[["Sort code","08-32-10"],["Account number","12001039"],["Reference","12345 67890"]].map(([k,v],i)=>(<div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}><span style={{ fontSize: 12, color: "#0369A1" }}>{k}</span><span style={{ fontSize: 13, fontWeight: 700, fontFamily: "monospace", color: B.blueText }}>{v}</span></div>))}</div><div style={{ fontSize: 10, color: B.light, lineHeight: 1.5 }}>Reference is the client's UTR. Client can also pay at gov.uk/pay-self-assessment-tax-bill.</div></div></Card>
                <Card><CardHeader title="Send to client portal" /><div style={{ padding: "14px 20px" }}><div style={{ fontSize: 12, color: B.muted, lineHeight: 1.6, marginBottom: 12 }}>Send a notification to the client's portal with their current liability summary and payment details.</div><button style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: B.primary, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Send liability notification</button></div></Card>
                <Card><CardHeader title="Accountant notes" /><div style={{ padding: "12px 20px" }}><div style={{ padding: 12, background: B.surface, borderRadius: 8, fontSize: 12, color: B.muted, lineHeight: 1.6, border: `1px solid ${B.borderLight}` }}>Client responsive but sometimes slow on receipts. Prefers email over SMS. Business growing — may exceed £90k threshold next year. 2nd POA due 31 Jul — remind client.</div><div style={{ fontSize: 10, color: B.light, marginTop: 6 }}>Last edited 14 Apr 2026 by Jane Walker</div></div></Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

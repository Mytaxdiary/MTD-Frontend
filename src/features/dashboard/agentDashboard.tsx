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
};

const clients = [
  { id:1, name:"Sarah Mitchell", business:"Mitchell Consulting", type:"SE", status:"overdue", stage:"chased", q:"Q4", deadline:"7 Apr 2026", daysLeft:-17, chase:"No response", records:false, balance:2400, q1:"filed", q2:"filed", q3:"filed", q4:"overdue" },
  { id:2, name:"James Cooper", business:"Cooper Properties", type:"Prop", status:"overdue", stage:"chased", q:"Q4", deadline:"7 Apr 2026", daysLeft:-17, chase:"Opened email", records:false, balance:0, q1:"filed", q2:"filed", q3:"filed", q4:"overdue" },
  { id:3, name:"Priya Sharma", business:"Sharma Design Studio", type:"SE", status:"due-soon", stage:"received", q:"Q4", deadline:"7 May 2026", daysLeft:13, chase:"Records received", records:true, balance:3620, q1:"filed", q2:"filed", q3:"filed", q4:"ready" },
  { id:4, name:"Tom Grant", business:"Grant Rentals", type:"Prop", status:"due-soon", stage:"chased", q:"Q4", deadline:"7 May 2026", daysLeft:13, chase:"Chased 3d ago", records:false, balance:1800, q1:"filed", q2:"filed", q3:"filed", q4:"pending" },
  { id:5, name:"David Okafor", business:"Okafor Plumbing", type:"SE", status:"filed", stage:"submitted", q:"Q4", deadline:"—", daysLeft:0, chase:"Complete", records:true, balance:0, q1:"filed", q2:"filed", q3:"filed", q4:"filed" },
  { id:6, name:"Rebecca Hall", business:"Hall Interiors", type:"SE", status:"filed", stage:"submitted", q:"Q4", deadline:"—", daysLeft:0, chase:"Complete", records:true, balance:0, q1:"filed", q2:"filed", q3:"filed", q4:"filed" },
  { id:7, name:"Marcus Chen", business:"Chen Photography", type:"SE", status:"due-soon", stage:"not-started", q:"Q4", deadline:"7 May 2026", daysLeft:13, chase:"Not started", records:false, balance:950, q1:"filed", q2:"filed", q3:"filed", q4:"pending" },
  { id:8, name:"George Whitfield", business:"Whitfield Electricals", type:"SE", status:"due-soon", stage:"chased", q:"Q4", deadline:"7 May 2026", daysLeft:13, chase:"Chased 7d ago", records:false, balance:0, q1:"filed", q2:"filed", q3:"overdue", q4:"pending" },
  { id:9, name:"Fatima Al-Rashid", business:"Al-Rashid Catering", type:"SE", status:"filed", stage:"submitted", q:"Q4", deadline:"—", daysLeft:0, chase:"Complete", records:true, balance:0, q1:"filed", q2:"filed", q3:"filed", q4:"filed" },
  { id:10, name:"Oliver Stone", business:"Stone Lettings", type:"Prop", status:"due-soon", stage:"not-started", q:"Q4", deadline:"7 May 2026", daysLeft:13, chase:"Not started", records:false, balance:0, q1:"filed", q2:"filed", q3:"filed", q4:"pending" },
  { id:11, name:"Aisha Patel", business:"Patel Tutoring", type:"SE", status:"pending-invite", stage:"not-started", q:"—", deadline:"—", daysLeft:0, chase:"Invite sent", records:false, balance:0, q1:"—", q2:"—", q3:"—", q4:"—" },
];

const kanbanCols = [
  { key: "not-started", label: "Not started", color: B.light, bg: "#F8FAFC" },
  { key: "chased", label: "Chased", color: B.amber, bg: "#FFFDF7" },
  { key: "received", label: "Records received", color: B.primary, bg: "#F0FAFE" },
  { key: "submitted", label: "Submitted", color: B.green, bg: "#F0FDF8" },
];

const QDot = ({ status }: { status: string }) => {
  const colors: Record<string, string> = { filed: B.green, ready: B.primary, pending: B.light, overdue: B.red, "—": "#E2E8F0" };
  return <div style={{ width: 10, height: 10, borderRadius: 5, background: colors[status] || B.light, border: status === "overdue" ? "1.5px solid #FECACA" : "none" }} title={status} />;
};

const Badge = ({ status }: { status: string }) => {
  const m: Record<string, { bg: string; c: string; b: string; l: string }> = {
    overdue:{bg:B.redBg,c:B.redText,b:"#FECACA",l:"Overdue"},
    "due-soon":{bg:B.amberBg,c:B.amberText,b:"#FDE68A",l:"Due soon"},
    filed:{bg:B.greenBg,c:B.greenText,b:"#A7F3D0",l:"Filed"},
    "pending-invite":{bg:B.purpleBg,c:B.purpleText,b:"#DDD6FE",l:"Pending"},
  };
  const s = m[status] || m.filed;
  return <span style={{ fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, background:s.bg, color:s.c, border:`1px solid ${s.b}`, whiteSpace:"nowrap" }}>{s.l}</span>;
};

const MetricCard = ({ label, value, sub, color, icon, active, onClick }: {
  label: string; value: number | string; sub: string; color: string;
  icon: React.ReactNode; active: boolean; onClick: () => void;
}) => (
  <div onClick={onClick} style={{ flex:1, background:B.white, borderRadius:12, padding:"16px 18px", border:`1.5px solid ${active ? color : B.border}`, position:"relative", overflow:"hidden", cursor:"pointer", transition:"all 0.15s" }}>
    <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:color }} />
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <div>
        <div style={{ fontSize:11, fontWeight:500, color:B.muted, letterSpacing:"0.02em", marginBottom:3 }}>{label}</div>
        <div style={{ fontSize:26, fontWeight:700, color:B.text, lineHeight:1, letterSpacing:"-0.02em" }}>{value}</div>
        <div style={{ fontSize:11, color:B.light, marginTop:3 }}>{sub}</div>
      </div>
      <div style={{ width:32, height:32, borderRadius:8, background:`${color}14`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>{icon}</div>
    </div>
  </div>
);

export default function Dashboard({ navigate = () => {} }: { navigate?: (route: string) => void }) {
  const [view, setView] = useState("list");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [activeMetric, setActiveMetric] = useState<string | null>(null);

  const handleMetricClick = (filterKey: string) => {
    if (activeMetric === filterKey) { setActiveMetric(null); setStatusFilter("all"); }
    else { setActiveMetric(filterKey); setStatusFilter(filterKey); }
  };

  let filtered = clients.filter(c => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    return true;
  });

  const overdueCount = clients.filter(c => c.status === "overdue").length;
  const dueSoonCount = clients.filter(c => c.status === "due-soon").length;
  const recordsReady = clients.filter(c => c.records && c.status !== "filed").length;
  const pendingInvites = clients.filter(c => c.status === "pending-invite").length;

  return (
    <div style={{ flex:1, overflow:"auto", display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"16px 32px", background:B.white, borderBottom:`1px solid ${B.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
        <div>
          <div style={{ fontSize:20, fontWeight:700, letterSpacing:"-0.02em" }}>Good morning, Jane</div>
          <div style={{ fontSize:13, color:B.muted, marginTop:2 }}>Thursday 24 April 2026 — Tax year 2025-26, Q4</div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button style={{ padding:"8px 16px", borderRadius:8, border:`1px solid ${B.border}`, background:B.white, fontSize:13, fontWeight:500, cursor:"pointer", color:B.text }}>+ Add client</button>
          <button style={{ padding:"8px 16px", borderRadius:8, border:"none", background:B.primary, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>↗ Chase all overdue</button>
        </div>
      </div>

      <div style={{ padding:"24px 32px", flex:1 }}>
        {/* Metric cards — clickable */}
        <div style={{ display:"flex", gap:12, marginBottom:24 }}>
          <MetricCard label="OVERDUE" value={overdueCount} sub="Past deadline — act now" color={B.red} icon={<span style={{ color:B.red }}>!</span>} active={activeMetric==="overdue"} onClick={()=>handleMetricClick("overdue")} />
          <MetricCard label="DUE WITHIN 30 DAYS" value={dueSoonCount} sub="Chase window open" color={B.amber} icon={<span style={{ color:B.amber }}>◷</span>} active={activeMetric==="due-soon"} onClick={()=>handleMetricClick("due-soon")} />
          <MetricCard label="RECORDS READY" value={recordsReady} sub="Ready for review" color={B.green} icon={<span style={{ color:B.green }}>✓</span>} active={activeMetric==="records"} onClick={()=>handleMetricClick("records")} />
          <MetricCard label="PENDING INVITES" value={pendingInvites} sub="Awaiting acceptance" color={B.purple} icon={<span style={{ color:B.purple }}>⟳</span>} active={activeMetric==="pending-invite"} onClick={()=>handleMetricClick("pending-invite")} />
        </div>

        {/* Controls bar */}
        <div style={{ background:B.white, borderRadius:"12px 12px 0 0", border:`1px solid ${B.border}`, borderBottom:"none", padding:"12px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);setActiveMetric(null)}} style={{ padding:"6px 10px", borderRadius:6, border:`1px solid ${B.border}`, fontSize:12, color:B.text, background:B.white, cursor:"pointer" }}>
              <option value="all">All statuses</option>
              <option value="overdue">Overdue</option>
              <option value="due-soon">Due soon</option>
              <option value="filed">Filed</option>
              <option value="pending-invite">Pending invite</option>
            </select>
            <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} style={{ padding:"6px 10px", borderRadius:6, border:`1px solid ${B.border}`, fontSize:12, color:B.text, background:B.white, cursor:"pointer" }}>
              <option value="all">All types</option>
              <option value="SE">Self-employment</option>
              <option value="Prop">UK Property</option>
            </select>
            <span style={{ fontSize:12, color:B.light, marginLeft:4 }}>{filtered.length} of {clients.length}</span>
          </div>
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            <button style={{ padding:"6px 10px", borderRadius:6, border:`1px solid ${B.border}`, fontSize:11, cursor:"pointer", background:B.white, color:B.muted }}>Export</button>
            <div style={{ display:"flex", gap:0, marginLeft:8 }}>
              {[{k:"list",l:"☰"},{k:"kanban",l:"▥"},{k:"year",l:"▦"}].map(v=>(
                <button key={v.k} onClick={()=>setView(v.k)} style={{ padding:"6px 10px", border:`1px solid ${B.border}`, fontSize:13, cursor:"pointer", background:view===v.k?B.navy:"transparent", color:view===v.k?"#fff":B.muted, borderRadius:v.k==="list"?"6px 0 0 6px":v.k==="year"?"0 6px 6px 0":"0", marginLeft:v.k!=="list"?"-1px":"0" }} title={v.k==="list"?"List view":v.k==="kanban"?"Kanban view":"Year view"}>{v.l}</button>
              ))}
            </div>
          </div>
        </div>

        {/* LIST VIEW */}
        {view === "list" && (
          <div style={{ background:B.white, borderRadius:"0 0 12px 12px", border:`1px solid ${B.border}`, overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead><tr style={{ borderBottom:`1px solid ${B.border}` }}>
                {["Client","Type","Quarter","Deadline","Status","Chase status",""].map((h,i)=>(
                  <th key={i} style={{ padding:"10px 16px", textAlign:"left", fontSize:11, fontWeight:600, color:B.light, letterSpacing:"0.04em" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.map((c,i)=>(
                  <tr key={c.id} style={{ borderBottom:`1px solid ${B.borderLight}`, cursor:"pointer", background:i%2===1?"#FAFBFC":"transparent" }}>
                    <td style={{ padding:"12px 16px" }}><div style={{ fontWeight:600 }}>{c.name}</div><div style={{ fontSize:11, color:B.light, marginTop:1 }}>{c.business}</div></td>
                    <td style={{ padding:"12px 16px", color:B.muted, fontSize:12 }}>{c.type === "SE" ? "Self-employment" : "UK Property"}</td>
                    <td style={{ padding:"12px 16px", fontWeight:600 }}>{c.q}</td>
                    <td style={{ padding:"12px 16px" }}><div>{c.deadline}</div>{c.daysLeft<0 && <div style={{ fontSize:11, color:B.red, fontWeight:600 }}>{Math.abs(c.daysLeft)}d overdue</div>}{c.daysLeft>0 && <div style={{ fontSize:11, color:B.light }}>{c.daysLeft}d left</div>}</td>
                    <td style={{ padding:"12px 16px" }}><Badge status={c.status} /></td>
                    <td style={{ padding:"12px 16px" }}><div style={{ display:"flex", alignItems:"center", gap:6 }}>{c.records && <span style={{ width:6, height:6, borderRadius:3, background:B.green }} />}<span style={{ color:c.records?B.greenText:B.muted, fontSize:12 }}>{c.chase}</span></div></td>
                    <td style={{ padding:"12px 16px" }}>
                      {c.status==="overdue" && <button style={{ padding:"5px 12px", borderRadius:6, border:"none", background:B.red, color:"#fff", fontSize:11, fontWeight:600, cursor:"pointer" }}>Chase</button>}
                      {c.status==="due-soon" && c.records && <button style={{ padding:"5px 12px", borderRadius:6, border:"none", background:B.primary, color:"#fff", fontSize:11, fontWeight:600, cursor:"pointer" }}>View</button>}
                      {c.status==="due-soon" && !c.records && <button style={{ padding:"5px 12px", borderRadius:6, border:`1px solid ${B.border}`, background:"transparent", color:B.muted, fontSize:11, cursor:"pointer" }}>Chase</button>}
                      {c.status==="pending-invite" && <button style={{ padding:"5px 12px", borderRadius:6, border:`1px solid ${B.border}`, background:"transparent", color:B.muted, fontSize:11, cursor:"pointer" }}>Resend</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* KANBAN VIEW */}
        {view === "kanban" && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:12, background:B.white, borderRadius:"0 0 12px 12px", border:`1px solid ${B.border}`, padding:16 }}>
            {kanbanCols.map(col => {
              const colClients = filtered.filter(c => c.stage === col.key);
              return (
                <div key={col.key} style={{ background:col.bg, borderRadius:10, padding:10, minHeight:300 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, padding:"0 4px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ width:8, height:8, borderRadius:4, background:col.color }} />
                      <span style={{ fontSize:12, fontWeight:600, color:B.text }}>{col.label}</span>
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, color:B.muted, background:B.white, borderRadius:10, padding:"1px 8px", border:`1px solid ${B.border}` }}>{colClients.length}</span>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {colClients.map(c => (
                      <div key={c.id} style={{ background:B.white, borderRadius:8, padding:"12px 14px", border:`1px solid ${B.border}`, cursor:"pointer" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                          <div style={{ fontWeight:600, fontSize:12, lineHeight:1.3 }}>{c.name}</div>
                          <Badge status={c.status} />
                        </div>
                        <div style={{ fontSize:11, color:B.muted, marginBottom:6 }}>{c.business}</div>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <div style={{ display:"flex", gap:3, alignItems:"center" }}>
                            <span style={{ fontSize:10, color:B.light, marginRight:2 }}>Q1-4:</span>
                            <QDot status={c.q1} /><QDot status={c.q2} /><QDot status={c.q3} /><QDot status={c.q4} />
                          </div>
                          {c.daysLeft < 0 && <span style={{ fontSize:10, fontWeight:600, color:B.red }}>{Math.abs(c.daysLeft)}d late</span>}
                          {c.daysLeft > 0 && <span style={{ fontSize:10, color:B.light }}>{c.daysLeft}d left</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* YEAR VIEW */}
        {view === "year" && (
          <div style={{ background:B.white, borderRadius:"0 0 12px 12px", border:`1px solid ${B.border}`, overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead><tr style={{ borderBottom:`1px solid ${B.border}` }}>
                {["Client","Business","Q1","Q2","Q3","Q4","Final dec.","Overall"].map((h,i)=>(
                  <th key={i} style={{ padding:"10px 16px", textAlign:i>=2?"center":"left", fontSize:11, fontWeight:600, color:B.light, letterSpacing:"0.04em" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.filter(c=>c.status!=="pending-invite").map((c,i)=>{
                  const qs = [c.q1,c.q2,c.q3,c.q4];
                  const allFiled = qs.every(q=>q==="filed");
                  const hasOverdue = qs.some(q=>q==="overdue");
                  return (
                    <tr key={c.id} style={{ borderBottom:`1px solid ${B.borderLight}`, background:i%2===1?"#FAFBFC":"transparent", cursor:"pointer" }}>
                      <td style={{ padding:"12px 16px", fontWeight:600 }}>{c.name}</td>
                      <td style={{ padding:"12px 16px", fontSize:12, color:B.muted }}>{c.business}</td>
                      {qs.map((q,qi)=>(
                        <td key={qi} style={{ padding:"12px 16px", textAlign:"center" }}>
                          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:28, height:28, borderRadius:14, background:q==="filed"?B.greenBg:q==="overdue"?B.redBg:q==="ready"?`${B.primary}18`:B.surface, border:`1px solid ${q==="filed"?"#A7F3D0":q==="overdue"?"#FECACA":q==="ready"?"#BAE6FD":B.borderLight}` }}>
                            <span style={{ fontSize:11, fontWeight:700, color:q==="filed"?B.greenText:q==="overdue"?B.redText:q==="ready"?B.primary:B.light }}>
                              {q==="filed"?"✓":q==="overdue"?"!":q==="ready"?"●":"○"}
                            </span>
                          </div>
                        </td>
                      ))}
                      <td style={{ padding:"12px 16px", textAlign:"center" }}>
                        <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:28, height:28, borderRadius:14, background:B.surface, border:`1px solid ${B.borderLight}` }}>
                          <span style={{ fontSize:11, color:B.light }}>○</span>
                        </div>
                      </td>
                      <td style={{ padding:"12px 16px", textAlign:"center" }}>
                        <span style={{ fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, background:allFiled?B.greenBg:hasOverdue?B.redBg:B.amberBg, color:allFiled?B.greenText:hasOverdue?B.redText:B.amberText, border:`1px solid ${allFiled?"#A7F3D0":hasOverdue?"#FECACA":"#FDE68A"}` }}>
                          {allFiled?"On track":hasOverdue?"Action needed":"In progress"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ padding:"10px 20px", borderTop:`1px solid ${B.border}`, display:"flex", gap:16, fontSize:11, color:B.muted }}>
              <span style={{ display:"flex", alignItems:"center", gap:4 }}><div style={{ width:10, height:10, borderRadius:5, background:B.green }} /> Filed</span>
              <span style={{ display:"flex", alignItems:"center", gap:4 }}><div style={{ width:10, height:10, borderRadius:5, background:B.primary }} /> Records ready</span>
              <span style={{ display:"flex", alignItems:"center", gap:4 }}><div style={{ width:10, height:10, borderRadius:5, background:B.light }} /> Pending</span>
              <span style={{ display:"flex", alignItems:"center", gap:4 }}><div style={{ width:10, height:10, borderRadius:5, background:B.red }} /> Overdue</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

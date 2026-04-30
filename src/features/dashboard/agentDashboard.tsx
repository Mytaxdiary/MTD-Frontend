'use client'
import { useState } from "react";
import { mockDashboardClients as clients, mockKanbanCols as kanbanCols } from "@/mocks/dashboard/dashboardData";
import TypePills from "@/components/common/typePills";
import { matchesTypeFilter } from "@/lib/helpers/clientType";
import B from "@/styles/theme";


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
  const [quarterFilter, setQuarterFilter] = useState("all");
  const [activeMetric, setActiveMetric] = useState<string | null>(null);

  const handleMetricClick = (filterKey: string) => {
    if (activeMetric === filterKey) { setActiveMetric(null); setStatusFilter("all"); }
    else { setActiveMetric(filterKey); setStatusFilter(filterKey); }
  };

  // When a quarter is selected, resolve the per-quarter filing status (q1/q2/q3/q4)
  // instead of the client's current overall status, so historical quarters show correctly.
  const getQStatus = (c: typeof clients[0], qf: string): string => {
    if (qf === "all") return c.status;
    return c[qf.toLowerCase() as 'q1' | 'q2' | 'q3' | 'q4'];
  };

  let filtered = clients.filter(c => {
    if (quarterFilter !== "all") {
      const qStatus = getQStatus(c, quarterFilter);
      if (qStatus === "—") return false; // client has no MTD data for this quarter yet
      if (statusFilter !== "all") {
        if (statusFilter === "filed"         && qStatus !== "filed")                     return false;
        if (statusFilter === "overdue"       && qStatus !== "overdue")                   return false;
        if (statusFilter === "due-soon"      && !["pending","ready"].includes(qStatus))  return false;
        if (statusFilter === "pending-invite")                                            return false;
      }
    } else {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
    }
    if (!matchesTypeFilter(c.type, typeFilter)) return false;
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
          <button onClick={()=>navigate('add-client')} style={{ padding:"8px 16px", borderRadius:8, border:`1px solid ${B.border}`, background:B.white, fontSize:13, fontWeight:500, cursor:"pointer", color:B.text }}>+ Add client</button>
          <button onClick={()=>navigate('chase')} style={{ padding:"8px 16px", borderRadius:8, border:"none", background:B.primary, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>↗ Chase all overdue</button>
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
              <option value="both">Both income types</option>
            </select>
            {view === "list" && (
              <select value={quarterFilter} onChange={e=>setQuarterFilter(e.target.value)} style={{ padding:"6px 10px", borderRadius:6, border:`1px solid ${B.border}`, fontSize:12, color:B.text, background:B.white, cursor:"pointer" }}>
                <option value="all">All quarters</option>
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </select>
            )}
            <span style={{ fontSize:12, color:B.light, marginLeft:4 }}>{filtered.length} of {clients.length}</span>
          </div>
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            <button style={{ padding:"6px 10px", borderRadius:6, border:`1px solid ${B.border}`, fontSize:11, cursor:"pointer", background:B.white, color:B.muted }}>Export</button>
            <div style={{ display:"flex", gap:0, marginLeft:8 }}>
              {[{k:"list",l:"☰"},{k:"kanban",l:"▥"},{k:"year",l:"▦"}].map(v=>(
                <button key={v.k} onClick={()=>{ setView(v.k); if(v.k !== "list") setQuarterFilter("all"); }} style={{ padding:"6px 10px", border:`1px solid ${B.border}`, fontSize:13, cursor:"pointer", background:view===v.k?B.navy:"transparent", color:view===v.k?"#fff":B.muted, borderRadius:v.k==="list"?"6px 0 0 6px":v.k==="year"?"0 6px 6px 0":"0", marginLeft:v.k!=="list"?"-1px":"0" }} title={v.k==="list"?"List view":v.k==="kanban"?"Kanban view":"Year view"}>{v.l}</button>
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
                  <tr key={c.id} onClick={()=>navigate('client-detail')} style={{ borderBottom:`1px solid ${B.borderLight}`, cursor:"pointer", background:i%2===1?"#FAFBFC":"transparent" }}>
                    <td style={{ padding:"12px 16px" }}><div style={{ fontWeight:600 }}>{c.name}</div><div style={{ fontSize:11, color:B.light, marginTop:1 }}>{c.business}</div></td>
                    <td style={{ padding:"12px 16px" }}><TypePills types={c.type} compact /></td>
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
                        <div key={c.id} onClick={()=>navigate('client-detail')} style={{ background:B.white, borderRadius:8, padding:"12px 14px", border:`1px solid ${B.border}`, cursor:"pointer" }}>
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
                      <tr key={c.id} onClick={()=>navigate('client-detail')} style={{ borderBottom:`1px solid ${B.borderLight}`, background:i%2===1?"#FAFBFC":"transparent", cursor:"pointer" }}>
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

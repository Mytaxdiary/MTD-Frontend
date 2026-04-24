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
  { id:1, name:"Sarah Mitchell", business:"Mitchell Consulting", deadline:"7 Apr 2026", daysOverdue:17, lastChase:"10 Apr", chaseCount:3, status:"no-response", channel:"email", workflowType:"data-request" },
  { id:2, name:"James Cooper", business:"Cooper Properties", deadline:"7 Apr 2026", daysOverdue:17, lastChase:"14 Apr", chaseCount:2, status:"opened", channel:"email", workflowType:"bookkeeping" },
  { id:4, name:"Tom Grant", business:"Grant Rentals", deadline:"7 May 2026", daysOverdue:-13, lastChase:"16 Apr", chaseCount:1, status:"opened", channel:"sms", workflowType:"data-request" },
  { id:7, name:"Marcus Chen", business:"Chen Photography", deadline:"7 May 2026", daysOverdue:-13, lastChase:null, chaseCount:0, status:"not-started", channel:"email", workflowType:"bookkeeping" },
  { id:9, name:"George Whitfield", business:"Whitfield Electricals", deadline:"7 May 2026", daysOverdue:-13, lastChase:"12 Apr", chaseCount:1, status:"no-response", channel:"email", workflowType:"data-request" },
  { id:11, name:"Oliver Stone", business:"Stone Lettings", deadline:"7 May 2026", daysOverdue:-13, lastChase:null, chaseCount:0, status:"not-started", channel:"email", workflowType:"bookkeeping" },
];

const defaultTemplates = [
  { id:"bk-gentle", type:"bookkeeping", name:"Bookkeeping reminder", subject:"Quarterly bookkeeping needed — {business}", body:"Hi {name},\n\nJust a reminder that your {quarter} quarterly records are due by {deadline}. Please complete your bookkeeping in your accounting software and let us know when it's ready for us to review.\n\nIf you need any help, just reply to this email.\n\nBest regards,\n{agent_name}" },
  { id:"bk-urgent", type:"bookkeeping", name:"Bookkeeping overdue", subject:"Action required: overdue bookkeeping — {business}", body:"Hi {name},\n\nThe deadline for your {quarter} quarterly update has passed. Please complete your bookkeeping as soon as possible so we can review and ensure your records are up to date with HMRC.\n\nBest regards,\n{agent_name}" },
  { id:"dr-gentle", type:"data-request", name:"Data request — gentle", subject:"Quarterly records needed — {business}", body:"Hi {name},\n\nWe need your income and expense records for {quarter} (due {deadline}). Please send us your bank statements, invoices, and receipts for the period.\n\nYou can reply to this email with attachments, or upload files directly in your NewEffect portal.\n\nBest regards,\n{agent_name}" },
  { id:"dr-urgent", type:"data-request", name:"Data request — urgent", subject:"Urgent: records overdue — {business}", body:"Hi {name},\n\nYour {quarter} records are now overdue. We need your bank statements and receipts urgently to submit your quarterly update to HMRC.\n\nPlease send everything you have as soon as possible.\n\nBest regards,\n{agent_name}" },
  { id:"welcome", type:"general", name:"Welcome / onboarding", subject:"Welcome to {firm_name} — getting started", body:"Hi {name},\n\nWelcome! We're looking forward to helping you with your Making Tax Digital obligations.\n\nYou'll receive a separate email from HMRC asking you to authorise us as your agent. Please accept this — it allows us to manage your quarterly updates.\n\nBest regards,\n{agent_name}" },
];

const NavItem = ({ label, active, icon, count }) => (
  <div style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 14px", borderRadius:8, cursor:"pointer", background:active?"rgba(14,165,201,0.12)":"transparent", color:active?B.primary:"rgba(255,255,255,0.65)", fontSize:13, fontWeight:active?600:400, marginBottom:2 }}>
    <span style={{ fontSize:15, opacity:active?1:0.6 }}>{icon}</span><span style={{ flex:1 }}>{label}</span>
    {count>0 && <span style={{ fontSize:10, fontWeight:700, background:B.red, color:"#fff", borderRadius:10, padding:"1px 7px" }}>{count}</span>}
  </div>
);

const ResponseBadge = ({ status }) => {
  const m = { "no-response":{bg:B.redBg,c:B.redText,b:"#FECACA",l:"No response"}, opened:{bg:B.amberBg,c:B.amberText,b:"#FDE68A",l:"Opened"}, responded:{bg:B.greenBg,c:B.greenText,b:"#A7F3D0",l:"Responded"}, "not-started":{bg:B.surface,c:B.light,b:B.border,l:"Not chased"} };
  const s = m[status];
  return <span style={{ fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, background:s.bg, color:s.c, border:`1px solid ${s.b}` }}>{s.l}</span>;
};

export default function ChaseManager() {
  const [selectedTemplate, setSelectedTemplate] = useState("dr-gentle");
  const [selected, setSelected] = useState(new Set());
  const [sent, setSent] = useState(new Set());
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templates, setTemplates] = useState(defaultTemplates);
  const [editBody, setEditBody] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [clientChannels, setClientChannels] = useState(Object.fromEntries(chaseClients.map(c=>[c.id,c.channel])));
  const [typeFilter, setTypeFilter] = useState("all");

  const toggleSelect = (id) => setSelected(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n});
  const handleSend = () => { setSent(new Set([...sent,...selected])); setSelected(new Set()) };

  const startEdit = (t) => { setEditingTemplate(t.id); setEditBody(t.body); setEditSubject(t.subject) };
  const saveEdit = () => { setTemplates(ts=>ts.map(t=>t.id===editingTemplate?{...t,body:editBody,subject:editSubject}:t)); setEditingTemplate(null) };

  const overdueClients = chaseClients.filter(c=>c.daysOverdue>0);
  const upcomingClients = chaseClients.filter(c=>c.daysOverdue<=0);
  const currentTemplate = templates.find(t=>t.id===selectedTemplate);

  const filteredOverdue = typeFilter==="all"?overdueClients:overdueClients.filter(c=>c.workflowType===typeFilter);
  const filteredUpcoming = typeFilter==="all"?upcomingClients:upcomingClients.filter(c=>c.workflowType===typeFilter);

  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'DM Sans','Segoe UI',system-ui,sans-serif", background:B.surface, color:B.text }}>
      <div style={{ width:230, background:B.navy, display:"flex", flexDirection:"column", flexShrink:0 }}>
        <div style={{ padding:"22px 20px 20px", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,${B.primary},${B.primaryDark})`, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:13, color:"#fff" }}>NE</div>
            <div><div style={{ fontSize:14, fontWeight:700, color:"#fff" }}>NewEffect</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", fontWeight:500 }}>MTD ITSA</div></div>
          </div>
        </div>
        <div style={{ padding:"16px 12px", flex:1 }}>
          <div style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.3)", letterSpacing:"0.08em", padding:"0 14px", marginBottom:8 }}>MAIN</div>
          <NavItem label="Dashboard" icon="⊞" /><NavItem label="Clients" icon="⊡" /><NavItem label="Chase manager" active icon="↗" count={2} />
          <div style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.3)", letterSpacing:"0.08em", padding:"0 14px", marginTop:24, marginBottom:8 }}>MANAGE</div>
          <NavItem label="Add client" icon="+" /><NavItem label="Settings" icon="⚙" /><NavItem label="HMRC connection" icon="⟷" />
        </div>
        <div style={{ padding:"16px", borderTop:"1px solid rgba(255,255,255,0.08)" }}><div style={{ display:"flex", alignItems:"center", gap:10 }}><div style={{ width:32, height:32, borderRadius:20, background:"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.7)" }}>JW</div><div><div style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.85)" }}>Jane Walker</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>Walker & Co</div></div></div></div>
      </div>

      <div style={{ flex:1, overflow:"auto", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"16px 32px", background:B.white, borderBottom:`1px solid ${B.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <div>
            <div style={{ fontSize:20, fontWeight:700, letterSpacing:"-0.02em" }}>Chase manager</div>
            <div style={{ fontSize:13, color:B.muted, marginTop:2 }}>{chaseClients.length} clients needing records — {overdueClients.length} overdue, {upcomingClients.length} upcoming</div>
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} style={{ padding:"6px 10px", borderRadius:6, border:`1px solid ${B.border}`, fontSize:12, color:B.text, background:B.white, cursor:"pointer" }}>
              <option value="all">All workflow types</option>
              <option value="bookkeeping">Bookkeeping reminder</option>
              <option value="data-request">Data request</option>
            </select>
            {selected.size>0 && <button onClick={handleSend} style={{ padding:"8px 20px", borderRadius:8, border:"none", background:B.primary, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>Send to {selected.size} client{selected.size>1?"s":""}</button>}
          </div>
        </div>

        <div style={{ padding:"24px 32px", flex:1 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:20 }}>
            <div>
              {filteredOverdue.length>0 && (
                <div style={{ marginBottom:20 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                    <div style={{ width:8, height:8, borderRadius:4, background:B.red }} /><span style={{ fontSize:13, fontWeight:700, color:B.redText }}>Overdue — deadline passed</span><span style={{ fontSize:11, color:B.muted }}>({filteredOverdue.length})</span>
                  </div>
                  <div style={{ background:B.white, borderRadius:12, border:`1px solid ${B.border}`, overflow:"hidden" }}>
                    {filteredOverdue.map((c,i)=>(
                      <div key={c.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", borderBottom:i<filteredOverdue.length-1?`1px solid ${B.borderLight}`:"none", background:sent.has(c.id)?B.greenBg:selected.has(c.id)?"#F0F9FF":"transparent" }}>
                        <input type="checkbox" checked={selected.has(c.id)} onChange={()=>toggleSelect(c.id)} style={{ cursor:"pointer", accentColor:B.primary }} />
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <div><span style={{ fontWeight:600, fontSize:13 }}>{c.name}</span><span style={{ color:B.muted, fontSize:12, marginLeft:8 }}>{c.business}</span></div>
                            <ResponseBadge status={sent.has(c.id)?"responded":c.status} />
                          </div>
                          <div style={{ display:"flex", gap:16, marginTop:6, fontSize:11, color:B.light, alignItems:"center" }}>
                            <span>Due: <b style={{ color:B.redText }}>{c.deadline}</b> ({c.daysOverdue}d overdue)</span>
                            <span>Chased: <b style={{ color:B.text }}>{c.chaseCount}x</b></span>
                            <span style={{ fontSize:10, padding:"1px 7px", borderRadius:4, background:c.workflowType==="bookkeeping"?B.purpleBg:B.blueBg, color:c.workflowType==="bookkeeping"?B.purpleText:B.blueText }}>{c.workflowType==="bookkeeping"?"Bookkeeping":"Data request"}</span>
                            <select value={clientChannels[c.id]} onChange={e=>setClientChannels({...clientChannels,[c.id]:e.target.value})} style={{ fontSize:10, padding:"2px 6px", borderRadius:4, border:`1px solid ${B.borderLight}`, background:B.white, color:B.muted, cursor:"pointer" }}>
                              <option value="email">Email</option>
                              <option value="sms">SMS</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredUpcoming.length>0 && (
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                    <div style={{ width:8, height:8, borderRadius:4, background:B.amber }} /><span style={{ fontSize:13, fontWeight:700, color:B.amberText }}>Upcoming — chase window open</span><span style={{ fontSize:11, color:B.muted }}>({filteredUpcoming.length})</span>
                  </div>
                  <div style={{ background:B.white, borderRadius:12, border:`1px solid ${B.border}`, overflow:"hidden" }}>
                    {filteredUpcoming.map((c,i)=>(
                      <div key={c.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", borderBottom:i<filteredUpcoming.length-1?`1px solid ${B.borderLight}`:"none", background:sent.has(c.id)?B.greenBg:selected.has(c.id)?"#F0F9FF":"transparent" }}>
                        <input type="checkbox" checked={selected.has(c.id)} onChange={()=>toggleSelect(c.id)} style={{ cursor:"pointer", accentColor:B.primary }} />
                        <div style={{ flex:1 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <div><span style={{ fontWeight:600, fontSize:13 }}>{c.name}</span><span style={{ color:B.muted, fontSize:12, marginLeft:8 }}>{c.business}</span></div>
                            <ResponseBadge status={sent.has(c.id)?"responded":c.status} />
                          </div>
                          <div style={{ display:"flex", gap:16, marginTop:6, fontSize:11, color:B.light, alignItems:"center" }}>
                            <span>Due: <b style={{ color:B.text }}>{c.deadline}</b> ({Math.abs(c.daysOverdue)}d left)</span>
                            <span>Chased: <b style={{ color:B.text }}>{c.chaseCount}x</b></span>
                            <span style={{ fontSize:10, padding:"1px 7px", borderRadius:4, background:c.workflowType==="bookkeeping"?B.purpleBg:B.blueBg, color:c.workflowType==="bookkeeping"?B.purpleText:B.blueText }}>{c.workflowType==="bookkeeping"?"Bookkeeping":"Data request"}</span>
                            <select value={clientChannels[c.id]} onChange={e=>setClientChannels({...clientChannels,[c.id]:e.target.value})} style={{ fontSize:10, padding:"2px 6px", borderRadius:4, border:`1px solid ${B.borderLight}`, background:B.white, color:B.muted, cursor:"pointer" }}>
                              <option value="email">Email</option>
                              <option value="sms">SMS</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right — templates with edit mode */}
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div style={{ background:B.white, borderRadius:12, border:`1px solid ${B.border}`, overflow:"hidden" }}>
                <div style={{ padding:"14px 20px", borderBottom:`1px solid ${B.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ fontSize:14, fontWeight:700 }}>Chase templates</div>
                  <button style={{ fontSize:11, fontWeight:500, padding:"4px 10px", borderRadius:6, border:`1px solid ${B.border}`, background:"transparent", cursor:"pointer", color:B.primary }}>+ New template</button>
                </div>
                <div style={{ padding:"8px 12px" }}>
                  {templates.map(t=>(
                    <div key={t.id} onClick={()=>{setSelectedTemplate(t.id);setEditingTemplate(null)}} style={{
                      padding:"10px 12px", borderRadius:8, cursor:"pointer", marginBottom:4,
                      background:selectedTemplate===t.id?B.blueBg:"transparent",
                      border:`1px solid ${selectedTemplate===t.id?"#BAE6FD":"transparent"}`
                    }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div style={{ fontSize:12, fontWeight:600, color:selectedTemplate===t.id?B.blueText:B.text }}>{t.name}</div>
                        <span style={{ fontSize:9, padding:"1px 6px", borderRadius:4, background:t.type==="bookkeeping"?B.purpleBg:t.type==="data-request"?B.blueBg:B.surface, color:t.type==="bookkeeping"?B.purpleText:t.type==="data-request"?B.blueText:B.muted }}>{t.type==="bookkeeping"?"BK":t.type==="data-request"?"DR":"GEN"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background:B.white, borderRadius:12, border:`1px solid ${B.border}`, overflow:"hidden" }}>
                <div style={{ padding:"14px 20px", borderBottom:`1px solid ${B.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ fontSize:14, fontWeight:700 }}>{editingTemplate?"Edit template":"Preview"}</div>
                  {!editingTemplate && currentTemplate && <button onClick={()=>startEdit(currentTemplate)} style={{ fontSize:11, fontWeight:500, padding:"4px 10px", borderRadius:6, border:`1px solid ${B.border}`, background:"transparent", cursor:"pointer", color:B.muted }}>Edit</button>}
                  {editingTemplate && <div style={{ display:"flex", gap:6 }}><button onClick={()=>setEditingTemplate(null)} style={{ fontSize:11, padding:"4px 10px", borderRadius:6, border:`1px solid ${B.border}`, background:"transparent", cursor:"pointer", color:B.muted }}>Cancel</button><button onClick={saveEdit} style={{ fontSize:11, fontWeight:600, padding:"4px 10px", borderRadius:6, border:"none", background:B.green, color:"#fff", cursor:"pointer" }}>Save</button></div>}
                </div>
                <div style={{ padding:"16px 20px" }}>
                  {!editingTemplate && currentTemplate && (
                    <>
                      <div style={{ fontSize:11, fontWeight:600, color:B.muted, marginBottom:4 }}>Subject</div>
                      <div style={{ fontSize:12, marginBottom:14, padding:"8px 12px", background:B.surface, borderRadius:6, border:`1px solid ${B.borderLight}` }}>{currentTemplate.subject}</div>
                      <div style={{ fontSize:11, fontWeight:600, color:B.muted, marginBottom:4 }}>Body</div>
                      <div style={{ fontSize:12, color:B.muted, lineHeight:1.7, padding:"12px", background:B.surface, borderRadius:6, border:`1px solid ${B.borderLight}`, whiteSpace:"pre-wrap" }}>{currentTemplate.body}</div>
                    </>
                  )}
                  {editingTemplate && (
                    <>
                      <div style={{ fontSize:11, fontWeight:600, color:B.muted, marginBottom:4 }}>Subject</div>
                      <input value={editSubject} onChange={e=>setEditSubject(e.target.value)} style={{ width:"100%", padding:"8px 12px", borderRadius:6, border:`1px solid ${B.border}`, fontSize:12, marginBottom:14, outline:"none" }} />
                      <div style={{ fontSize:11, fontWeight:600, color:B.muted, marginBottom:4 }}>Body</div>
                      <textarea value={editBody} onChange={e=>setEditBody(e.target.value)} rows={10} style={{ width:"100%", padding:"12px", borderRadius:6, border:`1px solid ${B.border}`, fontSize:12, lineHeight:1.7, outline:"none", resize:"vertical", fontFamily:"inherit" }} />
                    </>
                  )}
                  <div style={{ fontSize:10, color:B.light, marginTop:10 }}>Variables: {"{name}"}, {"{business}"}, {"{quarter}"}, {"{deadline}"}, {"{agent_name}"}, {"{firm_name}"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

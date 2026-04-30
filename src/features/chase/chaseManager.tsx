'use client'
import { useState } from "react";
import { mockChaseClients as chaseClients, mockChaseTemplates as defaultTemplates } from "@/mocks/chase/chaseData";

import B from "@/styles/theme";


const ResponseBadge = ({ status }: { status: string }) => {
  const m: Record<string, { bg: string; c: string; b: string; l: string }> = {
    "no-response":{bg:B.redBg,c:B.redText,b:"#FECACA",l:"No response"},
    opened:{bg:B.amberBg,c:B.amberText,b:"#FDE68A",l:"Opened"},
    responded:{bg:B.greenBg,c:B.greenText,b:"#A7F3D0",l:"Responded"},
    "not-started":{bg:B.surface,c:B.light,b:B.border,l:"Not chased"},
  };
  const s = m[status];
  return <span style={{ fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, background:s.bg, color:s.c, border:`1px solid ${s.b}` }}>{s.l}</span>;
};

type Template = typeof defaultTemplates[number];

export default function ChaseManager({ navigate = () => {} }: { navigate?: (route: string) => void }) {
  const [selectedTemplate, setSelectedTemplate] = useState("dr-gentle");
  const [selected, setSelected] = useState(new Set<number>());
  const [sent, setSent] = useState(new Set<number>());
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates);
  const [editBody, setEditBody] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [clientChannels, setClientChannels] = useState<Record<number, string>>(Object.fromEntries(chaseClients.map(c=>[c.id,c.channel])));
  const [typeFilter, setTypeFilter] = useState("all");

  const toggleSelect = (id: number) => setSelected(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n});
  const handleSend = () => { setSent(new Set([...sent,...selected])); setSelected(new Set()) };

  const startEdit = (t: Template) => { setEditingTemplate(t.id); setEditBody(t.body); setEditSubject(t.subject) };
  const saveEdit = () => { setTemplates(ts=>ts.map(t=>t.id===editingTemplate?{...t,body:editBody,subject:editSubject}:t)); setEditingTemplate(null) };

  const overdueClients = chaseClients.filter(c=>c.daysOverdue>0);
  const upcomingClients = chaseClients.filter(c=>c.daysOverdue<=0);
  const currentTemplate = templates.find(t=>t.id===selectedTemplate);

  const filteredOverdue = typeFilter==="all"?overdueClients:overdueClients.filter(c=>c.workflowType===typeFilter);
  const filteredUpcoming = typeFilter==="all"?upcomingClients:upcomingClients.filter(c=>c.workflowType===typeFilter);

  return (
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
  );
}

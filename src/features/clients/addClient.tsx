'use client'
import { useState } from "react";

const B = {
  primary:"#0EA5C9", primaryDark:"#0284A8", navy:"#1B2A4A",
  surface:"#F8FAFC", white:"#FFFFFF", border:"#E2E8F0", borderLight:"#F1F5F9",
  text:"#0F172A", muted:"#64748B", light:"#94A3B8", xlight:"#CBD5E1",
  red:"#EF4444", redBg:"#FEF2F2", redText:"#991B1B",
  amber:"#F59E0B", amberBg:"#FFFBEB", amberText:"#92400E",
  green:"#10B981", greenBg:"#ECFDF5", greenText:"#065F46",
  purple:"#8B5CF6", purpleBg:"#F5F3FF", purpleText:"#5B21B6",
  blueBg:"#F0F9FF", blueText:"#0C4A6E",
};

const pendingInvites = [
  { id:1, name:"Aisha Patel", nino:"AB 12 34 56 C", sent:"12 Apr 2026", expires:"3 May 2026", daysLeft:9 },
  { id:2, name:"—", nino:"CD 65 43 21 B", sent:"18 Apr 2026", expires:"9 May 2026", daysLeft:15 },
];

export default function AddClient({ navigate = () => {} }: { navigate?: (route: string) => void }) {
  const [nino, setNino] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [personalMsg, setPersonalMsg] = useState("Hi {name}, this is Jane from Walker & Co. We're setting up your Making Tax Digital account. You'll receive an email from HMRC shortly — please accept the authorisation link so we can manage your quarterly updates.");
  const [agentType, setAgentType] = useState("main");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [sent, setSent] = useState(false);
  const [mode, setMode] = useState("single");

  const ninoClean = nino.replace(/\s/g,"");
  const ninoFormatted = ninoClean.toUpperCase().replace(/(.{2})(?=.)/g,"$1 ").trim();
  const ninoValid = ninoClean.length === 9;
  const emailValid = clientEmail.includes("@") && clientEmail.includes(".");
  const formComplete = ninoValid && clientName.length > 0 && emailValid;

  return (
    <div style={{ flex:1, overflow:"auto", display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"16px 32px", background:B.white, borderBottom:`1px solid ${B.border}`, flexShrink:0 }}>
        <div style={{ fontSize:20, fontWeight:700 }}>Add client</div>
        <div style={{ fontSize:13, color:B.muted, marginTop:2 }}>Send an HMRC authorisation invitation to a new client</div>
      </div>

      <div style={{ padding:"24px 32px", flex:1 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 360px", gap:24 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <div style={{ display:"flex", gap:4, padding:4, background:B.borderLight, borderRadius:10, width:"fit-content" }}>
              {[{k:"single",l:"Single client"},{k:"bulk",l:"Bulk import (CSV)"}].map(m=>(
                <button key={m.k} onClick={()=>setMode(m.k)} style={{ padding:"7px 18px", borderRadius:7, border:"none", fontSize:12, fontWeight:600, cursor:"pointer", background:mode===m.k?B.white:"transparent", color:mode===m.k?B.text:B.muted, boxShadow:mode===m.k?"0 1px 3px rgba(0,0,0,0.06)":"none" }}>{m.l}</button>
              ))}
            </div>

            {mode==="single" && !sent && (
              <div style={{ background:B.white, borderRadius:12, border:`1px solid ${B.border}`, padding:"24px" }}>
                <div style={{ fontSize:15, fontWeight:700, marginBottom:20 }}>Client details</div>

                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:B.muted, display:"block", marginBottom:5 }}>National Insurance number (NINO) *</label>
                  <input value={ninoFormatted} onChange={e=>setNino(e.target.value)} placeholder="QQ 12 34 56 C" maxLength={13} style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:`1px solid ${nino.length>0&&!ninoValid?"#FECACA":B.border}`, fontSize:15, fontFamily:"monospace", letterSpacing:"0.08em", outline:"none" }} />
                  {nino.length>0 && !ninoValid && <div style={{ fontSize:11, color:B.red, marginTop:4 }}>NINO must be 9 characters (2 letters, 6 digits, 1 letter)</div>}
                </div>

                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:B.muted, display:"block", marginBottom:5 }}>Client name *</label>
                  <input value={clientName} onChange={e=>setClientName(e.target.value)} placeholder="e.g. John Smith" style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:`1px solid ${B.border}`, fontSize:13, outline:"none" }} />
                </div>

                <div style={{ marginBottom:16 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:B.muted, display:"block", marginBottom:5 }}>Client email *</label>
                  <input value={clientEmail} onChange={e=>setClientEmail(e.target.value)} placeholder="client@example.com" style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:`1px solid ${clientEmail.length>0&&!emailValid?"#FECACA":B.border}`, fontSize:13, outline:"none" }} />
                </div>

                <div style={{ marginBottom:20 }}>
                  <label style={{ fontSize:12, fontWeight:600, color:B.muted, display:"block", marginBottom:5 }}>Personal message to client</label>
                  <textarea value={personalMsg} onChange={e=>setPersonalMsg(e.target.value)} rows={4} style={{ width:"100%", padding:"10px 14px", borderRadius:8, border:`1px solid ${B.border}`, fontSize:12, lineHeight:1.6, outline:"none", resize:"vertical", fontFamily:"inherit" }} />
                  <div style={{ fontSize:10, color:B.light, marginTop:3 }}>Sent alongside the HMRC invitation link. Use {"{name}"} for auto-replacement.</div>
                </div>

                <div style={{ marginBottom:20 }}>
                  <button onClick={()=>setShowAdvanced(!showAdvanced)} style={{ fontSize:12, color:B.primary, background:"transparent", border:"none", cursor:"pointer", fontWeight:500 }}>
                    {showAdvanced?"▾ Hide":"▸ Show"} advanced options
                  </button>
                  {showAdvanced && (
                    <div style={{ marginTop:12, padding:16, background:B.surface, borderRadius:8, border:`1px solid ${B.borderLight}` }}>
                      <label style={{ fontSize:12, fontWeight:600, color:B.muted, display:"block", marginBottom:8 }}>Agent type</label>
                      <div style={{ display:"flex", gap:10 }}>
                        {[{k:"main",l:"Main agent",d:"Full access"},{k:"supporting",l:"Supporting agent",d:"In-year updates only"}].map(a=>(
                          <div key={a.k} onClick={()=>setAgentType(a.k)} style={{ flex:1, padding:"10px 12px", borderRadius:8, cursor:"pointer", border:`1.5px solid ${agentType===a.k?B.primary:B.border}`, background:agentType===a.k?B.blueBg:B.white }}>
                            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                              <div style={{ width:14, height:14, borderRadius:7, border:`2px solid ${agentType===a.k?B.primary:B.xlight}`, display:"flex", alignItems:"center", justifyContent:"center" }}>{agentType===a.k && <div style={{ width:6, height:6, borderRadius:3, background:B.primary }} />}</div>
                              <span style={{ fontSize:12, fontWeight:600 }}>{a.l}</span>
                            </div>
                            <div style={{ fontSize:11, color:B.muted, marginTop:3, paddingLeft:20 }}>{a.d}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ borderTop:`1px solid ${B.border}`, paddingTop:20, display:"flex", justifyContent:"flex-end", gap:10 }}>
                  <button onClick={()=>{if(formComplete) setSent(true)}} style={{
                    padding:"10px 24px", borderRadius:8, border:"none", fontSize:13, fontWeight:700, cursor:formComplete?"pointer":"not-allowed",
                    background:formComplete?B.green:B.xlight, color:formComplete?"#fff":B.muted, transition:"all 0.2s"
                  }}>Send HMRC invitation</button>
                </div>
              </div>
            )}

            {mode==="single" && sent && (
              <div style={{ background:B.white, borderRadius:12, border:`1px solid ${B.border}`, padding:"40px", textAlign:"center" }}>
                <div style={{ width:56, height:56, borderRadius:28, background:B.greenBg, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:24, border:"2px solid #A7F3D0" }}>✓</div>
                <div style={{ fontSize:18, fontWeight:700, marginBottom:8 }}>Invitation sent to {clientName}</div>
                <div style={{ fontSize:13, color:B.muted, lineHeight:1.6, maxWidth:400, margin:"0 auto" }}>Your personal message and HMRC authorisation link have been sent to {clientEmail}. The client needs to sign in with their Government Gateway credentials to accept.</div>
                <div style={{ marginTop:16, padding:"12px 16px", background:B.amberBg, borderRadius:8, border:"1px solid #FDE68A", fontSize:12, color:B.amberText }}>The invitation expires in 21 days. You&#39;ll be notified when the client accepts.</div>
                <button onClick={()=>{setSent(false);setNino("");setClientName("");setClientEmail("")}} style={{ marginTop:20, padding:"8px 20px", borderRadius:8, border:`1px solid ${B.border}`, background:B.white, fontSize:13, fontWeight:500, cursor:"pointer", color:B.text }}>Add another client</button>
              </div>
            )}

            {mode==="bulk" && (
              <div style={{ background:B.white, borderRadius:12, border:`1px solid ${B.border}`, padding:"24px" }}>
                <div style={{ fontSize:15, fontWeight:700, marginBottom:8 }}>Bulk import clients</div>
                <div style={{ fontSize:13, color:B.muted, marginBottom:20, lineHeight:1.6 }}>Upload a CSV file with your client NINOs to send multiple invitations at once.</div>
                <div style={{ border:`2px dashed ${B.border}`, borderRadius:12, padding:"40px 20px", textAlign:"center", background:B.surface }}>
                  <div style={{ fontSize:32, color:B.xlight, marginBottom:12 }}>+</div>
                  <div style={{ fontSize:13, fontWeight:600, marginBottom:4 }}>Drop your CSV file here or click to browse</div>
                  <div style={{ fontSize:12, color:B.light }}>Required columns: NINO, Client name, Email</div>
                </div>
                <div style={{ marginTop:16 }}><button style={{ padding:"6px 14px", borderRadius:6, border:`1px solid ${B.border}`, background:"transparent", fontSize:12, fontWeight:500, cursor:"pointer", color:B.primary }}>Download CSV template</button></div>
              </div>
            )}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <div style={{ background:B.white, borderRadius:12, border:`1px solid ${B.border}`, overflow:"hidden" }}>
              <div style={{ padding:"14px 20px", borderBottom:`1px solid ${B.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontSize:14, fontWeight:700 }}>Pending invitations</div>
                <span style={{ fontSize:11, fontWeight:600, padding:"2px 10px", borderRadius:20, background:B.purpleBg, color:B.purpleText, border:"1px solid #DDD6FE" }}>{pendingInvites.length}</span>
              </div>
              <div style={{ padding:"4px 20px 12px" }}>
                {pendingInvites.map((inv,i)=>(
                  <div key={inv.id} style={{ padding:"12px 0", borderBottom:i<pendingInvites.length-1?`1px solid ${B.borderLight}`:"none" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontWeight:600, fontSize:13 }}>{inv.name}</span>
                      <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:10, background:B.amberBg, color:B.amberText }}>Outstanding</span>
                    </div>
                    <div style={{ fontSize:11, fontFamily:"monospace", color:B.muted, marginTop:3 }}>{inv.nino}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:6 }}>
                      <span style={{ fontSize:11, color:B.light }}>Sent {inv.sent} — {inv.daysLeft}d left</span>
                      <button style={{ fontSize:11, fontWeight:500, padding:"3px 10px", borderRadius:6, border:`1px solid ${B.border}`, background:"transparent", cursor:"pointer", color:B.muted }}>Resend</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background:B.white, borderRadius:12, border:`1px solid ${B.border}`, overflow:"hidden" }}>
              <div style={{ padding:"14px 20px", borderBottom:`1px solid ${B.border}`, fontSize:14, fontWeight:700 }}>How the invitation works</div>
              <div style={{ padding:"14px 20px" }}>
                {[{n:"1",t:"You send the invitation",d:"We create an HMRC authorisation request and send your personal message"},{n:"2",t:"Client receives email",d:"They get your message plus a link to HMRC's Government Gateway"},{n:"3",t:"Client accepts",d:"They sign in and confirm — you get notified instantly"},{n:"4",t:"Client appears on dashboard",d:"We fetch their business details, obligations, and liabilities"}].map((s,i)=>(
                  <div key={i} style={{ display:"flex", gap:12, marginBottom:i<3?14:0 }}>
                    <div style={{ width:24, height:24, borderRadius:12, background:B.blueBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:B.blueText, flexShrink:0, border:"1px solid #BAE6FD" }}>{s.n}</div>
                    <div><div style={{ fontSize:12, fontWeight:600 }}>{s.t}</div><div style={{ fontSize:11, color:B.muted, marginTop:1, lineHeight:1.5 }}>{s.d}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client'
import { useState } from "react";
import B from "@/styles/theme";
import { Card, CardHeader as CardHead } from "@/components/ui/card";

export default function Settings({ navigate = () => {} }: { navigate?: (route: string) => void }) {
  const [section, setSection] = useState("firm");
  const [chaseEmail, setChaseEmail] = useState(true);
  const [chaseSms, setChaseSms] = useState(false);
  const [overdueAlert, setOverdueAlert] = useState(true);
  const [deadlineReminder, setDeadlineReminder] = useState(true);
  const [inviteAccepted, setInviteAccepted] = useState(true);
  const [liabilityAlert, setLiabilityAlert] = useState(true);
  const [reminderDays, setReminderDays] = useState("14");

  const Toggle = ({ on, onChange, label, isNew }: { on: boolean; onChange: (v: boolean) => void; label: string; isNew?: boolean }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${B.borderLight}` }}>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}><span style={{ fontSize:13 }}>{label}</span>{isNew && <span style={{ fontSize:9, fontWeight:700, padding:"1px 6px", borderRadius:4, background:B.primary, color:"#fff" }}>NEW</span>}</div>
      <div onClick={()=>onChange(!on)} style={{ width:40, height:22, borderRadius:11, background:on?B.primary:B.xlight, cursor:"pointer", position:"relative", transition:"background 0.2s" }}><div style={{ width:18, height:18, borderRadius:9, background:"#fff", position:"absolute", top:2, left:on?20:2, transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.1)" }} /></div>
    </div>
  );

  const sections = [{k:"firm",l:"Firm details",i:"⊡"},{k:"hmrc",l:"HMRC connection",i:"⟷"},{k:"team",l:"Team members",i:"☷"},{k:"notifications",l:"Notifications",i:"⊙"},{k:"billing",l:"Plan & billing",i:"◇"}];

  return (
    <div style={{ flex:1, overflow:"auto", display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"16px 32px", background:B.white, borderBottom:`1px solid ${B.border}`, flexShrink:0 }}>
        <div style={{ fontSize:20, fontWeight:700 }}>Settings</div>
        <div style={{ fontSize:13, color:B.muted, marginTop:2 }}>Manage your firm, HMRC connection, team, and preferences</div>
      </div>
      <div style={{ padding:"24px 32px", flex:1 }}>
        <div style={{ display:"grid", gridTemplateColumns:"200px 1fr", gap:24 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
            {sections.map(s=>(<div key={s.k} onClick={()=>setSection(s.k)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:8, cursor:"pointer", background:section===s.k?B.white:"transparent", border:`1px solid ${section===s.k?B.border:"transparent"}`, fontSize:13, fontWeight:section===s.k?600:400, color:section===s.k?B.text:B.muted }}><span style={{ fontSize:14, opacity:0.7 }}>{s.i}</span>{s.l}</div>))}
          </div>
          <div>
            {section==="firm" && (
              <Card><CardHead titleSize={15} padding="16px 20px" title="Firm details" sub="Your practice information" /><div style={{ padding:"20px" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                  {[["Firm name","Walker & Co Accountants"],["Primary contact","Jane Walker"],["Email","jane@walkerco.co.uk"],["Phone","01234 567890"]].map(([l,v],i)=>(<div key={i}><label style={{ fontSize:12, fontWeight:600, color:B.muted, display:"block", marginBottom:5 }}>{l}</label><input defaultValue={v} style={{ width:"100%", padding:"9px 14px", borderRadius:8, border:`1px solid ${B.border}`, fontSize:13, outline:"none" }} /></div>))}
                  <div style={{ gridColumn:"1/-1" }}><label style={{ fontSize:12, fontWeight:600, color:B.muted, display:"block", marginBottom:5 }}>Address</label><input defaultValue="14 High Street, Slough, SL1 1AA" style={{ width:"100%", padding:"9px 14px", borderRadius:8, border:`1px solid ${B.border}`, fontSize:13, outline:"none" }} /></div>
                </div>
                <div style={{ borderTop:`1px solid ${B.border}`, paddingTop:16, marginTop:16, display:"flex", justifyContent:"flex-end" }}><button style={{ padding:"8px 20px", borderRadius:8, border:"none", background:B.primary, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>Save changes</button></div>
              </div></Card>
            )}

            {section==="hmrc" && (
              <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
                <Card><CardHead titleSize={15} padding="16px 20px" title="HMRC connection status" sub="OAuth 2.0 via Government Gateway" /><div style={{ padding:"20px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, padding:"14px 16px", background:B.greenBg, borderRadius:10, border:"1px solid #A7F3D0" }}><div style={{ width:10, height:10, borderRadius:5, background:B.green }} /><div><div style={{ fontSize:13, fontWeight:700, color:B.greenText }}>Connected to HMRC</div><div style={{ fontSize:11, color:"#047857" }}>Agent Services Account linked and active</div></div></div>
                  {[["ARN","AARN1234567"],["Gateway ID","12 34 56 78 90 12"],["Token status","Active — refreshed 2hr ago"],["Token expires","24 Apr 2026 at 18:42"],["Refresh expires","15 Sep 2026"],["Connected since","15 Mar 2025"],["Fraud headers","Validated"]].map(([k,v],i)=>(<div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderBottom:i<6?`1px solid ${B.borderLight}`:"none" }}><span style={{ fontSize:12, color:B.muted }}>{k}</span><span style={{ fontSize:12, fontWeight:500, fontFamily:k==="ARN"||k==="Gateway ID"?"monospace":"inherit" }}>{v}</span></div>))}
                  <div style={{ display:"flex", gap:8, marginTop:20 }}><button style={{ padding:"8px 16px", borderRadius:8, border:`1px solid ${B.border}`, background:B.white, fontSize:12, fontWeight:500, cursor:"pointer", color:B.text }}>Refresh token</button><button style={{ padding:"8px 16px", borderRadius:8, border:`1px solid ${B.border}`, background:B.white, fontSize:12, fontWeight:500, cursor:"pointer", color:B.text }}>Test fraud headers</button><button style={{ padding:"8px 16px", borderRadius:8, border:"1px solid #FECACA", background:B.redBg, fontSize:12, fontWeight:500, cursor:"pointer", color:B.redText }}>Disconnect</button></div>
                </div></Card>
                <Card><CardHead titleSize={15} padding="16px 20px" title="API subscriptions" /><div style={{ padding:"8px 20px 14px" }}>
                  {[{api:"SA Individual Details v2.0",s:"live"},{api:"Business Details v2.0",s:"live"},{api:"Agent Authorisation v1.0",s:"live"},{api:"Obligations v3.0",s:"live"},{api:"Self-Employment Business v4.0",s:"live"},{api:"Property Business v5.0",s:"live"},{api:"BISS v3.0",s:"live"},{api:"SA Accounts v3.0",s:"live"},{api:"Individual Calculations v8.0",s:"pending"}].map((a,i)=>(<div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:i<8?`1px solid ${B.borderLight}`:"none" }}><span style={{ fontSize:12, fontFamily:"monospace" }}>{a.api}</span><span style={{ fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:10, background:a.s==="live"?B.greenBg:B.amberBg, color:a.s==="live"?B.greenText:B.amberText }}>{a.s==="live"?"Production":"Pending"}</span></div>))}
                </div></Card>
              </div>
            )}

            {section==="team" && (
              <Card><CardHead titleSize={15} padding="16px 20px" title="Team members" /><div style={{ padding:"8px 20px 14px" }}>
                {[{n:"Jane Walker",e:"jane@walkerco.co.uk",r:"Admin",s:"Active",i:"JW"},{n:"Tom Richards",e:"tom@walkerco.co.uk",r:"Accountant",s:"Active",i:"TR"},{n:"Suki Patel",e:"suki@walkerco.co.uk",r:"Bookkeeper",s:"Invited",i:"SP"}].map((m,idx)=>(<div key={idx} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:idx<2?`1px solid ${B.borderLight}`:"none" }}><div style={{ width:38, height:38, borderRadius:19, background:B.blueBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:B.blueText, border:"1px solid #BAE6FD" }}>{m.i}</div><div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600 }}>{m.n}</div><div style={{ fontSize:11, color:B.light }}>{m.e}</div></div><span style={{ fontSize:11, fontWeight:500, color:B.muted, padding:"2px 10px", borderRadius:20, background:B.surface, border:`1px solid ${B.borderLight}` }}>{m.r}</span><span style={{ fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:10, background:m.s==="Active"?B.greenBg:B.amberBg, color:m.s==="Active"?B.greenText:B.amberText }}>{m.s}</span></div>))}
                <div style={{ marginTop:16 }}><button style={{ padding:"8px 16px", borderRadius:8, border:`1px solid ${B.border}`, background:B.white, fontSize:12, fontWeight:500, cursor:"pointer", color:B.text }}>+ Invite team member</button></div>
              </div></Card>
            )}

            {section==="notifications" && (
              <Card><CardHead titleSize={15} padding="16px 20px" title="Notification preferences" sub="Control how and when you receive alerts" /><div style={{ padding:"12px 20px 20px" }}>
                <div style={{ fontSize:12, fontWeight:600, color:B.muted, marginBottom:8, marginTop:4 }}>Chase delivery channels</div>
                <Toggle on={chaseEmail} onChange={setChaseEmail} label="Send client chases via email" />
                <Toggle on={chaseSms} onChange={setChaseSms} label="Send client chases via SMS" />
                <div style={{ fontSize:10, color:B.light, padding:"6px 0 0", borderBottom:`1px solid ${B.borderLight}` }}>Per-client channel overrides are available in the chase manager</div>
                <div style={{ fontSize:12, fontWeight:600, color:B.muted, marginBottom:8, marginTop:20 }}>Agent alerts</div>
                <Toggle on={overdueAlert} onChange={setOverdueAlert} label="Email me when a client obligation becomes overdue" />
                <Toggle on={deadlineReminder} onChange={setDeadlineReminder} label="Email me before upcoming deadlines" />
                <Toggle on={inviteAccepted} onChange={setInviteAccepted} label="Notify me when a client accepts an invitation" isNew />
                <Toggle on={liabilityAlert} onChange={setLiabilityAlert} label="Alert me when a client has overdue HMRC liabilities" isNew />
                <div style={{ marginTop:16 }}><label style={{ fontSize:12, fontWeight:600, color:B.muted, display:"block", marginBottom:5 }}>Remind me this many days before deadline</label><select value={reminderDays} onChange={e=>setReminderDays(e.target.value)} style={{ padding:"8px 12px", borderRadius:8, border:`1px solid ${B.border}`, fontSize:12, background:B.white, cursor:"pointer" }}><option value="7">7 days</option><option value="14">14 days</option><option value="21">21 days</option><option value="30">30 days</option></select></div>
                <div style={{ borderTop:`1px solid ${B.border}`, paddingTop:16, marginTop:20, display:"flex", justifyContent:"flex-end" }}><button style={{ padding:"8px 20px", borderRadius:8, border:"none", background:B.primary, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>Save preferences</button></div>
              </div></Card>
            )}

            {section==="billing" && (
              <Card><CardHead titleSize={15} padding="16px 20px" title="Plan & billing" /><div style={{ padding:"20px" }}>
                <div style={{ padding:"20px", background:B.blueBg, borderRadius:10, border:"1px solid #BAE6FD", marginBottom:20 }}><div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}><div><div style={{ fontSize:11, fontWeight:600, color:B.blueText, letterSpacing:"0.04em" }}>CURRENT PLAN</div><div style={{ fontSize:22, fontWeight:800, color:B.navy, marginTop:4 }}>Agent Portal</div></div><div style={{ textAlign:"right" }}><div style={{ fontSize:24, fontWeight:800, color:B.navy }}>£99<span style={{ fontSize:13, fontWeight:400, color:B.muted }}>/mo</span></div><div style={{ fontSize:12, color:B.blueText }}>+ £3/client/mo</div></div></div></div>
                {[["Clients","12 active (£36/mo)"],["Monthly total","£135/mo"],["Next charge","1 May 2026"],["Payment","Visa ending 4242"]].map(([k,v],i)=>(<div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"9px 0", borderBottom:i<3?`1px solid ${B.borderLight}`:"none" }}><span style={{ fontSize:12, color:B.muted }}>{k}</span><span style={{ fontSize:12, fontWeight:500 }}>{v}</span></div>))}
                <div style={{ marginTop:20, display:"flex", gap:8 }}><button style={{ padding:"8px 16px", borderRadius:8, border:`1px solid ${B.border}`, background:B.white, fontSize:12, fontWeight:500, cursor:"pointer", color:B.text }}>Update payment</button><button style={{ padding:"8px 16px", borderRadius:8, border:`1px solid ${B.border}`, background:B.white, fontSize:12, fontWeight:500, cursor:"pointer", color:B.text }}>View invoices</button></div>
              </div></Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

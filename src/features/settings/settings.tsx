'use client'
import { useState } from "react";

const B = {
  primary: "#0EA5C9", primaryDark: "#0284A8", navy: "#1B2A4A",
  surface: "#F8FAFC", white: "#FFFFFF", border: "#E2E8F0", borderLight: "#F1F5F9",
  text: "#0F172A", muted: "#64748B", light: "#94A3B8", xlight: "#CBD5E1",
  red: "#EF4444", redBg: "#FEF2F2", redText: "#991B1B",
  amber: "#F59E0B", amberBg: "#FFFBEB", amberText: "#92400E",
  green: "#10B981", greenBg: "#ECFDF5", greenText: "#065F46",
  blueBg: "#F0F9FF", blueText: "#0C4A6E",
};

const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => <div style={{ background: B.white, borderRadius: 12, border: `1px solid ${B.border}`, overflow: "hidden", ...style }}>{children}</div>;
const CardHead = ({ title, sub }: { title: string; sub?: string }) => (<div style={{ padding: "16px 20px", borderBottom: `1px solid ${B.border}` }}><div style={{ fontSize: 15, fontWeight: 700 }}>{title}</div>{sub && <div style={{ fontSize: 12, color: B.muted, marginTop: 2 }}>{sub}</div>}</div>);
const Field = ({ label, value, mono }: { label: string; value: string; mono?: boolean }) => (<div style={{ marginBottom: 16 }}><label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: "block", marginBottom: 5 }}>{label}</label><input defaultValue={value} style={{ width: "100%", padding: "9px 14px", borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 13, outline: "none", background: B.white, color: B.text, fontFamily: mono ? "monospace" : "inherit" }} /></div>);

export default function Settings({ navigate = () => {} }: { navigate?: (route: string) => void }) {
  const [activeSection, setActiveSection] = useState("firm");
  const [chaseEmail, setChaseEmail] = useState(true);
  const [chaseSms, setChaseSms] = useState(false);
  const [overdueAlert, setOverdueAlert] = useState(true);
  const [deadlineReminder, setDeadlineReminder] = useState(true);
  const [inviteAccepted, setInviteAccepted] = useState(true);
  const [liabilityAlert, setLiabilityAlert] = useState(true);
  const [reminderDays, setReminderDays] = useState("14");

  const Toggle = ({ on, onChange, label, isNew }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${B.borderLight}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13 }}>{label}</span>
        {isNew && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: B.primary, color: "#fff" }}>NEW</span>}
      </div>
      <div onClick={() => onChange(!on)} style={{ width: 40, height: 22, borderRadius: 11, background: on ? B.primary : B.xlight, cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
        <div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", position: "absolute", top: 2, left: on ? 20 : 2, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }} />
      </div>
    </div>
  );

  const sections = [{ k:"firm",l:"Firm details",i:"⊡" },{ k:"hmrc",l:"HMRC connection",i:"⟷" },{ k:"team",l:"Team members",i:"☷" },{ k:"notifications",l:"Notifications",i:"⊙" },{ k:"billing",l:"Plan & billing",i:"◇" }];

  return (
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 32px", background: B.white, borderBottom: `1px solid ${B.border}`, flexShrink: 0 }}><div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>Settings</div><div style={{ fontSize: 13, color: B.muted, marginTop: 2 }}>Manage your firm, HMRC connection, team, and preferences</div></div>

        <div style={{ padding: "24px 32px", flex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {sections.map(s => (<div key={s.k} onClick={() => setActiveSection(s.k)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, cursor: "pointer", background: activeSection === s.k ? B.white : "transparent", border: `1px solid ${activeSection === s.k ? B.border : "transparent"}`, fontSize: 13, fontWeight: activeSection === s.k ? 600 : 400, color: activeSection === s.k ? B.text : B.muted }}><span style={{ fontSize: 14, opacity: 0.7 }}>{s.i}</span>{s.l}</div>))}
            </div>

            <div>
              {activeSection === "firm" && (
                <Card><CardHead title="Firm details" sub="Your practice information as shown to clients" /><div style={{ padding: "20px" }}><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}><Field label="Firm name" value="Walker & Co Accountants" /><Field label="Primary contact" value="Jane Walker" /><Field label="Email" value="jane@walkerco.co.uk" /><Field label="Phone" value="01234 567890" /><div style={{ gridColumn: "1 / -1" }}><Field label="Address" value="14 High Street, Slough, SL1 1AA" /></div></div><div style={{ borderTop: `1px solid ${B.border}`, paddingTop: 16, marginTop: 8, display: "flex", justifyContent: "flex-end" }}><button style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: B.primary, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save changes</button></div></div></Card>
              )}

              {activeSection === "hmrc" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <Card><CardHead title="HMRC connection status" sub="OAuth 2.0 via Government Gateway — Agent Services Account" /><div style={{ padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, padding: "14px 16px", background: B.greenBg, borderRadius: 10, border: "1px solid #A7F3D0" }}><div style={{ width: 10, height: 10, borderRadius: 5, background: B.green }} /><div><div style={{ fontSize: 13, fontWeight: 700, color: B.greenText }}>Connected to HMRC</div><div style={{ fontSize: 11, color: "#047857" }}>Agent Services Account linked and active</div></div></div>
                    {[["Agent Reference Number (ARN)","AARN1234567"],["Government Gateway ID","12 34 56 78 90 12"],["Access token status","Active — refreshed 2 hours ago"],["Token expires","22 Apr 2026 at 18:42"],["Refresh token expires","15 Sep 2026"],["Connected since","15 Mar 2025"],["Fraud prevention headers","Validated — last checked 22 Apr 2026"]].map(([k,v],i)=>(<div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: i<6?`1px solid ${B.borderLight}`:"none" }}><span style={{ fontSize: 12, color: B.muted }}>{k}</span><span style={{ fontSize: 12, fontWeight: 500, fontFamily: k.includes("ARN")||k.includes("Gateway")?"monospace":"inherit" }}>{v}</span></div>))}
                    <div style={{ display: "flex", gap: 8, marginTop: 20 }}><button style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${B.border}`, background: B.white, fontSize: 12, fontWeight: 500, cursor: "pointer", color: B.text }}>Refresh token now</button><button style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${B.border}`, background: B.white, fontSize: 12, fontWeight: 500, cursor: "pointer", color: B.text }}>Test fraud headers</button><button style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #FECACA", background: B.redBg, fontSize: 12, fontWeight: 500, cursor: "pointer", color: B.redText }}>Disconnect</button></div>
                  </div></Card>
                  <Card><CardHead title="API subscription status" sub="Endpoints approved for production use" /><div style={{ padding: "8px 20px 14px" }}>
                    {[{api:"SA Individual Details (MTD) v2.0",status:"live"},{api:"Business Details (MTD) v2.0",status:"live"},{api:"Agent Authorisation v1.0",status:"live"},{api:"Obligations (MTD) v3.0",status:"live"},{api:"Self-Employment Business (MTD) v4.0",status:"live"},{api:"Property Business (MTD) v5.0",status:"live"},{api:"Business Income Source Summary (MTD) v3.0",status:"live"},{api:"Self Assessment Accounts (MTD) v3.0",status:"live"},{api:"Individual Calculations (MTD) v8.0",status:"pending"}].map((a,i)=>(<div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i<8?`1px solid ${B.borderLight}`:"none" }}><span style={{ fontSize: 12, fontFamily: "monospace" }}>{a.api}</span><span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 10, background: a.status==="live"?B.greenBg:B.amberBg, color: a.status==="live"?B.greenText:B.amberText, border: `1px solid ${a.status==="live"?"#A7F3D0":"#FDE68A"}` }}>{a.status==="live"?"Production":"Stage 2 pending"}</span></div>))}
                  </div></Card>
                </div>
              )}

              {activeSection === "team" && (
                <Card><CardHead title="Team members" sub="People in your firm with access to the NewEffect portal" /><div style={{ padding: "8px 20px 14px" }}>
                  {[{name:"Jane Walker",email:"jane@walkerco.co.uk",role:"Admin",status:"Active",initials:"JW"},{name:"Tom Richards",email:"tom@walkerco.co.uk",role:"Accountant",status:"Active",initials:"TR"},{name:"Suki Patel",email:"suki@walkerco.co.uk",role:"Bookkeeper",status:"Invited",initials:"SP"}].map((m,i)=>(<div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: i<2?`1px solid ${B.borderLight}`:"none" }}><div style={{ width: 38, height: 38, borderRadius: 19, background: B.blueBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: B.blueText, border: "1px solid #BAE6FD" }}>{m.initials}</div><div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div><div style={{ fontSize: 11, color: B.light }}>{m.email}</div></div><span style={{ fontSize: 11, fontWeight: 500, color: B.muted, padding: "2px 10px", borderRadius: 20, background: B.surface, border: `1px solid ${B.borderLight}` }}>{m.role}</span><span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 10, background: m.status==="Active"?B.greenBg:B.amberBg, color: m.status==="Active"?B.greenText:B.amberText }}>{m.status}</span></div>))}
                  <div style={{ marginTop: 16 }}><button style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${B.border}`, background: B.white, fontSize: 12, fontWeight: 500, cursor: "pointer", color: B.text, display: "flex", alignItems: "center", gap: 6 }}><span>+</span> Invite team member</button></div>
                </div></Card>
              )}

              {activeSection === "notifications" && (
                <Card><CardHead title="Notification preferences" sub="Control how and when you receive alerts" /><div style={{ padding: "12px 20px 20px" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: B.muted, marginBottom: 8, marginTop: 4 }}>Chase delivery channels</div>
                  <Toggle on={chaseEmail} onChange={setChaseEmail} label="Send client chases via email" />
                  <Toggle on={chaseSms} onChange={setChaseSms} label="Send client chases via SMS" />

                  <div style={{ fontSize: 12, fontWeight: 600, color: B.muted, marginBottom: 8, marginTop: 20 }}>Agent alerts</div>
                  <Toggle on={overdueAlert} onChange={setOverdueAlert} label="Email me when a client obligation becomes overdue" />
                  <Toggle on={deadlineReminder} onChange={setDeadlineReminder} label="Email me before upcoming deadlines" />
                  <Toggle on={inviteAccepted} onChange={setInviteAccepted} label="Notify me when a client accepts an invitation" isNew />
                  <Toggle on={liabilityAlert} onChange={setLiabilityAlert} label="Alert me when a client has overdue HMRC liabilities" isNew />

                  <div style={{ marginTop: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: B.muted, display: "block", marginBottom: 5 }}>Remind me this many days before deadline</label>
                    <select value={reminderDays} onChange={e => setReminderDays(e.target.value)} style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${B.border}`, fontSize: 12, color: B.text, background: B.white, cursor: "pointer" }}><option value="7">7 days</option><option value="14">14 days</option><option value="21">21 days</option><option value="30">30 days</option></select>
                  </div>
                  <div style={{ borderTop: `1px solid ${B.border}`, paddingTop: 16, marginTop: 20, display: "flex", justifyContent: "flex-end" }}><button style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: B.primary, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Save preferences</button></div>
                </div></Card>
              )}

              {activeSection === "billing" && (
                <Card><CardHead title="Plan & billing" sub="Your current subscription" /><div style={{ padding: "20px" }}>
                  <div style={{ padding: "20px", background: B.blueBg, borderRadius: 10, border: "1px solid #BAE6FD", marginBottom: 20 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 11, fontWeight: 600, color: B.blueText, letterSpacing: "0.04em" }}>CURRENT PLAN</div><div style={{ fontSize: 22, fontWeight: 800, color: B.navy, marginTop: 4 }}>Agent Portal</div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 24, fontWeight: 800, color: B.navy }}>£99<span style={{ fontSize: 13, fontWeight: 400, color: B.muted }}>/mo</span></div><div style={{ fontSize: 12, color: B.blueText }}>+ £3/client/mo</div></div></div></div>
                  {[["Clients","12 active (£36/mo)"],["Monthly total","£135/mo"],["Billing cycle","Monthly — next charge 1 May 2026"],["Payment method","Visa ending 4242"]].map(([k,v],i)=>(<div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: i<3?`1px solid ${B.borderLight}`:"none" }}><span style={{ fontSize: 12, color: B.muted }}>{k}</span><span style={{ fontSize: 12, fontWeight: 500 }}>{v}</span></div>))}
                  <div style={{ marginTop: 20, display: "flex", gap: 8 }}><button style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${B.border}`, background: B.white, fontSize: 12, fontWeight: 500, cursor: "pointer", color: B.text }}>Update payment method</button><button style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${B.border}`, background: B.white, fontSize: 12, fontWeight: 500, cursor: "pointer", color: B.text }}>View invoices</button></div>
                </div></Card>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

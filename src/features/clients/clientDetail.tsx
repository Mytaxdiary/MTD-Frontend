'use client'
import { useState } from "react";
import {
  mockClientQuarters as quarters,
  mockClientLiabilities as liabilities,
  mockPaymentHistory as paymentHistory,
  mockChaseLog as chaseLog,
} from "@/mocks/clients/clientDetailData";

import B from "@/styles/theme";
import { Card, CardHeader } from "@/components/ui/card";

export default function ClientDetail({ navigate = () => {} }: { navigate?: (route: string) => void }) {
  const [activeTab, setActiveTab] = useState("overview");
  const filedQs = quarters.filter(q=>q.status==="filed");
  const totalIncome = filedQs.reduce((s,q)=>s+(q.income||0),0);
  const totalExpenses = filedQs.reduce((s,q)=>s+(q.expenses||0),0);
  const totalOutstanding = liabilities.reduce((s,l)=>s+l.outstanding,0);

  return (
    <div style={{ flex:1, overflow:"auto", display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"12px 32px", background:B.white, borderBottom:`1px solid ${B.border}`, display:"flex", alignItems:"center", gap:8, fontSize:13, flexShrink:0 }}>
        <span style={{ color:B.primary, cursor:"pointer", fontWeight:500 }}>Clients</span><span style={{ color:B.xlight }}>/</span><span style={{ fontWeight:600 }}>Priya Sharma</span>
      </div>

      <div style={{ padding:"24px 32px 20px", background:B.white, borderBottom:`1px solid ${B.border}`, flexShrink:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div style={{ display:"flex", gap:16, alignItems:"center" }}>
            <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#E0F2FE,#BAE6FD)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, color:B.blueText }}>PS</div>
            <div>
              <div style={{ fontSize:22, fontWeight:700, letterSpacing:"-0.02em" }}>Priya Sharma</div>
              <div style={{ display:"flex", gap:12, alignItems:"center", marginTop:4, flexWrap:"wrap" }}>
                <span style={{ fontSize:13, color:B.muted }}>Sharma Design Studio</span>
                <span style={{ width:4, height:4, borderRadius:2, background:B.xlight }} />
                <span style={{ fontSize:12, color:B.muted }}>Self-employment</span>
                <span style={{ width:4, height:4, borderRadius:2, background:B.xlight }} />
                <span style={{ fontSize:11, fontWeight:600, padding:"2px 10px", borderRadius:20, background:B.greenBg, color:B.greenText, border:"1px solid #A7F3D0" }}>MTD Mandated</span>
                <span style={{ fontSize:11, fontWeight:600, padding:"2px 10px", borderRadius:20, background:B.blueBg, color:B.blueText, border:"1px solid #BAE6FD" }}>Main agent</span>
              </div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button style={{ padding:"8px 16px", borderRadius:8, border:`1px solid ${B.border}`, background:B.white, fontSize:12, fontWeight:500, cursor:"pointer", color:B.text }}>Chase client</button>
            <button style={{ padding:"8px 16px", borderRadius:8, border:`1px solid ${B.border}`, background:B.white, fontSize:12, fontWeight:500, cursor:"pointer", color:B.text }}>Message client</button>
            <button style={{ padding:"8px 16px", borderRadius:8, border:"none", background:B.primary, color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer" }}>View client portal</button>
          </div>
        </div>
        <div style={{ display:"flex", gap:0, marginTop:20 }}>
          {["overview","liabilities","chasing","notes"].map(tab=>(
            <button key={tab} onClick={()=>setActiveTab(tab)} style={{ padding:"8px 20px", fontSize:13, fontWeight:500, cursor:"pointer", border:"none", background:"transparent", color:activeTab===tab?B.primary:B.muted, borderBottom:`2px solid ${activeTab===tab?B.primary:"transparent"}`, textTransform:"capitalize" }}>{tab}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:"24px 32px", flex:1 }}>
        {/* Summary strip */}
        <div style={{ display:"flex", gap:12, marginBottom:24 }}>
          {[
            { label:"Submitted income (YTD)", value:`£${totalIncome.toLocaleString()}`, sub:`${filedQs.length} of 4 quarters filed`, color:B.green },
            { label:"Submitted expenses (YTD)", value:`£${totalExpenses.toLocaleString()}`, sub:"From filed quarters", color:B.amber },
            { label:"Submitted net profit", value:`£${(totalIncome-totalExpenses).toLocaleString()}`, sub:"As reported to HMRC", color:B.primary },
            { label:"Outstanding to HMRC", value:`£${totalOutstanding.toLocaleString()}`, sub:totalOutstanding>0?"Payment due":"All clear", color:totalOutstanding>0?B.red:B.green },
          ].map((m,i)=>(
            <div key={i} style={{ flex:1, background:B.white, borderRadius:10, padding:"14px 16px", border:`1px solid ${B.border}`, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:m.color }} />
              <div style={{ fontSize:11, fontWeight:500, color:B.muted, letterSpacing:"0.02em" }}>{m.label}</div>
              <div style={{ fontSize:22, fontWeight:700, letterSpacing:"-0.02em", marginTop:3 }}>{m.value}</div>
              <div style={{ fontSize:11, color:B.light, marginTop:2 }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {activeTab === "overview" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              {/* Submission history — read-only, not filing */}
              <Card>
                <CardHeader title="Submission history — 2025-26" right={<span style={{ fontSize:11, color:B.light }}>Read-only — filed via your accounting software</span>} />
                <div style={{ padding:"16px 20px" }}>
                  {quarters.map((q,i)=>(
                    <div key={i} style={{ display:"flex", alignItems:"stretch" }}>
                      <div style={{ width:32, display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                        <div style={{ width:12, height:12, borderRadius:6, flexShrink:0, background:q.status==="filed"?B.green:B.light, border:`2px solid ${B.white}`, boxShadow:`0 0 0 2px ${q.status==="filed"?"#A7F3D0":B.borderLight}` }} />
                        {i<quarters.length-1 && <div style={{ width:2, flex:1, background:B.borderLight, minHeight:40 }} />}
                      </div>
                      <div style={{ flex:1, paddingBottom:20, paddingLeft:12 }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <div><span style={{ fontSize:14, fontWeight:700 }}>{q.q}</span><span style={{ fontSize:12, color:B.muted, marginLeft:10 }}>{q.period}</span></div>
                          {q.status==="filed" && <span style={{ fontSize:11, fontWeight:600, padding:"2px 10px", borderRadius:20, background:B.greenBg, color:B.greenText, border:"1px solid #A7F3D0" }}>Submitted {q.filed}</span>}
                          {q.status==="pending" && <span style={{ fontSize:11, fontWeight:600, padding:"2px 10px", borderRadius:20, background:B.surface, color:B.light, border:`1px solid ${B.borderLight}` }}>Awaiting submission</span>}
                        </div>
                        {q.status === "filed" && (
                          <div style={{ display:"flex", gap:24, marginTop:8, fontSize:12, color:B.muted }}>
                            <span>Due: <b style={{ color:B.text }}>{q.due}</b></span>
                            <span>Income: <b style={{ color:B.text }}>£{(q.income||0).toLocaleString()}</b></span>
                            <span>Expenses: <b style={{ color:B.text }}>£{(q.expenses||0).toLocaleString()}</b></span>
                            <span>Net: <b style={{ color:B.text }}>£{((q.income||0)-(q.expenses||0)).toLocaleString()}</b></span>
                          </div>
                        )}
                        {q.status === "pending" && (
                          <div style={{ marginTop:8, fontSize:12, color:B.light }}>Due: {q.due} — no data submitted yet</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Cumulative submitted figures */}
              <Card>
                <CardHeader title="Cumulative submitted figures" right={<span style={{ fontSize:11, color:B.light }}>As reported to HMRC across filed quarters</span>} />
                <div style={{ padding:"16px 20px" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:16 }}>
                    {filedQs.map(q=>(
                      <div key={q.q} style={{ padding:"12px", background:B.surface, borderRadius:8, border:`1px solid ${B.borderLight}` }}>
                        <div style={{ fontSize:11, fontWeight:600, color:B.muted, marginBottom:6 }}>{q.q} — {q.filed}</div>
                        <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3 }}><span style={{ color:B.muted }}>Income</span><span style={{ fontWeight:600, fontVariantNumeric:"tabular-nums" }}>£{(q.income||0).toLocaleString()}</span></div>
                        <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:3 }}><span style={{ color:B.muted }}>Expenses</span><span style={{ fontWeight:600, fontVariantNumeric:"tabular-nums" }}>£{(q.expenses||0).toLocaleString()}</span></div>
                        <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, borderTop:`1px solid ${B.borderLight}`, paddingTop:4 }}><span style={{ fontWeight:600 }}>Net</span><span style={{ fontWeight:700, fontVariantNumeric:"tabular-nums", color:B.greenText }}>£{((q.income||0)-(q.expenses||0)).toLocaleString()}</span></div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding:"14px 16px", background:B.navy, borderRadius:10, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)" }}>CUMULATIVE NET PROFIT (SUBMITTED TO HMRC)</div>
                      <div style={{ fontSize:24, fontWeight:800, color:"#fff", marginTop:4 }}>£{(totalIncome-totalExpenses).toLocaleString()}</div>
                    </div>
                    <div style={{ display:"flex", gap:24 }}>
                      <div style={{ textAlign:"right" }}><div style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>Income</div><div style={{ fontSize:14, fontWeight:700, color:"rgba(255,255,255,0.9)", fontVariantNumeric:"tabular-nums" }}>£{totalIncome.toLocaleString()}</div></div>
                      <div style={{ width:1, background:"rgba(255,255,255,0.1)" }} />
                      <div style={{ textAlign:"right" }}><div style={{ fontSize:10, color:"rgba(255,255,255,0.4)" }}>Expenses</div><div style={{ fontSize:14, fontWeight:700, color:"rgba(255,255,255,0.9)", fontVariantNumeric:"tabular-nums" }}>£{totalExpenses.toLocaleString()}</div></div>
                    </div>
                  </div>
                  <div style={{ marginTop:12, padding:"10px 14px", background:B.purpleBg, borderRadius:8, border:"1px solid #DDD6FE", display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ fontSize:12, color:B.purpleText }}>Predictive tax liability will be available when Dashanalytix integration is live</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right column */}
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <Card>
                <CardHeader title="Client details" />
                <div style={{ padding:"12px 20px" }}>
                  {[["NINO","QQ 12 34 56 C"],["UTR","12345 67890"],["Business ID","XAIS12345678901"],["Trading name","Sharma Design Studio"],["Quarterly type","Standard"],["Accounting period","6 Apr – 5 Apr"],["Agent type","Main agent"],["Authorised since","15 Mar 2025"]].map(([k,v],i)=>(
                    <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:i<7?`1px solid ${B.borderLight}`:"none" }}><span style={{ fontSize:12, color:B.muted }}>{k}</span><span style={{ fontSize:12, fontWeight:500, fontFamily:["NINO","UTR","Business ID"].includes(k)?"monospace":"inherit" }}>{v}</span></div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardHeader title="HMRC payment details" />
                <div style={{ padding:"12px 20px" }}>
                  <div style={{ padding:"14px", background:B.blueBg, borderRadius:8, border:"1px solid #BAE6FD", marginBottom:10 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:B.blueText, marginBottom:8 }}>Pay by bank transfer</div>
                    {[["Sort code","08-32-10"],["Account number","12001039"],["Reference","12345 67890"]].map(([k,v],i)=>(<div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0" }}><span style={{ fontSize:12, color:"#0369A1" }}>{k}</span><span style={{ fontSize:13, fontWeight:700, fontFamily:"monospace", color:B.blueText }}>{v}</span></div>))}
                  </div>
                  <a href="#" style={{ fontSize:11, color:B.primary, textDecoration:"none" }}>Pay online at gov.uk →</a>
                </div>
              </Card>

              <Card>
                <CardHeader title="Chase history" right={<button style={{ fontSize:11, fontWeight:600, padding:"4px 12px", borderRadius:6, border:`1px solid ${B.border}`, background:"transparent", cursor:"pointer", color:B.muted }}>Send chase</button>} />
                <div style={{ padding:"4px 20px 12px" }}>
                  {chaseLog.map((c,i)=>(
                    <div key={i} style={{ padding:"10px 0", borderBottom:i<chaseLog.length-1?`1px solid ${B.borderLight}`:"none" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}><span style={{ width:20, height:20, borderRadius:4, background:B.blueBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:B.blueText }}>@</span><span style={{ fontSize:12, fontWeight:500 }}>{c.msg}</span></div>
                        <span style={{ fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:10, background:c.status==="Responded"?B.greenBg:B.amberBg, color:c.status==="Responded"?B.greenText:B.amberText }}>{c.status}</span>
                      </div>
                      <div style={{ fontSize:11, color:B.light, marginTop:3, paddingLeft:28 }}>{c.date}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardHeader title="Accountant notes" />
                <div style={{ padding:"12px 20px" }}>
                  <div style={{ padding:12, background:B.surface, borderRadius:8, fontSize:12, color:B.muted, lineHeight:1.6, border:`1px solid ${B.borderLight}` }}>
                    Client uses Xero for bookkeeping. Submits own Q updates via Xero — we monitor and chase. 2nd POA due 31 Jul — remind client. May exceed £90k next year.
                  </div>
                  <div style={{ fontSize:10, color:B.light, marginTop:6 }}>Last edited 22 Apr 2026 by Jane Walker</div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "liabilities" && (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:20 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <Card><CardHeader title="HMRC liabilities" right={<span style={{ fontSize:12, color:B.muted }}>Source: SA Accounts API</span>} />
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}><thead><tr style={{ borderBottom:`1px solid ${B.border}` }}>{["Description","Due date","Original","Outstanding","Interest","Status"].map((h,i)=>(<th key={i} style={{ padding:"10px 16px", textAlign:i>=2&&i<=4?"right":"left", fontSize:11, fontWeight:600, color:B.light }}>{h}</th>))}</tr></thead>
                  <tbody>{liabilities.map((l,i)=>(<tr key={i} style={{ borderBottom:`1px solid ${B.borderLight}`, background:i%2===1?"#FAFBFC":"transparent" }}><td style={{ padding:"12px 16px", fontWeight:500 }}>{l.desc}</td><td style={{ padding:"12px 16px", color:B.muted }}>{l.due}</td><td style={{ padding:"12px 16px", textAlign:"right", fontVariantNumeric:"tabular-nums" }}>£{l.original.toLocaleString()}</td><td style={{ padding:"12px 16px", textAlign:"right", fontVariantNumeric:"tabular-nums", fontWeight:600, color:l.outstanding>0?B.text:B.light }}>{l.outstanding>0?`£${l.outstanding.toLocaleString()}`:"—"}</td><td style={{ padding:"12px 16px", textAlign:"right", color:B.light }}>—</td><td style={{ padding:"12px 16px" }}><span style={{ fontSize:11, fontWeight:600, padding:"2px 10px", borderRadius:20, background:l.status==="paid"?B.greenBg:B.amberBg, color:l.status==="paid"?B.greenText:B.amberText, border:`1px solid ${l.status==="paid"?"#A7F3D0":"#FDE68A"}` }}>{l.status==="paid"?"Paid":"Upcoming"}</span></td></tr>))}</tbody>
                </table>
              </Card>
              <Card><CardHeader title="Payment history" />
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}><thead><tr style={{ borderBottom:`1px solid ${B.border}` }}>{["Date","Amount","Reference","Method"].map((h,i)=>(<th key={i} style={{ padding:"10px 16px", textAlign:i===1?"right":"left", fontSize:11, fontWeight:600, color:B.light }}>{h}</th>))}</tr></thead>
                  <tbody>{paymentHistory.map((p,i)=>(<tr key={i} style={{ borderBottom:`1px solid ${B.borderLight}` }}><td style={{ padding:"12px 16px" }}>{p.date}</td><td style={{ padding:"12px 16px", textAlign:"right", fontWeight:600, fontVariantNumeric:"tabular-nums", color:B.greenText }}>£{p.amount.toLocaleString()}</td><td style={{ padding:"12px 16px", fontFamily:"monospace", fontSize:11, color:B.muted }}>{p.ref}</td><td style={{ padding:"12px 16px", color:B.muted }}>{p.method}</td></tr>))}</tbody>
                </table>
              </Card>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <Card><CardHeader title="HMRC payment details" /><div style={{ padding:"12px 20px" }}><div style={{ padding:"14px", background:B.blueBg, borderRadius:8, border:"1px solid #BAE6FD" }}><div style={{ fontSize:11, fontWeight:600, color:B.blueText, marginBottom:8 }}>Pay by bank transfer</div>{[["Sort code","08-32-10"],["Account number","12001039"],["Reference","12345 67890"]].map(([k,v],i)=>(<div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0" }}><span style={{ fontSize:12, color:"#0369A1" }}>{k}</span><span style={{ fontSize:13, fontWeight:700, fontFamily:"monospace", color:B.blueText }}>{v}</span></div>))}</div></div></Card>
              <Card><CardHeader title="Send to client" /><div style={{ padding:"14px 20px" }}><div style={{ fontSize:12, color:B.muted, lineHeight:1.6, marginBottom:12 }}>Send liability summary and payment details to the client&#39;s portal.</div><button style={{ width:"100%", padding:"10px", borderRadius:8, border:"none", background:B.primary, color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer" }}>Message client with payment details</button></div></Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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

const allClients = [
  { id:1, name:"Sarah Mitchell", business:"Mitchell Consulting", type:"SE", mtd:"Mandated", deadline:"7 Apr 2026", filing:"overdue", chase:"No response", agentType:"Main", income:68000 },
  { id:2, name:"James Cooper", business:"Cooper Properties", type:"Prop", mtd:"Mandated", deadline:"7 Apr 2026", filing:"overdue", chase:"No response", agentType:"Main", income:52000 },
  { id:3, name:"Priya Sharma", business:"Sharma Design Studio", type:"SE", mtd:"Mandated", deadline:"7 May 2026", filing:"ready", chase:"Records received", agentType:"Main", income:52000 },
  { id:4, name:"Tom Grant", business:"Grant Rentals", type:"Prop", mtd:"Mandated", deadline:"7 May 2026", filing:"due-soon", chase:"Chased 3d ago", agentType:"Main", income:44000 },
  { id:5, name:"David Okafor", business:"Okafor Plumbing", type:"SE", mtd:"Mandated", deadline:"—", filing:"filed", chase:"Complete", agentType:"Main", income:71000 },
  { id:6, name:"Rebecca Hall", business:"Hall Interiors", type:"SE", mtd:"Mandated", deadline:"—", filing:"filed", chase:"Complete", agentType:"Main", income:58000 },
  { id:7, name:"Marcus Chen", business:"Chen Photography", type:"SE", mtd:"Voluntary", deadline:"7 May 2026", filing:"due-soon", chase:"Not started", agentType:"Supporting", income:28000 },
  { id:8, name:"Aisha Patel", business:"Patel Tutoring", type:"SE", mtd:"Mandated", deadline:"—", filing:"pending", chase:"Invite sent", agentType:"—", income:0 },
  { id:9, name:"George Whitfield", business:"Whitfield Electricals", type:"SE", mtd:"Mandated", deadline:"7 May 2026", filing:"due-soon", chase:"Chased 7d ago", agentType:"Main", income:62000 },
  { id:10, name:"Fatima Al-Rashid", business:"Al-Rashid Catering", type:"SE", mtd:"Mandated", deadline:"—", filing:"filed", chase:"Complete", agentType:"Main", income:89000 },
  { id:11, name:"Oliver Stone", business:"Stone Lettings", type:"Prop", mtd:"Voluntary", deadline:"7 May 2026", filing:"due-soon", chase:"Not started", agentType:"Main", income:31000 },
  { id:12, name:"Nina Kowalski", business:"Kowalski Translations", type:"SE", mtd:"Mandated", deadline:"—", filing:"filed", chase:"Complete", agentType:"Main", income:54000 },
];

const Badge = ({ status }) => {
  const m = { overdue:{bg:B.redBg,c:B.redText,b:"#FECACA",l:"Overdue"}, "due-soon":{bg:B.amberBg,c:B.amberText,b:"#FDE68A",l:"Due soon"}, ready:{bg:B.greenBg,c:B.greenText,b:"#A7F3D0",l:"Records ready"}, filed:{bg:B.greenBg,c:B.greenText,b:"#A7F3D0",l:"Submitted"}, pending:{bg:B.purpleBg,c:B.purpleText,b:"#DDD6FE",l:"Pending invite"} };
  const s = m[status]||m.filed;
  return <span style={{ fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, background:s.bg, color:s.c, border:`1px solid ${s.b}`, whiteSpace:"nowrap" }}>{s.l}</span>;
};

const NavItem = ({ label, active, icon, count }) => (
  <div style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 14px", borderRadius:8, cursor:"pointer", background:active?"rgba(14,165,201,0.12)":"transparent", color:active?B.primary:"rgba(255,255,255,0.65)", fontSize:13, fontWeight:active?600:400, marginBottom:2 }}>
    <span style={{ fontSize:15, opacity:active?1:0.6 }}>{icon}</span><span style={{ flex:1 }}>{label}</span>
    {count>0 && <span style={{ fontSize:10, fontWeight:700, background:B.red, color:"#fff", borderRadius:10, padding:"1px 7px" }}>{count}</span>}
  </div>
);

const defaultCols = { type:true, mtd:true, deadline:true, filing:true, chase:true, income:false };

export default function ClientList() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortCol, setSortCol] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [selected, setSelected] = useState(new Set());
  const [cols, setCols] = useState(defaultCols);
  const [showColPicker, setShowColPicker] = useState(false);

  let filtered = allClients.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.business.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    if (statusFilter !== "all" && c.filing !== statusFilter) return false;
    return true;
  });
  filtered = [...filtered].sort((a,b) => { let va=a[sortCol],vb=b[sortCol]; if(typeof va==="string"){va=va.toLowerCase();vb=vb.toLowerCase()} if(va<vb) return sortDir==="asc"?-1:1; if(va>vb) return sortDir==="asc"?1:-1; return 0 });
  const toggleSort = (col) => { if(sortCol===col) setSortDir(d=>d==="asc"?"desc":"asc"); else {setSortCol(col);setSortDir("asc")} };
  const toggleSelect = (id) => setSelected(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n});
  const toggleAll = () => setSelected(p=>p.size===filtered.length?new Set():new Set(filtered.map(c=>c.id)));
  const SortIcon = ({col}) => <span style={{fontSize:10,marginLeft:4,opacity:sortCol===col?1:0.3}}>{sortCol===col&&sortDir==="desc"?"▼":"▲"}</span>;

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
          <NavItem label="Dashboard" icon="⊞" /><NavItem label="Clients" active icon="⊡" /><NavItem label="Chase manager" icon="↗" count={2} />
          <div style={{ fontSize:10, fontWeight:600, color:"rgba(255,255,255,0.3)", letterSpacing:"0.08em", padding:"0 14px", marginTop:24, marginBottom:8 }}>MANAGE</div>
          <NavItem label="Add client" icon="+" /><NavItem label="Settings" icon="⚙" /><NavItem label="HMRC connection" icon="⟷" />
        </div>
        <div style={{ padding:"16px", borderTop:"1px solid rgba(255,255,255,0.08)" }}><div style={{ display:"flex", alignItems:"center", gap:10 }}><div style={{ width:32, height:32, borderRadius:20, background:"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.7)" }}>JW</div><div><div style={{ fontSize:12, fontWeight:600, color:"rgba(255,255,255,0.85)" }}>Jane Walker</div><div style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>Walker & Co</div></div></div></div>
      </div>

      <div style={{ flex:1, overflow:"auto", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"16px 32px", background:B.white, borderBottom:`1px solid ${B.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <div><div style={{ fontSize:20, fontWeight:700 }}>Clients</div><div style={{ fontSize:13, color:B.muted, marginTop:2 }}>{allClients.length} clients — {allClients.filter(c=>c.filing!=="pending").length} authorised, {allClients.filter(c=>c.filing==="pending").length} pending</div></div>
          <button style={{ padding:"8px 16px", borderRadius:8, border:"none", background:B.primary, color:"#fff", fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add client</button>
        </div>

        <div style={{ padding:"20px 32px", flex:1 }}>
          <div style={{ display:"flex", gap:10, marginBottom:14, alignItems:"center", flexWrap:"wrap" }}>
            <div style={{ position:"relative", flex:1, maxWidth:280 }}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clients..." style={{ width:"100%", padding:"8px 14px 8px 34px", borderRadius:8, border:`1px solid ${B.border}`, fontSize:13, outline:"none", background:B.white, color:B.text }} />
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:14, color:B.light }}>⌕</span>
            </div>
            <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} style={{ padding:"8px 10px", borderRadius:8, border:`1px solid ${B.border}`, fontSize:12, color:B.text, background:B.white, cursor:"pointer" }}>
              <option value="all">All types</option><option value="SE">Self-employment</option><option value="Prop">UK Property</option>
            </select>
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{ padding:"8px 10px", borderRadius:8, border:`1px solid ${B.border}`, fontSize:12, color:B.text, background:B.white, cursor:"pointer" }}>
              <option value="all">All statuses</option><option value="overdue">Overdue</option><option value="due-soon">Due soon</option><option value="ready">Records ready</option><option value="filed">Submitted</option><option value="pending">Pending invite</option>
            </select>
            <div style={{ marginLeft:"auto", display:"flex", gap:6, alignItems:"center" }}>
              {selected.size>0 && <><span style={{ fontSize:12, color:B.muted }}>{selected.size} selected</span><button style={{ padding:"6px 14px", borderRadius:6, border:"none", background:B.navy, color:"#fff", fontSize:11, fontWeight:600, cursor:"pointer" }}>Chase selected</button><button onClick={()=>setSelected(new Set())} style={{ padding:"6px 8px", borderRadius:6, border:`1px solid ${B.border}`, background:"transparent", fontSize:11, cursor:"pointer", color:B.muted }}>Clear</button></>}
              <button style={{ padding:"6px 10px", borderRadius:6, border:`1px solid ${B.border}`, fontSize:11, cursor:"pointer", background:B.white, color:B.muted }}>Export CSV</button>
              <button style={{ padding:"6px 10px", borderRadius:6, border:`1px solid ${B.border}`, fontSize:11, cursor:"pointer", background:B.white, color:B.muted }}>Export PDF</button>
              <div style={{ position:"relative" }}>
                <button onClick={()=>setShowColPicker(!showColPicker)} style={{ padding:"6px 10px", borderRadius:6, border:`1px solid ${showColPicker?B.primary:B.border}`, fontSize:11, cursor:"pointer", background:showColPicker?B.blueBg:B.white, color:showColPicker?B.blueText:B.muted }}>Columns ▾</button>
                {showColPicker && (
                  <div style={{ position:"absolute", right:0, top:"100%", marginTop:4, background:B.white, borderRadius:8, border:`1px solid ${B.border}`, padding:"8px 0", zIndex:10, width:180, boxShadow:"0 4px 12px rgba(0,0,0,0.08)" }}>
                    {[["type","Business type"],["mtd","MTD status"],["deadline","Next deadline"],["filing","Filing status"],["chase","Chase status"],["income","YTD income"]].map(([k,l])=>(
                      <label key={k} style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 14px", fontSize:12, cursor:"pointer", color:B.text }}>
                        <input type="checkbox" checked={cols[k]} onChange={()=>setCols({...cols,[k]:!cols[k]})} style={{ accentColor:B.primary }} />{l}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ background:B.white, borderRadius:12, border:`1px solid ${B.border}`, overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead><tr style={{ borderBottom:`1px solid ${B.border}` }}>
                <th style={{ padding:"10px 16px", width:36 }}><input type="checkbox" checked={selected.size===filtered.length&&filtered.length>0} onChange={toggleAll} style={{ cursor:"pointer", accentColor:B.primary }} /></th>
                <th onClick={()=>toggleSort("name")} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:B.light, letterSpacing:"0.04em", cursor:"pointer" }}>Client<SortIcon col="name" /></th>
                {cols.type && <th onClick={()=>toggleSort("type")} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:B.light, cursor:"pointer" }}>Type<SortIcon col="type" /></th>}
                {cols.mtd && <th style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:B.light }}>MTD</th>}
                {cols.deadline && <th onClick={()=>toggleSort("deadline")} style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:B.light, cursor:"pointer" }}>Deadline<SortIcon col="deadline" /></th>}
                {cols.filing && <th style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:B.light }}>Status</th>}
                {cols.chase && <th style={{ padding:"10px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:B.light }}>Chase</th>}
                {cols.income && <th onClick={()=>toggleSort("income")} style={{ padding:"10px 14px", textAlign:"right", fontSize:11, fontWeight:600, color:B.light, cursor:"pointer" }}>YTD income<SortIcon col="income" /></th>}
              </tr></thead>
              <tbody>
                {filtered.map((c,i)=>(
                  <tr key={c.id} style={{ borderBottom:`1px solid ${B.borderLight}`, background:selected.has(c.id)?"#F0F9FF":i%2===1?"#FAFBFC":"transparent", cursor:"pointer" }}>
                    <td style={{ padding:"10px 16px" }}><input type="checkbox" checked={selected.has(c.id)} onChange={()=>toggleSelect(c.id)} style={{ cursor:"pointer", accentColor:B.primary }} /></td>
                    <td style={{ padding:"10px 14px" }}><div style={{ fontWeight:600, fontSize:13 }}>{c.name}</div><div style={{ fontSize:11, color:B.light, marginTop:1 }}>{c.business}</div></td>
                    {cols.type && <td style={{ padding:"10px 14px", color:B.muted, fontSize:12 }}>{c.type==="SE"?"Self-employment":"UK Property"}</td>}
                    {cols.mtd && <td style={{ padding:"10px 14px" }}><span style={{ fontSize:11, fontWeight:600, padding:"2px 9px", borderRadius:20, background:c.mtd==="Mandated"?B.greenBg:B.blueBg, color:c.mtd==="Mandated"?B.greenText:B.blueText, border:`1px solid ${c.mtd==="Mandated"?"#A7F3D0":"#BAE6FD"}` }}>{c.mtd}</span></td>}
                    {cols.deadline && <td style={{ padding:"10px 14px", fontSize:12 }}>{c.deadline}</td>}
                    {cols.filing && <td style={{ padding:"10px 14px" }}><Badge status={c.filing} /></td>}
                    {cols.chase && <td style={{ padding:"10px 14px", fontSize:12, color:c.chase==="Complete"?B.greenText:B.muted }}>{c.chase}</td>}
                    {cols.income && <td style={{ padding:"10px 14px", textAlign:"right", fontVariantNumeric:"tabular-nums", fontWeight:500, fontSize:12 }}>{c.income>0?`£${c.income.toLocaleString()}`:"—"}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding:"12px 20px", borderTop:`1px solid ${B.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:12, color:B.muted }}>
              <span>Showing {filtered.length} of {allClients.length} clients</span>
              {cols.income && <span>Total YTD income: <b style={{ color:B.text }}>£{filtered.reduce((s,c)=>s+c.income,0).toLocaleString()}</b></span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type DashboardClient = {
  id: number;
  name: string;
  business: string;
  type: string[];
  status: string;
  stage: string;
  q: string;
  deadline: string;
  daysLeft: number;
  chase: string;
  records: boolean;
  balance: number;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
};

export type KanbanCol = {
  key: string;
  label: string;
  color: string;
  bg: string;
};

export const mockDashboardClients: DashboardClient[] = [
  { id:1,  name:"Sarah Mitchell",  business:"Mitchell Consulting",    type:["SE"],         status:"overdue",        stage:"chased",      q:"Q3", deadline:"7 Feb 2026", daysLeft:-77, chase:"No response",      records:false, balance:2400, q1:"filed", q2:"filed", q3:"overdue", q4:"pending" },
  { id:2,  name:"James Cooper",    business:"Cooper Properties",      type:["Prop"],       status:"overdue",        stage:"chased",      q:"Q3", deadline:"7 Feb 2026", daysLeft:-77, chase:"Opened email",     records:false, balance:0,    q1:"filed", q2:"filed", q3:"overdue", q4:"pending" },
  { id:3,  name:"Priya Sharma",    business:"Sharma Design Studio",   type:["SE"],         status:"due-soon",       stage:"received",    q:"Q4", deadline:"7 May 2026", daysLeft:13,  chase:"Records received", records:true,  balance:3620, q1:"filed", q2:"filed", q3:"filed",   q4:"ready"   },
  { id:4,  name:"Tom Grant",       business:"Grant Rentals",          type:["SE","Prop"],  status:"due-soon",       stage:"chased",      q:"Q4", deadline:"7 May 2026", daysLeft:13,  chase:"Chased 3d ago",    records:false, balance:1800, q1:"filed", q2:"filed", q3:"filed",   q4:"pending" },
  { id:5,  name:"David Okafor",    business:"Okafor Plumbing",        type:["SE"],         status:"filed",          stage:"submitted",   q:"Q4", deadline:"—",          daysLeft:0,   chase:"Complete",         records:true,  balance:0,    q1:"filed", q2:"filed", q3:"filed",   q4:"filed"   },
  { id:6,  name:"Rebecca Hall",    business:"Hall Interiors",         type:["SE"],         status:"filed",          stage:"submitted",   q:"Q4", deadline:"—",          daysLeft:0,   chase:"Complete",         records:true,  balance:0,    q1:"filed", q2:"filed", q3:"filed",   q4:"filed"   },
  { id:7,  name:"Marcus Chen",     business:"Chen Photography",       type:["SE"],         status:"due-soon",       stage:"not-started", q:"Q4", deadline:"7 May 2026", daysLeft:13,  chase:"Not started",      records:false, balance:950,  q1:"filed", q2:"filed", q3:"filed",   q4:"pending" },
  { id:8,  name:"George Whitfield",business:"Whitfield Electricals",  type:["SE","Prop"],  status:"due-soon",       stage:"chased",      q:"Q4", deadline:"7 May 2026", daysLeft:13,  chase:"Chased 7d ago",    records:false, balance:0,    q1:"filed", q2:"filed", q3:"overdue", q4:"pending" },
  { id:9,  name:"Fatima Al-Rashid",business:"Al-Rashid Catering",     type:["SE"],         status:"filed",          stage:"submitted",   q:"Q4", deadline:"—",          daysLeft:0,   chase:"Complete",         records:true,  balance:0,    q1:"filed", q2:"filed", q3:"filed",   q4:"filed"   },
  { id:10, name:"Oliver Stone",    business:"Stone Lettings",         type:["Prop"],       status:"due-soon",       stage:"not-started", q:"Q4", deadline:"7 May 2026", daysLeft:13,  chase:"Not started",      records:false, balance:0,    q1:"filed", q2:"filed", q3:"filed",   q4:"pending" },
  { id:11, name:"Aisha Patel",     business:"Patel Tutoring",         type:["SE"],         status:"pending-invite", stage:"not-started", q:"—",  deadline:"—",          daysLeft:0,   chase:"Invite sent",      records:false, balance:0,    q1:"—",     q2:"—",     q3:"—",       q4:"—"       },
];

export const mockKanbanCols: KanbanCol[] = [
  { key:"not-started", label:"Not started",      color:"#94A3B8", bg:"#F8FAFC" },
  { key:"chased",      label:"Chased",            color:"#F59E0B", bg:"#FFFDF7" },
  { key:"received",    label:"Records received",  color:"#0EA5C9", bg:"#F0FAFE" },
  { key:"submitted",   label:"Submitted",         color:"#10B981", bg:"#F0FDF8" },
];

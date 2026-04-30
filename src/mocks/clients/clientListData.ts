export type ClientListItem = {
  id: number;
  name: string;
  business: string;
  type: string[];
  mtd: string;
  deadline: string;
  filing: string;
  chase: string;
  agentType: string;
  income: number;
};

export const mockClientList: ClientListItem[] = [
  { id:1,  name:"Sarah Mitchell",  business:"Mitchell Consulting",   type:["SE"],        mtd:"Mandated",  deadline:"7 Feb 2026", filing:"overdue",  chase:"No response",     agentType:"Main",      income:68000 },
  { id:2,  name:"James Cooper",    business:"Cooper Properties",     type:["Prop"],      mtd:"Mandated",  deadline:"7 Feb 2026", filing:"overdue",  chase:"No response",     agentType:"Main",      income:52000 },
  { id:3,  name:"Priya Sharma",    business:"Sharma Design Studio",  type:["SE"],        mtd:"Mandated",  deadline:"7 May 2026", filing:"ready",    chase:"Records received",agentType:"Main",      income:52000 },
  { id:4,  name:"Tom Grant",       business:"Grant Rentals",         type:["SE","Prop"], mtd:"Mandated",  deadline:"7 May 2026", filing:"due-soon", chase:"Chased 3d ago",   agentType:"Main",      income:44000 },
  { id:5,  name:"David Okafor",    business:"Okafor Plumbing",       type:["SE"],        mtd:"Mandated",  deadline:"—",          filing:"filed",    chase:"Complete",        agentType:"Main",      income:71000 },
  { id:6,  name:"Rebecca Hall",    business:"Hall Interiors",        type:["SE"],        mtd:"Mandated",  deadline:"—",          filing:"filed",    chase:"Complete",        agentType:"Main",      income:58000 },
  { id:7,  name:"Marcus Chen",     business:"Chen Photography",      type:["SE"],        mtd:"Voluntary", deadline:"7 May 2026", filing:"due-soon", chase:"Not started",     agentType:"Supporting",income:28000 },
  { id:8,  name:"Aisha Patel",     business:"Patel Tutoring",        type:["SE"],        mtd:"Mandated",  deadline:"—",          filing:"pending",  chase:"Invite sent",     agentType:"—",         income:0     },
  { id:9,  name:"George Whitfield",business:"Whitfield Electricals", type:["SE","Prop"], mtd:"Mandated",  deadline:"7 May 2026", filing:"due-soon", chase:"Chased 7d ago",   agentType:"Main",      income:62000 },
  { id:10, name:"Fatima Al-Rashid",business:"Al-Rashid Catering",    type:["SE"],        mtd:"Mandated",  deadline:"—",          filing:"filed",    chase:"Complete",        agentType:"Main",      income:89000 },
  { id:11, name:"Oliver Stone",    business:"Stone Lettings",        type:["Prop"],      mtd:"Voluntary", deadline:"7 May 2026", filing:"due-soon", chase:"Not started",     agentType:"Main",      income:31000 },
  { id:12, name:"Nina Kowalski",   business:"Kowalski Translations", type:["SE"],        mtd:"Mandated",  deadline:"—",          filing:"filed",    chase:"Complete",        agentType:"Main",      income:54000 },
];

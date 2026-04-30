export type ClientQuarter = {
  q: string;
  period: string;
  due: string;
  status: string;
  filed: string | null;
  income: number | null;
  expenses: number | null;
};

export type ClientLiability = {
  desc: string;
  due: string;
  original: number;
  outstanding: number;
  interest: number;
  status: string;
};

export type PaymentRecord = {
  date: string;
  amount: number;
  ref: string;
  method: string;
};

export type ChaseLogEntry = {
  date: string;
  type: string;
  msg: string;
  status: string;
};

export const mockClientQuarters: ClientQuarter[] = [
  { q:"Q1", period:"6 Apr – 5 Jul 2025",  due:"7 Aug 2025",  status:"filed",   filed:"2 Aug 2025",  income:12400, expenses:3200 },
  { q:"Q2", period:"6 Jul – 5 Oct 2025",  due:"7 Nov 2025",  status:"filed",   filed:"1 Nov 2025",  income:14800, expenses:4100 },
  { q:"Q3", period:"6 Oct – 5 Jan 2026",  due:"7 Feb 2026",  status:"filed",   filed:"5 Feb 2026",  income:11200, expenses:3800 },
  { q:"Q4", period:"6 Jan – 5 Apr 2026",  due:"7 May 2026",  status:"pending", filed:null,          income:null,  expenses:null },
];

export const mockClientLiabilities: ClientLiability[] = [
  { desc:"Balancing payment 2024-25",      due:"31 Jan 2026", original:1240, outstanding:0,    interest:0, status:"paid"     },
  { desc:"1st payment on account 2025-26", due:"31 Jan 2026", original:3620, outstanding:0,    interest:0, status:"paid"     },
  { desc:"2nd payment on account 2025-26", due:"31 Jul 2026", original:3620, outstanding:3620, interest:0, status:"upcoming" },
];

export const mockPaymentHistory: PaymentRecord[] = [
  { date:"28 Jan 2026", amount:4860, ref:"1234567890 — POA1 + balancing", method:"Bank transfer" },
  { date:"30 Jan 2025", amount:3200, ref:"1234567890 — POA1 2024-25",     method:"Bank transfer" },
];

export const mockChaseLog: ChaseLogEntry[] = [
  { date:"14 Apr 2026", type:"email", msg:"Q4 records reminder sent",                    status:"Opened"    },
  { date:"10 Apr 2026", type:"email", msg:"Q4 deadline approaching — records needed",    status:"Opened"    },
  { date:"2 Feb 2026",  type:"email", msg:"Q3 records reminder sent",                    status:"Responded" },
];

export type ExpenseRow = {
  cat: string;
  q4: number;
  ytd: number;
  prior: number;
};

export type ReviewCheck = {
  ok: boolean;
  warn?: boolean;
  msg: string;
};

export const mockIncomeData = { turnover: 13600 };

// YTD cumulative income across all filed quarters (used in income table + net profit summary)
export const mockYtdIncome = 52000;

export const mockExpenseRows: ExpenseRow[] = [
  { cat:"Premises running costs",      q4:1200, ytd:4800,  prior:1100 },
  { cat:"Staff costs",                 q4:0,    ytd:0,     prior:0    },
  { cat:"Travel costs",                q4:680,  ytd:2450,  prior:720  },
  { cat:"Admin & office costs",        q4:540,  ytd:2100,  prior:480  },
  { cat:"Advertising costs",           q4:320,  ytd:1280,  prior:350  },
  { cat:"Professional fees",           q4:450,  ytd:1800,  prior:400  },
  { cat:"Interest & bank charges",     q4:180,  ytd:720,   prior:190  },
  { cat:"Other allowable expenses",    q4:1030, ytd:4150,  prior:960  },
];

export const mockReviewChecks: ReviewCheck[] = [
  { ok:true,              msg:"All mandatory income fields populated"                   },
  { ok:true,              msg:"Expense categories within expected ranges"               },
  { ok:true,              msg:"Turnover below £90,000 — consolidated expenses eligible" },
  { ok:true,              msg:"Cumulative totals consistent with prior submissions"      },
  { ok:false, warn:true,  msg:"Travel costs 5% below Q3 — verify no missing claims"    },
];

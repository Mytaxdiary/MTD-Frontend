export type ChaseClient = {
  id: number;
  name: string;
  business: string;
  deadline: string;
  daysOverdue: number;
  lastChase: string | null;
  chaseCount: number;
  status: string;
  channel: string;
  workflowType: string;
};

export type ChaseTemplate = {
  id: string;
  type: string;
  name: string;
  subject: string;
  body: string;
};

export const mockChaseClients: ChaseClient[] = [
  { id:1,  name:"Sarah Mitchell",  business:"Mitchell Consulting",   deadline:"7 Feb 2026", daysOverdue:77,  lastChase:"10 Apr",  chaseCount:3, status:"no-response",  channel:"email", workflowType:"data-request" },
  { id:2,  name:"James Cooper",    business:"Cooper Properties",     deadline:"7 Feb 2026", daysOverdue:77,  lastChase:"14 Apr",  chaseCount:2, status:"opened",       channel:"email", workflowType:"bookkeeping"  },
  { id:4,  name:"Tom Grant",       business:"Grant Rentals",         deadline:"7 May 2026", daysOverdue:-13, lastChase:"16 Apr",  chaseCount:1, status:"opened",       channel:"sms",   workflowType:"data-request" },
  { id:7,  name:"Marcus Chen",     business:"Chen Photography",      deadline:"7 May 2026", daysOverdue:-13, lastChase:null,      chaseCount:0, status:"not-started",  channel:"email", workflowType:"bookkeeping"  },
  { id:9,  name:"George Whitfield",business:"Whitfield Electricals", deadline:"7 May 2026", daysOverdue:-13, lastChase:"12 Apr",  chaseCount:1, status:"no-response",  channel:"email", workflowType:"data-request" },
  { id:11, name:"Oliver Stone",    business:"Stone Lettings",        deadline:"7 May 2026", daysOverdue:-13, lastChase:null,      chaseCount:0, status:"not-started",  channel:"email", workflowType:"bookkeeping"  },
];

export const mockChaseTemplates: ChaseTemplate[] = [
  {
    id:"bk-gentle", type:"bookkeeping", name:"Bookkeeping reminder",
    subject:"Quarterly bookkeeping needed — {business}",
    body:"Hi {name},\n\nJust a reminder that your {quarter} quarterly records are due by {deadline}. Please complete your bookkeeping in your accounting software and let us know when it's ready for us to review.\n\nIf you need any help, just reply to this email.\n\nBest regards,\n{agent_name}",
  },
  {
    id:"bk-urgent", type:"bookkeeping", name:"Bookkeeping overdue",
    subject:"Action required: overdue bookkeeping — {business}",
    body:"Hi {name},\n\nThe deadline for your {quarter} quarterly update has passed. Please complete your bookkeeping as soon as possible so we can review and ensure your records are up to date with HMRC.\n\nBest regards,\n{agent_name}",
  },
  {
    id:"dr-gentle", type:"data-request", name:"Data request — gentle",
    subject:"Quarterly records needed — {business}",
    body:"Hi {name},\n\nWe need your income and expense records for {quarter} (due {deadline}). Please send us your bank statements, invoices, and receipts for the period.\n\nYou can reply to this email with attachments, or upload files directly in your NewEffect portal.\n\nBest regards,\n{agent_name}",
  },
  {
    id:"dr-urgent", type:"data-request", name:"Data request — urgent",
    subject:"Urgent: records overdue — {business}",
    body:"Hi {name},\n\nYour {quarter} records are now overdue. We need your bank statements and receipts urgently to submit your quarterly update to HMRC.\n\nPlease send everything you have as soon as possible.\n\nBest regards,\n{agent_name}",
  },
  {
    id:"welcome", type:"general", name:"Welcome / onboarding",
    subject:"Welcome to {firm_name} — getting started",
    body:"Hi {name},\n\nWelcome! We're looking forward to helping you with your Making Tax Digital obligations.\n\nYou'll receive a separate email from HMRC asking you to authorise us as your agent. Please accept this — it allows us to manage your quarterly updates.\n\nBest regards,\n{agent_name}",
  },
];

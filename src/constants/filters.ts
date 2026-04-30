export type FilterOption = { value: string; label: string };

export const STATUS_FILTER_OPTIONS: FilterOption[] = [
  { value:"all",            label:"All statuses"    },
  { value:"overdue",        label:"Overdue"         },
  { value:"due-soon",       label:"Due soon"        },
  { value:"filed",          label:"Filed"           },
  { value:"pending-invite", label:"Pending invite"  },
];

export const CLIENT_STATUS_FILTER_OPTIONS: FilterOption[] = [
  { value:"all",      label:"All statuses"    },
  { value:"overdue",  label:"Overdue"         },
  { value:"due-soon", label:"Due soon"        },
  { value:"ready",    label:"Records ready"   },
  { value:"filed",    label:"Submitted"       },
  { value:"pending",  label:"Pending invite"  },
];

export const TYPE_FILTER_OPTIONS: FilterOption[] = [
  { value:"all",  label:"All types"         },
  { value:"SE",   label:"Self-employment"   },
  { value:"Prop", label:"UK Property"       },
  { value:"both", label:"Both income types" },
];

export const QUARTER_FILTER_OPTIONS: FilterOption[] = [
  { value:"all", label:"All quarters" },
  { value:"Q1",  label:"Q1"           },
  { value:"Q2",  label:"Q2"           },
  { value:"Q3",  label:"Q3"           },
  { value:"Q4",  label:"Q4"           },
];

export const WORKFLOW_TYPE_FILTER_OPTIONS: FilterOption[] = [
  { value:"all",          label:"All workflow types"    },
  { value:"bookkeeping",  label:"Bookkeeping reminder"  },
  { value:"data-request", label:"Data request"          },
];

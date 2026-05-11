// Central reactive store for Zanscode OS — localStorage backed, in-memory observable.
// All modules (clients, projects, tasks, finance, team, products, docs) live here so
// they stay interconnected without a backend. Replace with Lovable Cloud when ready.

import { useEffect, useRef, useSyncExternalStore } from "react";

// ---------- Types ----------

export type ClientStatus = "lead" | "active" | "completed" | "archived";
export type ProjectStatus = "planning" | "active" | "on-hold" | "completed";
export type TaskStage = "backlog" | "todo" | "in-progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type TxType = "income" | "expense";
export type ProductStatus = "live" | "beta" | "sunset";

export type Client = {
  id: string;
  name: string;
  contact: string;
  email: string;
  industry: string;
  status: ClientStatus;
  notes: string;
  createdAt: number;
};

export type Activity = {
  id: string;
  at: number;
  message: string;
};

export type Project = {
  id: string;
  name: string;
  clientId: string;
  description: string;
  status: ProjectStatus;
  startDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  memberIds: string[];
  createdAt: number;
  activity: Activity[];
};

export type SubtaskKind = "todo" | "note";
export type Subtask = {
  id: string;
  kind: SubtaskKind;
  text: string;
  done: boolean; // only meaningful when kind === "todo"
  createdAt: number;
};

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  stage: TaskStage;
  assigneeId: string | null;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: number;
  updates: Activity[];
  subtasks: Subtask[];
};

export type Transaction = {
  id: string;
  type: TxType;
  amount: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  projectId: string | null;
  clientId: string | null;
  createdAt: number;
};

export type MemberStatus = "active" | "invited" | "suspended";

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;          // human-readable job title (e.g. "Engineering Lead")
  roleId: string;        // RBAC role id (e.g. "role-admin")
  initials: string;
  joinedAt: number;
  status: MemberStatus;
  // Per-user permission deltas applied on top of the role.
  grants: Permission[];
  revokes: Permission[];
};

// ---------- RBAC ----------
// Flat permission keys. Pattern: "<module>.<action>".
// Keep this list aligned with PERMISSION_CATALOG below.
export type Permission =
  | "dashboard.view"
  | "clients.view" | "clients.manage"
  | "projects.view" | "projects.manage"
  | "tasks.view" | "tasks.manage"
  | "finance.view" | "finance.manage"
  | "team.view" | "team.manage"
  | "products.view" | "products.manage"
  | "knowledge.view" | "knowledge.manage"
  | "recruitment.view" | "recruitment.manage"
  | "content.manage"
  | "settings.manage"
  | "roles.manage";

export type Role = {
  id: string;
  name: string;
  description: string;
  color: string;          // tailwind text color class for badge accent
  permissions: Permission[];
  builtIn: boolean;       // built-in roles can be edited but not deleted
};

export const PERMISSION_CATALOG: { group: string; items: { key: Permission; label: string; hint?: string }[] }[] = [
  { group: "Overview", items: [{ key: "dashboard.view", label: "View dashboard" }] },
  { group: "Operations", items: [
    { key: "clients.view", label: "View clients" },
    { key: "clients.manage", label: "Manage clients" },
    { key: "projects.view", label: "View projects" },
    { key: "projects.manage", label: "Manage projects" },
    { key: "tasks.view", label: "View tasks" },
    { key: "tasks.manage", label: "Manage tasks" },
  ]},
  { group: "Business", items: [
    { key: "finance.view", label: "View finance" },
    { key: "finance.manage", label: "Manage finance" },
    { key: "team.view", label: "View team" },
    { key: "team.manage", label: "Manage team & invites" },
    { key: "products.view", label: "View SaaS products" },
    { key: "products.manage", label: "Manage SaaS products" },
  ]},
  { group: "Recruitment", items: [
    { key: "recruitment.view", label: "View recruitment" },
    { key: "recruitment.manage", label: "Manage recruitment" },
  ]},
  { group: "Knowledge & Content", items: [
    { key: "knowledge.view", label: "View knowledge base" },
    { key: "knowledge.manage", label: "Manage knowledge base" },
    { key: "content.manage", label: "Edit site content" },
  ]},
  { group: "System", items: [
    { key: "settings.manage", label: "Manage settings" },
    { key: "roles.manage", label: "Manage roles & permissions" },
  ]},
];

export const ALL_PERMISSIONS: Permission[] = PERMISSION_CATALOG.flatMap((g) => g.items.map((i) => i.key));

export type SaaSProduct = {
  id: string;
  name: string;
  tagline: string;
  status: ProductStatus;
  totalUsers: number;
  activeUsers: number;
  mrr: number;
  churn: number; // percent
  launchedAt: string;
  adminUrl: string; // SaaS admin login URL
  marketingUrl?: string; // optional public site
};

export type Doc = {
  id: string;
  title: string;
  category: string;
  content: string; // markdown-ish plain text
  updatedAt: number;
  createdAt: number;
};

// ---------- Recruitment (HR) ----------

export type JobTeam = "Engineering" | "Design" | "Product" | "Operations" | "Sales" | "HR" | "Finance";
export type JobType = "Full-time" | "Contract" | "Internship" | "Part-time";
export type JobStatus = "draft" | "published" | "closed";

export type JobPosting = {
  id: string;
  slug: string;
  title: string;
  team: JobTeam;
  location: string;
  type: JobType;
  level: string;
  summary: string;
  description: string; // longer body for the public job page
  status: JobStatus;
  requisitionId: string | null;
  hiringManagerId: string | null; // team member id
  openings: number;
  postedAt: number;
};

export type MPPStatus = "draft" | "submitted" | "approved" | "rejected";
export type MPPRequest = {
  id: string;
  title: string;       // e.g. "Q3 Engineering hiring plan"
  department: JobTeam;
  headcount: number;
  justification: string;
  budgetIDR: number;
  targetQuarter: string; // e.g. "2026-Q3"
  status: MPPStatus;
  requestedById: string | null;
  approverId: string | null;
  createdAt: number;
  decidedAt: number | null;
  notes: string;
};

export type RequisitionStatus = "open" | "on-hold" | "filled" | "cancelled";
export type Requisition = {
  id: string;
  code: string;        // e.g. "REQ-2026-014"
  title: string;
  department: JobTeam;
  mppId: string | null;
  hiringManagerId: string | null;
  openings: number;
  filled: number;
  priority: "low" | "medium" | "high";
  status: RequisitionStatus;
  targetStartDate: string; // YYYY-MM-DD
  notes: string;
  createdAt: number;
};

export type CandidateStage =
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "hired"
  | "rejected";

export type CandidateNote = { id: string; at: number; authorId: string | null; message: string };

export type CandidateEducation = {
  type: "highschool" | "university";
  level?: string;       // D3, S1, etc. when university
  institution: string;  // School / university name
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  phone: string;
  jobId: string | null;
  source: string; // e.g. "LinkedIn", "Referral", "Website"
  stage: CandidateStage;
  rating: number; // 0-5
  resumeUrl: string;     // CV filename or URL
  appliedAt: number;
  notes: CandidateNote[];
  // Rich applicant profile (optional — populated by the public quick-apply form)
  location?: string;
  linkedin?: string;
  lastRole?: string;
  lastCompany?: string;
  lastWorkFrom?: string; // YYYY-MM
  lastWorkTo?: string;   // YYYY-MM or "present"
  education?: CandidateEducation;
  coverLetter?: string;
};

export type InterviewKind = "phone" | "technical" | "culture" | "final" | "panel";
export type InterviewStatus = "scheduled" | "completed" | "cancelled" | "no-show";
export type MeetingProvider = "google-meet" | "ms-teams" | "zoom" | "onsite" | "phone" | "none";

export type Interview = {
  id: string;
  candidateId: string;
  jobId: string | null;
  kind: InterviewKind;
  scheduledAt: number; // epoch ms
  durationMins: number;
  location: string; // physical or "Google Meet"
  meetingProvider: MeetingProvider;
  meetingUrl: string;
  interviewerIds: string[];
  status: InterviewStatus;
  feedback: string;
  score: number; // 0-5
  createdAt: number;
};

// ---------- Site content (front-page CMS) ----------

export type NavLink = { id: string; label: string; to: string };
export type FooterLink = { id: string; label: string; to: string };
export type FooterColumn = { id: string; title: string; links: FooterLink[] };

export type SiteHero = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: string;
  primaryCtaTo: string;
  secondaryCta: string;
  secondaryCtaTo: string;
};

export type SiteFooter = {
  tagline: string;
  email: string;
  phone: string;
  address: string;
  columns: FooterColumn[];
};

export type SectionCard = { id: string; title: string; description: string };
export type SiteSection = {
  id: string;
  title: string;
  subtitle: string;
  visible: boolean;
  cards: SectionCard[];
};

export type LegalSection = { id: string; heading: string; body: string };
export type LegalDoc = {
  title: string;
  intro: string;
  updatedAt: number;
  sections: LegalSection[];
};
export type SiteLegal = {
  terms: LegalDoc;
};

export type SiteContent = {
  nav: NavLink[];
  hero: SiteHero;
  footer: SiteFooter;
  sections: SiteSection[];
  legal: SiteLegal;
};

export type Store = {
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  transactions: Transaction[];
  team: TeamMember[];
  roles: Role[];
  products: SaaSProduct[];
  docs: Doc[];
  jobs: JobPosting[];
  mppRequests: MPPRequest[];
  requisitions: Requisition[];
  candidates: Candidate[];
  interviews: Interview[];
  siteContent: SiteContent;
};

// ---------- Storage ----------

const KEY = "zanscode.os.store.v1";

function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3);
}

function now() {
  return Date.now();
}

function isoDate(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

// ---------- Seed ----------

function seed(): Store {
  const team: TeamMember[] = [
    { id: "tm-andi", name: "Andi Wibowo", email: "andi@zanscode.com", role: "Engineering Lead", roleId: "role-admin", initials: "AW", joinedAt: now() - 1000 * 60 * 60 * 24 * 400, status: "active", grants: [], revokes: [] },
    { id: "tm-maya", name: "Maya Putri", email: "maya@zanscode.com", role: "Product Manager", roleId: "role-manager", initials: "MP", joinedAt: now() - 1000 * 60 * 60 * 24 * 320, status: "active", grants: [], revokes: [] },
    { id: "tm-bagus", name: "Bagus Pratama", email: "bagus@zanscode.com", role: "Senior Developer", roleId: "role-staff", initials: "BP", joinedAt: now() - 1000 * 60 * 60 * 24 * 220, status: "active", grants: ["finance.view"], revokes: [] },
    { id: "tm-sinta", name: "Sinta Lestari", email: "sinta@zanscode.com", role: "UI/UX Designer", roleId: "role-staff", initials: "SL", joinedAt: now() - 1000 * 60 * 60 * 24 * 180, status: "active", grants: [], revokes: [] },
    { id: "tm-reza", name: "Reza Hakim", email: "reza@zanscode.com", role: "QA Engineer", roleId: "role-staff", initials: "RH", joinedAt: now() - 1000 * 60 * 60 * 24 * 90, status: "active", grants: [], revokes: [] },
  ];

  const clients: Client[] = [
    { id: "cl-acme", name: "Acme Corp", contact: "Lisa Tanaka", email: "lisa@acme.co", industry: "Retail", status: "active", notes: "Key account — quarterly business review every Q.", createdAt: now() - 1000 * 60 * 60 * 24 * 200 },
    { id: "cl-northwind", name: "Northwind Ltd", contact: "Reza Halim", email: "reza@northwind.co", industry: "Logistics", status: "active", notes: "Migrating from legacy system.", createdAt: now() - 1000 * 60 * 60 * 24 * 130 },
    { id: "cl-riverside", name: "Riverside Inc", contact: "Putri Maharani", email: "putri@riverside.co", industry: "F&B", status: "completed", notes: "POS rollout completed last quarter.", createdAt: now() - 1000 * 60 * 60 * 24 * 280 },
    { id: "cl-globex", name: "Globex", contact: "Tomi Setiawan", email: "tomi@globex.co", industry: "Finance", status: "lead", notes: "Initial discovery scheduled.", createdAt: now() - 1000 * 60 * 60 * 24 * 14 },
  ];

  const projects: Project[] = [
    {
      id: "pr-zenith",
      name: "Zenith Mobile App v2",
      clientId: "cl-acme",
      description: "Rebuild flagship customer app with new design system and offline support.",
      status: "active",
      startDate: isoDate(-60),
      dueDate: isoDate(45),
      memberIds: ["tm-andi", "tm-sinta", "tm-bagus", "tm-reza"],
      createdAt: now() - 1000 * 60 * 60 * 24 * 60,
      activity: [
        { id: uid("a-"), at: now() - 86400000 * 5, message: "Sprint 4 kicked off." },
        { id: uid("a-"), at: now() - 86400000 * 2, message: "Design review approved." },
      ],
    },
    {
      id: "pr-northwind-crm",
      name: "Internal CRM Migration",
      clientId: "cl-northwind",
      description: "Migrate legacy CRM data to new platform with zero downtime.",
      status: "active",
      startDate: isoDate(-30),
      dueDate: isoDate(60),
      memberIds: ["tm-andi", "tm-maya", "tm-bagus"],
      createdAt: now() - 1000 * 60 * 60 * 24 * 30,
      activity: [{ id: uid("a-"), at: now() - 86400000 * 3, message: "Data mapping draft delivered." }],
    },
    {
      id: "pr-pos",
      name: "POS Rollout — 12 Outlets",
      clientId: "cl-riverside",
      description: "Phased POS deployment across 12 retail outlets.",
      status: "completed",
      startDate: isoDate(-200),
      dueDate: isoDate(-10),
      memberIds: ["tm-bagus", "tm-reza"],
      createdAt: now() - 1000 * 60 * 60 * 24 * 200,
      activity: [{ id: uid("a-"), at: now() - 86400000 * 10, message: "Final outlet went live." }],
    },
  ];

  const tasks: Task[] = [
    { id: uid("tk-"), projectId: "pr-zenith", title: "Design new onboarding flow", description: "Three-screen onboarding with personalization.", stage: "done", assigneeId: "tm-sinta", priority: "high", dueDate: isoDate(-15), createdAt: now() - 86400000 * 30, updates: [] },
    { id: uid("tk-"), projectId: "pr-zenith", title: "Implement offline cache layer", description: "Use IndexedDB with sync queue.", stage: "in-progress", assigneeId: "tm-andi", priority: "high", dueDate: isoDate(7), createdAt: now() - 86400000 * 14, updates: [] },
    { id: uid("tk-"), projectId: "pr-zenith", title: "Push notifications integration", description: "FCM + APNs.", stage: "todo", assigneeId: "tm-bagus", priority: "medium", dueDate: isoDate(14), createdAt: now() - 86400000 * 7, updates: [] },
    { id: uid("tk-"), projectId: "pr-zenith", title: "QA regression checklist", description: "Cover top 30 user flows.", stage: "review", assigneeId: "tm-reza", priority: "medium", dueDate: isoDate(3), createdAt: now() - 86400000 * 5, updates: [] },
    { id: uid("tk-"), projectId: "pr-zenith", title: "App Store assets", description: "Screenshots and copy for v2.", stage: "backlog", assigneeId: null, priority: "low", dueDate: isoDate(30), createdAt: now() - 86400000 * 2, updates: [] },
    { id: uid("tk-"), projectId: "pr-northwind-crm", title: "Map legacy schemas", description: "Source-to-target mapping doc.", stage: "in-progress", assigneeId: "tm-maya", priority: "high", dueDate: isoDate(5), createdAt: now() - 86400000 * 10, updates: [] },
    { id: uid("tk-"), projectId: "pr-northwind-crm", title: "Build sync engine prototype", description: "Incremental delta sync.", stage: "todo", assigneeId: "tm-andi", priority: "high", dueDate: isoDate(20), createdAt: now() - 86400000 * 4, updates: [] },
    { id: uid("tk-"), projectId: "pr-northwind-crm", title: "User acceptance plan", description: "Define UAT scenarios with client.", stage: "backlog", assigneeId: "tm-bagus", priority: "medium", dueDate: isoDate(35), createdAt: now() - 86400000 * 1, updates: [] },
  ].map((t) => ({ ...t, subtasks: [] as Subtask[] })) as Task[];

  const transactions: Transaction[] = [
    { id: uid("tx-"), type: "income", amount: 48000000, category: "Project payment", description: "Acme — Zenith Sprint 3 invoice", date: isoDate(-12), projectId: "pr-zenith", clientId: "cl-acme", createdAt: now() - 86400000 * 12 },
    { id: uid("tx-"), type: "income", amount: 24000000, category: "Project payment", description: "Northwind — kickoff payment", date: isoDate(-25), projectId: "pr-northwind-crm", clientId: "cl-northwind", createdAt: now() - 86400000 * 25 },
    { id: uid("tx-"), type: "income", amount: 18000000, category: "SaaS subscription", description: "Monthly SaaS revenue", date: isoDate(-5), projectId: null, clientId: null, createdAt: now() - 86400000 * 5 },
    { id: uid("tx-"), type: "expense", amount: 22000000, category: "Payroll", description: "Team payroll — current cycle", date: isoDate(-3), projectId: null, clientId: null, createdAt: now() - 86400000 * 3 },
    { id: uid("tx-"), type: "expense", amount: 4500000, category: "Infrastructure", description: "Cloud hosting & services", date: isoDate(-2), projectId: null, clientId: null, createdAt: now() - 86400000 * 2 },
    { id: uid("tx-"), type: "expense", amount: 1800000, category: "Tools & software", description: "Design and dev tooling subscriptions", date: isoDate(-8), projectId: null, clientId: null, createdAt: now() - 86400000 * 8 },
  ];

  const products: SaaSProduct[] = [
    { id: "sp-zen-pos", name: "ZenPOS", tagline: "Point-of-sale for modern retail", status: "live", totalUsers: 4820, activeUsers: 3160, mrr: 84000000, churn: 2.4, launchedAt: isoDate(-540), adminUrl: "https://admin.zenpos.zanscode.com", marketingUrl: "https://zenpos.zanscode.com" },
    { id: "sp-zen-hr", name: "ZenHR", tagline: "Lightweight HRIS for SMBs", status: "live", totalUsers: 2140, activeUsers: 1580, mrr: 42000000, churn: 3.1, launchedAt: isoDate(-380), adminUrl: "https://admin.zenhr.zanscode.com", marketingUrl: "https://zenhr.zanscode.com" },
    { id: "sp-zen-stock", name: "ZenStock", tagline: "Inventory & supplier ops", status: "beta", totalUsers: 320, activeUsers: 240, mrr: 6500000, churn: 4.2, launchedAt: isoDate(-90), adminUrl: "https://admin.zenstock.zanscode.com", marketingUrl: "https://zenstock.zanscode.com" },
  ];

  const docs: Doc[] = [
    { id: uid("dc-"), title: "Engineering Onboarding", category: "Engineering", content: "# Welcome\n\nSetup steps:\n- Get repo access\n- Install Bun + Node 20\n- Run `bun install`\n- Read the architecture doc\n\nReach out to Andi for credentials.", updatedAt: now() - 86400000 * 10, createdAt: now() - 86400000 * 60 },
    { id: uid("dc-"), title: "Client Communication SOP", category: "Operations", content: "# Client Comms\n\n- Reply within 1 business day.\n- Weekly status update every Friday.\n- Escalate blockers to PM same-day.\n", updatedAt: now() - 86400000 * 4, createdAt: now() - 86400000 * 90 },
    { id: uid("dc-"), title: "Incident Response Runbook", category: "Engineering", content: "# Incident Response\n\n1. Acknowledge in #incidents.\n2. Assign incident commander.\n3. Open status page entry.\n4. Postmortem within 5 days.", updatedAt: now() - 86400000 * 18, createdAt: now() - 86400000 * 120 },
  ];

  // ---------- Recruitment seeds ----------

  const mppRequests: MPPRequest[] = [
    { id: "mpp-eng-q3", title: "Q3 Engineering scale-up", department: "Engineering", headcount: 4, justification: "Two new SaaS products entering GA — needs 2 senior FE, 1 platform, 1 mobile.", budgetIDR: 1_400_000_000, targetQuarter: "2026-Q3", status: "approved", requestedById: "tm-andi", approverId: "tm-maya", createdAt: now() - 86400000 * 40, decidedAt: now() - 86400000 * 30, notes: "Approved with reduced budget; defer 1 hire to Q4 if needed." },
    { id: "mpp-design-q3", title: "Design bench expansion", department: "Design", headcount: 2, justification: "Brand + product design split across 3 SaaS lines.", budgetIDR: 520_000_000, targetQuarter: "2026-Q3", status: "submitted", requestedById: "tm-sinta", approverId: null, createdAt: now() - 86400000 * 8, decidedAt: null, notes: "Awaiting CFO review." },
    { id: "mpp-ops-q4", title: "Customer Success regional", department: "Operations", headcount: 3, justification: "Open SEA region — Singapore + Vietnam + Philippines.", budgetIDR: 780_000_000, targetQuarter: "2026-Q4", status: "draft", requestedById: "tm-maya", approverId: null, createdAt: now() - 86400000 * 2, decidedAt: null, notes: "" },
  ];

  const requisitions: Requisition[] = [
    { id: "req-eng-014", code: "REQ-2026-014", title: "Senior Full-Stack Engineer", department: "Engineering", mppId: "mpp-eng-q3", hiringManagerId: "tm-andi", openings: 2, filled: 0, priority: "high", status: "open", targetStartDate: isoDate(60), notes: "Replacing two attritions + one new line.", createdAt: now() - 86400000 * 28 },
    { id: "req-eng-015", code: "REQ-2026-015", title: "Mobile Engineer (React Native)", department: "Engineering", mppId: "mpp-eng-q3", hiringManagerId: "tm-andi", openings: 1, filled: 0, priority: "medium", status: "open", targetStartDate: isoDate(75), notes: "", createdAt: now() - 86400000 * 22 },
    { id: "req-design-008", code: "REQ-2026-008", title: "Product Designer", department: "Design", mppId: null, hiringManagerId: "tm-sinta", openings: 1, filled: 0, priority: "medium", status: "open", targetStartDate: isoDate(45), notes: "Looking for SaaS product depth.", createdAt: now() - 86400000 * 18 },
    { id: "req-pm-003", code: "REQ-2026-003", title: "Senior Product Manager — SaaS", department: "Product", mppId: null, hiringManagerId: "tm-maya", openings: 1, filled: 1, priority: "high", status: "filled", targetStartDate: isoDate(-30), notes: "Filled by external hire.", createdAt: now() - 86400000 * 90 },
  ];

  const jobsSeed: JobPosting[] = [
    { id: "job-fs-eng", slug: "senior-fullstack-engineer", title: "Senior Full-Stack Engineer", team: "Engineering", location: "Remote / Jakarta", type: "Full-time", level: "Senior", summary: "Lead the build of customer-facing features across our SaaS suite using TypeScript, React and Node.", description: "You'll lead end-to-end features across our SaaS suite, partnering closely with design and product. Tech: React 19, TanStack Router, Node, PostgreSQL.", status: "published", requisitionId: "req-eng-014", hiringManagerId: "tm-andi", openings: 2, postedAt: now() - 86400000 * 24 },
    { id: "job-mob-eng", slug: "mobile-engineer", title: "Mobile Engineer (React Native)", team: "Engineering", location: "Remote / Jakarta", type: "Full-time", level: "Mid", summary: "Ship beautiful, performant native experiences for our flagship mobile apps used by thousands daily.", description: "Own mobile features end-to-end on React Native + Expo. Strong native debugging and performance instincts a plus.", status: "published", requisitionId: "req-eng-015", hiringManagerId: "tm-andi", openings: 1, postedAt: now() - 86400000 * 18 },
    { id: "job-platform", slug: "platform-devops-engineer", title: "Platform / DevOps Engineer", team: "Engineering", location: "Remote", type: "Full-time", level: "Senior", summary: "Own our cloud infrastructure on AWS — CI/CD, observability, security and developer experience.", description: "Design and operate the platform behind every product. AWS, IaC, container workloads, CI/CD pipelines.", status: "published", requisitionId: null, hiringManagerId: "tm-andi", openings: 1, postedAt: now() - 86400000 * 12 },
    { id: "job-eng-intern", slug: "engineering-intern", title: "Engineering Intern", team: "Engineering", location: "Jakarta", type: "Internship", level: "Junior", summary: "Six months of structured learning, real product work and a clear path to a full-time offer.", description: "Pair with senior engineers, ship real features, get weekly mentorship and a path to FTE.", status: "published", requisitionId: null, hiringManagerId: "tm-andi", openings: 2, postedAt: now() - 86400000 * 9 },
    { id: "job-product-designer", slug: "product-designer", title: "Product Designer", team: "Design", location: "Remote / Singapore", type: "Full-time", level: "Mid", summary: "Design end-to-end experiences across our SaaS apps — from research to high-fidelity flows.", description: "Drive UX research, prototypes, and ship-ready designs across multiple SaaS products.", status: "published", requisitionId: "req-design-008", hiringManagerId: "tm-sinta", openings: 1, postedAt: now() - 86400000 * 14 },
    { id: "job-brand", slug: "brand-marketing-designer", title: "Brand & Marketing Designer", team: "Design", location: "Remote", type: "Full-time", level: "Mid", summary: "Shape the Zanscode brand across web, ads, social and product launches.", description: "Own the visual brand system across all surfaces. Web, social, motion, print.", status: "draft", requisitionId: null, hiringManagerId: "tm-sinta", openings: 1, postedAt: now() - 86400000 * 4 },
    { id: "job-pm-saas", slug: "senior-pm-saas", title: "Senior Product Manager — SaaS", team: "Product", location: "Remote / Jakarta", type: "Full-time", level: "Senior", summary: "Own the roadmap of a flagship SaaS product, from discovery to launch and growth.", description: "Discovery, prioritization, roadmap, launch — full ownership of one flagship SaaS line.", status: "closed", requisitionId: "req-pm-003", hiringManagerId: "tm-maya", openings: 1, postedAt: now() - 86400000 * 100 },
    { id: "job-csm", slug: "customer-success-manager", title: "Customer Success Manager", team: "Operations", location: "Jakarta", type: "Full-time", level: "Mid", summary: "Drive adoption and retention with our enterprise customers across SEA.", description: "Build trusted relationships with enterprise customers across SEA. Drive adoption, expansion, retention.", status: "published", requisitionId: null, hiringManagerId: "tm-maya", openings: 1, postedAt: now() - 86400000 * 7 },
    { id: "job-impl", slug: "implementation-consultant", title: "Implementation Consultant", team: "Operations", location: "Remote (APAC)", type: "Contract", level: "Mid", summary: "Lead onboarding and migrations for new customers — discovery, configuration, training, go-live.", description: "Lead end-to-end onboarding for new customers across APAC.", status: "published", requisitionId: null, hiringManagerId: "tm-maya", openings: 2, postedAt: now() - 86400000 * 5 },
    { id: "job-ae", slug: "enterprise-ae", title: "Enterprise Account Executive", team: "Sales", location: "Singapore", type: "Full-time", level: "Senior", summary: "Build relationships and close deals with enterprise accounts across APAC.", description: "Hunter mindset. Strategic enterprise selling across APAC. Quota carrying.", status: "published", requisitionId: null, hiringManagerId: "tm-maya", openings: 1, postedAt: now() - 86400000 * 11 },
  ];

  const candidates: Candidate[] = [
    { id: "cand-1", name: "Dimas Prakoso", email: "dimas.p@example.com", phone: "+62 812 1111 2222", jobId: "job-fs-eng", source: "LinkedIn", stage: "interview", rating: 4, resumeUrl: "", appliedAt: now() - 86400000 * 14, notes: [{ id: uid("n-"), at: now() - 86400000 * 10, authorId: "tm-andi", message: "Strong React + TS background; passed screen." }] },
    { id: "cand-2", name: "Rina Hartono", email: "rina.h@example.com", phone: "+62 813 3333 4444", jobId: "job-fs-eng", source: "Referral", stage: "screening", rating: 4, resumeUrl: "", appliedAt: now() - 86400000 * 9, notes: [] },
    { id: "cand-3", name: "Aldo Sugianto", email: "aldo.s@example.com", phone: "+62 815 5555 6666", jobId: "job-fs-eng", source: "Website", stage: "applied", rating: 3, resumeUrl: "", appliedAt: now() - 86400000 * 3, notes: [] },
    { id: "cand-4", name: "Mei Lin", email: "mei.lin@example.com", phone: "+65 9123 4567", jobId: "job-product-designer", source: "Dribbble", stage: "offer", rating: 5, resumeUrl: "", appliedAt: now() - 86400000 * 21, notes: [{ id: uid("n-"), at: now() - 86400000 * 5, authorId: "tm-sinta", message: "Top of pile — extending offer." }] },
    { id: "cand-5", name: "Bayu Pranata", email: "bayu.p@example.com", phone: "+62 811 7777 8888", jobId: "job-product-designer", source: "LinkedIn", stage: "interview", rating: 4, resumeUrl: "", appliedAt: now() - 86400000 * 12, notes: [] },
    { id: "cand-6", name: "Citra Anjani", email: "citra.a@example.com", phone: "+62 819 9999 0000", jobId: "job-mob-eng", source: "Referral", stage: "screening", rating: 4, resumeUrl: "", appliedAt: now() - 86400000 * 6, notes: [] },
    { id: "cand-7", name: "Hadi Santoso", email: "hadi.s@example.com", phone: "+62 817 1212 3434", jobId: "job-csm", source: "Website", stage: "hired", rating: 5, resumeUrl: "", appliedAt: now() - 86400000 * 50, notes: [{ id: uid("n-"), at: now() - 86400000 * 20, authorId: "tm-maya", message: "Started 2 weeks ago — onboarding well." }] },
    { id: "cand-8", name: "Lina Surya", email: "lina.s@example.com", phone: "+62 818 2323 4545", jobId: "job-ae", source: "Recruiter", stage: "rejected", rating: 2, resumeUrl: "", appliedAt: now() - 86400000 * 25, notes: [{ id: uid("n-"), at: now() - 86400000 * 18, authorId: "tm-maya", message: "Not enough enterprise experience." }] },
    { id: "cand-9", name: "Firman Hadi", email: "firman.h@example.com", phone: "+62 821 5656 7878", jobId: "job-impl", source: "LinkedIn", stage: "applied", rating: 3, resumeUrl: "", appliedAt: now() - 86400000 * 1, notes: [] },
  ];

  const interviews: Interview[] = [
    { id: "iv-1", candidateId: "cand-1", jobId: "job-fs-eng", kind: "technical", scheduledAt: now() + 86400000 * 1, durationMins: 60, location: "Google Meet", meetingProvider: "google-meet", meetingUrl: "https://meet.google.com/zns-demo-001", interviewerIds: ["tm-andi", "tm-bagus"], status: "scheduled", feedback: "", score: 0, createdAt: now() - 86400000 * 5 },
    { id: "iv-2", candidateId: "cand-4", jobId: "job-product-designer", kind: "final", scheduledAt: now() + 86400000 * 2, durationMins: 45, location: "Zanscode HQ — Jakarta", meetingProvider: "onsite", meetingUrl: "", interviewerIds: ["tm-sinta", "tm-maya"], status: "scheduled", feedback: "", score: 0, createdAt: now() - 86400000 * 3 },
    { id: "iv-3", candidateId: "cand-5", jobId: "job-product-designer", kind: "culture", scheduledAt: now() + 86400000 * 3, durationMins: 30, location: "Microsoft Teams", meetingProvider: "ms-teams", meetingUrl: "https://teams.microsoft.com/l/meetup-join/zns-demo-002", interviewerIds: ["tm-maya"], status: "scheduled", feedback: "", score: 0, createdAt: now() - 86400000 * 2 },
    { id: "iv-4", candidateId: "cand-2", jobId: "job-fs-eng", kind: "phone", scheduledAt: now() - 86400000 * 1, durationMins: 30, location: "Phone", meetingProvider: "phone", meetingUrl: "", interviewerIds: ["tm-andi"], status: "completed", feedback: "Very strong communication. Solid React fundamentals.", score: 4, createdAt: now() - 86400000 * 8 },
    { id: "iv-5", candidateId: "cand-7", jobId: "job-csm", kind: "panel", scheduledAt: now() - 86400000 * 30, durationMins: 90, location: "Zanscode HQ — Jakarta", meetingProvider: "onsite", meetingUrl: "", interviewerIds: ["tm-maya", "tm-andi"], status: "completed", feedback: "Hired.", score: 5, createdAt: now() - 86400000 * 40 },
  ];

  return { clients, projects, tasks, transactions, team, roles: defaultRoles(), products, docs, jobs: jobsSeed, mppRequests, requisitions, candidates, interviews, siteContent: defaultSiteContent() };
}

export function defaultRoles(): Role[] {
  return [
    {
      id: "role-admin",
      name: "Administrator",
      description: "Full access across every module, including roles & permissions.",
      color: "text-rose-600 dark:text-rose-400",
      builtIn: true,
      permissions: [...ALL_PERMISSIONS],
    },
    {
      id: "role-manager",
      name: "Manager",
      description: "Runs day-to-day operations: clients, projects, finance, recruitment.",
      color: "text-violet-600 dark:text-violet-400",
      builtIn: true,
      permissions: [
        "dashboard.view",
        "clients.view","clients.manage",
        "projects.view","projects.manage",
        "tasks.view","tasks.manage",
        "finance.view","finance.manage",
        "team.view",
        "products.view",
        "knowledge.view","knowledge.manage",
        "recruitment.view","recruitment.manage",
        "content.manage",
      ],
    },
    {
      id: "role-staff",
      name: "Staff",
      description: "Default role for team members — see and contribute to assigned work.",
      color: "text-sky-600 dark:text-sky-400",
      builtIn: true,
      permissions: [
        "dashboard.view",
        "clients.view",
        "projects.view","projects.manage",
        "tasks.view","tasks.manage",
        "team.view",
        "products.view",
        "knowledge.view",
      ],
    },
    {
      id: "role-viewer",
      name: "Viewer",
      description: "Read-only access — useful for stakeholders and auditors.",
      color: "text-slate-600 dark:text-slate-400",
      builtIn: true,
      permissions: ["dashboard.view","clients.view","projects.view","tasks.view","team.view","products.view","knowledge.view","recruitment.view"],
    },
  ];
}

export function defaultSiteContent(): SiteContent {
  return {
    nav: [
      { id: "n-home", label: "Home", to: "/" },
      { id: "n-services", label: "Services", to: "/services" },
      { id: "n-products", label: "Products", to: "/products" },
      { id: "n-about", label: "About", to: "/about" },
      { id: "n-careers", label: "Careers", to: "/careers" },
      { id: "n-contact", label: "Contact", to: "/contact" },
    ],
    hero: {
      eyebrow: "Software & systems engineered for your business",
      title: "We design and build the software your business runs on.",
      subtitle:
        "Zanscode partners with business owners and mid-sized companies to design, build and operate custom systems — web, mobile, cloud and ERP.",
      primaryCta: "Start a project",
      primaryCtaTo: "/contact",
      secondaryCta: "Explore services",
      secondaryCtaTo: "/services",
    },
    footer: {
      tagline:
        "Zanscode is a software company designing and building custom systems, web, mobile and cloud applications — plus a growing line of SaaS products.",
      email: "hello@zanscode.com",
      phone: "+1 (555) 010-0123",
      address: "Innovation District, Jakarta, Indonesia",
      columns: [
        {
          id: "fc-products",
          title: "Products",
          links: [
            { id: "fl-1", label: "Solutions overview", to: "/products" },
            { id: "fl-2", label: "Zanscode ERP", to: "/products" },
            { id: "fl-3", label: "Zanscode POS", to: "/products" },
            { id: "fl-4", label: "Staff sign in", to: "/staff/login" },
          ],
        },
        {
          id: "fc-company",
          title: "Company",
          links: [
            { id: "fl-5", label: "About us", to: "/about" },
            { id: "fl-6", label: "Services", to: "/services" },
            { id: "fl-7", label: "Careers", to: "/careers" },
            { id: "fl-8", label: "Contact", to: "/contact" },
          ],
        },
        {
          id: "fc-resources",
          title: "Resources",
          links: [
            { id: "fl-9", label: "Case studies", to: "/services" },
            { id: "fl-10", label: "Pricing", to: "/products" },
            { id: "fl-11", label: "Support", to: "/contact" },
          ],
        },
      ],
    },
    sections: [
      {
        id: "sec-capabilities",
        title: "Custom software, end to end",
        subtitle: "From the system architecture to the last pixel — one engineering partner.",
        visible: true,
        cards: [
          { id: "c1", title: "Custom business software", description: "Tailored systems engineered around how your business actually operates." },
          { id: "c2", title: "ERP & operations systems", description: "Inventory, sales, finance, HR and reporting in one source of truth." },
          { id: "c3", title: "Web & mobile applications", description: "Customer-facing and internal apps for web, iOS and Android." },
        ],
      },
      {
        id: "sec-process",
        title: "A clear path from idea to scale",
        subtitle: "A proven engineering process that keeps everyone aligned and shipping.",
        visible: true,
        cards: [
          { id: "p1", title: "Discover", description: "Workshops to map goals, users, workflows and constraints." },
          { id: "p2", title: "Design", description: "System architecture, UX and a measurable success plan." },
          { id: "p3", title: "Build", description: "Iterative delivery with weekly demos and tight feedback." },
          { id: "p4", title: "Scale", description: "Operate, optimize and evolve the system long-term." },
        ],
      },
    ],
  };
}

// ---------- Reactive store ----------

let state: Store = load();
const listeners = new Set<() => void>();

function load(): Store {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      window.localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    const parsed = JSON.parse(raw) as Store;
    // Backfill subtasks for older persisted state
    if (parsed.tasks) {
      parsed.tasks = parsed.tasks.map((t) => ({ ...t, subtasks: t.subtasks ?? [] }));
    }
    // Backfill admin URLs on products from older persisted state
    if (parsed.products) {
      parsed.products = parsed.products.map((p) => ({
        ...p,
        adminUrl:
          p.adminUrl ??
          `https://admin.${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "")}.zanscode.com`,
      }));
    }
    // Backfill recruitment collections for older persisted state
    const seeded = seed();
    if (!parsed.roles) parsed.roles = seeded.roles;
    if (parsed.team) {
      parsed.team = parsed.team.map((m) => ({
        ...m,
        roleId: m.roleId ?? "role-staff",
        status: m.status ?? "active",
        grants: m.grants ?? [],
        revokes: m.revokes ?? [],
      }));
    }
    if (!parsed.jobs) parsed.jobs = seeded.jobs;
    if (!parsed.mppRequests) parsed.mppRequests = seeded.mppRequests;
    if (!parsed.requisitions) parsed.requisitions = seeded.requisitions;
    if (!parsed.candidates) parsed.candidates = seeded.candidates;
    if (!parsed.interviews) parsed.interviews = seeded.interviews;
    else parsed.interviews = parsed.interviews.map((iv) => ({
      ...iv,
      meetingProvider: iv.meetingProvider ?? (iv.location?.toLowerCase().includes("meet") ? "google-meet" : iv.location?.toLowerCase().includes("teams") ? "ms-teams" : iv.location?.toLowerCase().includes("phone") ? "phone" : "onsite"),
      meetingUrl: iv.meetingUrl ?? "",
    }));
    if (!parsed.siteContent) parsed.siteContent = seeded.siteContent;
    return parsed;
  } catch {
    return seed();
  }
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore quota issues
  }
}

function emit() {
  for (const l of listeners) l();
}

function update(mutator: (s: Store) => Store) {
  state = mutator(state);
  persist();
  emit();
}

export function getStoreSnapshot(): Store {
  return state;
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function shallowEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (!Object.is(a[i], b[i])) return false;
    return true;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const ak = Object.keys(a as object);
    const bk = Object.keys(b as object);
    if (ak.length !== bk.length) return false;
    for (const k of ak) if (!Object.is((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k])) return false;
    return true;
  }
  return false;
}

export function useStore<T>(selector: (s: Store) => T): T {
  const cacheRef = useRef<{ state: Store | null; value: T }>({ state: null, value: undefined as unknown as T });
  const get = () => {
    if (cacheRef.current.state === state) return cacheRef.current.value;
    const next = selector(state);
    if (cacheRef.current.state !== null && shallowEqual(cacheRef.current.value, next)) {
      cacheRef.current.state = state;
      return cacheRef.current.value;
    }
    cacheRef.current = { state, value: next };
    return next;
  };
  return useSyncExternalStore(subscribe, get, get);
}

// SSR-safe hydration: ensures the client mounts with hydrated state if SSR rendered seed.
export function useHydrate() {
  useEffect(() => {
    state = load();
    emit();
  }, []);
}

export function resetStore() {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
  state = load();
  emit();
}

// ---------- Mutations: Clients ----------

export function createClient(input: Omit<Client, "id" | "createdAt">): Client {
  const c: Client = { ...input, id: uid("cl-"), createdAt: now() };
  update((s) => ({ ...s, clients: [c, ...s.clients] }));
  return c;
}

export function updateClient(id: string, patch: Partial<Client>) {
  update((s) => ({ ...s, clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
}

export function deleteClient(id: string) {
  update((s) => ({
    ...s,
    clients: s.clients.filter((c) => c.id !== id),
    // cascade: detach projects from this client (mark as completed/archived rather than nuke)
    projects: s.projects.filter((p) => p.clientId !== id),
    tasks: s.tasks.filter((t) => !s.projects.find((p) => p.id === t.projectId && p.clientId === id)),
    transactions: s.transactions.map((tx) => (tx.clientId === id ? { ...tx, clientId: null } : tx)),
  }));
}

// ---------- Mutations: Projects ----------

export function createProject(input: Omit<Project, "id" | "createdAt" | "activity">): Project {
  const p: Project = {
    ...input,
    id: uid("pr-"),
    createdAt: now(),
    activity: [{ id: uid("a-"), at: now(), message: "Project created." }],
  };
  update((s) => ({ ...s, projects: [p, ...s.projects] }));
  return p;
}

export function updateProject(id: string, patch: Partial<Project>) {
  update((s) => ({ ...s, projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
}

export function logProjectActivity(projectId: string, message: string) {
  update((s) => ({
    ...s,
    projects: s.projects.map((p) =>
      p.id === projectId ? { ...p, activity: [{ id: uid("a-"), at: now(), message }, ...p.activity].slice(0, 50) } : p,
    ),
  }));
}

export function deleteProject(id: string) {
  update((s) => ({
    ...s,
    projects: s.projects.filter((p) => p.id !== id),
    tasks: s.tasks.filter((t) => t.projectId !== id),
    transactions: s.transactions.map((tx) => (tx.projectId === id ? { ...tx, projectId: null } : tx)),
  }));
}

// ---------- Mutations: Tasks ----------

export function createTask(input: Omit<Task, "id" | "createdAt" | "updates" | "subtasks"> & { subtasks?: Subtask[] }): Task {
  const t: Task = { ...input, id: uid("tk-"), createdAt: now(), updates: [], subtasks: input.subtasks ?? [] };
  update((s) => ({ ...s, tasks: [t, ...s.tasks] }));
  logProjectActivity(input.projectId, `Task added: ${input.title}`);
  return t;
}

export function updateTask(id: string, patch: Partial<Task>) {
  update((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
}

export function moveTask(id: string, stage: TaskStage) {
  const task = state.tasks.find((t) => t.id === id);
  update((s) => ({
    ...s,
    tasks: s.tasks.map((t) =>
      t.id === id
        ? { ...t, stage, updates: [{ id: uid("u-"), at: now(), message: `Moved to ${stage}` }, ...t.updates].slice(0, 20) }
        : t,
    ),
  }));
  if (task) logProjectActivity(task.projectId, `Task "${task.title}" moved to ${stage}.`);
}

export function deleteTask(id: string) {
  update((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
}

export function addSubtask(taskId: string, kind: SubtaskKind, text: string): Subtask | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const sub: Subtask = { id: uid("st-"), kind, text: trimmed, done: false, createdAt: now() };
  update((s) => ({
    ...s,
    tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, subtasks: [...t.subtasks, sub] } : t)),
  }));
  return sub;
}

export function updateSubtask(taskId: string, subtaskId: string, patch: Partial<Subtask>) {
  update((s) => ({
    ...s,
    tasks: s.tasks.map((t) =>
      t.id === taskId
        ? { ...t, subtasks: t.subtasks.map((st) => (st.id === subtaskId ? { ...st, ...patch } : st)) }
        : t,
    ),
  }));
}

export function toggleSubtask(taskId: string, subtaskId: string) {
  update((s) => ({
    ...s,
    tasks: s.tasks.map((t) =>
      t.id === taskId
        ? { ...t, subtasks: t.subtasks.map((st) => (st.id === subtaskId ? { ...st, done: !st.done } : st)) }
        : t,
    ),
  }));
}

export function deleteSubtask(taskId: string, subtaskId: string) {
  update((s) => ({
    ...s,
    tasks: s.tasks.map((t) =>
      t.id === taskId ? { ...t, subtasks: t.subtasks.filter((st) => st.id !== subtaskId) } : t,
    ),
  }));
}

// ---------- Mutations: Transactions ----------

export function createTransaction(input: Omit<Transaction, "id" | "createdAt">): Transaction {
  const tx: Transaction = { ...input, id: uid("tx-"), createdAt: now() };
  update((s) => ({ ...s, transactions: [tx, ...s.transactions] }));
  return tx;
}

export function deleteTransaction(id: string) {
  update((s) => ({ ...s, transactions: s.transactions.filter((t) => t.id !== id) }));
}

// ---------- Mutations: Team ----------

export function createMember(input: Omit<TeamMember, "id" | "joinedAt" | "initials" | "roleId" | "status" | "grants" | "revokes"> & Partial<Pick<TeamMember, "roleId" | "status" | "grants" | "revokes">>): TeamMember {
  const initials = input.name.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "ZS";
  const m: TeamMember = {
    name: input.name,
    email: input.email,
    role: input.role,
    roleId: input.roleId ?? "role-staff",
    status: input.status ?? "invited",
    grants: input.grants ?? [],
    revokes: input.revokes ?? [],
    id: uid("tm-"),
    joinedAt: now(),
    initials,
  };
  update((s) => ({ ...s, team: [m, ...s.team] }));
  return m;
}

export function updateMember(id: string, patch: Partial<TeamMember>) {
  update((s) => ({ ...s, team: s.team.map((m) => (m.id === id ? { ...m, ...patch } : m)) }));
}

export function setMemberRole(id: string, roleId: string) {
  update((s) => ({ ...s, team: s.team.map((m) => (m.id === id ? { ...m, roleId } : m)) }));
}

export function setMemberStatus(id: string, status: MemberStatus) {
  update((s) => ({ ...s, team: s.team.map((m) => (m.id === id ? { ...m, status } : m)) }));
}

export function setMemberPermissionOverride(id: string, perm: Permission, mode: "inherit" | "grant" | "revoke") {
  update((s) => ({
    ...s,
    team: s.team.map((m) => {
      if (m.id !== id) return m;
      const grants = m.grants.filter((p) => p !== perm);
      const revokes = m.revokes.filter((p) => p !== perm);
      if (mode === "grant") grants.push(perm);
      if (mode === "revoke") revokes.push(perm);
      return { ...m, grants, revokes };
    }),
  }));
}

export function clearMemberOverrides(id: string) {
  update((s) => ({ ...s, team: s.team.map((m) => (m.id === id ? { ...m, grants: [], revokes: [] } : m)) }));
}

export function deleteMember(id: string) {
  update((s) => ({
    ...s,
    team: s.team.filter((m) => m.id !== id),
    projects: s.projects.map((p) => ({ ...p, memberIds: p.memberIds.filter((mid) => mid !== id) })),
    tasks: s.tasks.map((t) => (t.assigneeId === id ? { ...t, assigneeId: null } : t)),
  }));
}

// ---------- Mutations: Roles ----------

export function createRole(input: Omit<Role, "id" | "builtIn">): Role {
  const r: Role = { ...input, id: uid("role-"), builtIn: false };
  update((s) => ({ ...s, roles: [...s.roles, r] }));
  return r;
}

export function updateRole(id: string, patch: Partial<Omit<Role, "id" | "builtIn">>) {
  update((s) => ({ ...s, roles: s.roles.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
}

export function deleteRole(id: string) {
  update((s) => {
    const role = s.roles.find((r) => r.id === id);
    if (!role || role.builtIn) return s;
    return {
      ...s,
      roles: s.roles.filter((r) => r.id !== id),
      team: s.team.map((m) => (m.roleId === id ? { ...m, roleId: "role-staff" } : m)),
    };
  });
}

export function effectivePermissions(member: TeamMember, roles: Role[]): Set<Permission> {
  const role = roles.find((r) => r.id === member.roleId);
  const set = new Set<Permission>(role?.permissions ?? []);
  for (const g of member.grants) set.add(g);
  for (const r of member.revokes) set.delete(r);
  return set;
}

export function memberHasPermission(member: TeamMember, roles: Role[], perm: Permission): boolean {
  return effectivePermissions(member, roles).has(perm);
}

// ---------- Mutations: Products ----------

export function createProduct(input: Omit<SaaSProduct, "id">): SaaSProduct {
  const p: SaaSProduct = { ...input, id: uid("sp-") };
  update((s) => ({ ...s, products: [p, ...s.products] }));
  return p;
}

export function updateProduct(id: string, patch: Partial<SaaSProduct>) {
  update((s) => ({ ...s, products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
}

export function deleteProduct(id: string) {
  update((s) => ({ ...s, products: s.products.filter((p) => p.id !== id) }));
}

// ---------- Mutations: Docs ----------

export function createDoc(input: Omit<Doc, "id" | "createdAt" | "updatedAt">): Doc {
  const t = now();
  const d: Doc = { ...input, id: uid("dc-"), createdAt: t, updatedAt: t };
  update((s) => ({ ...s, docs: [d, ...s.docs] }));
  return d;
}

export function updateDoc(id: string, patch: Partial<Doc>) {
  update((s) => ({
    ...s,
    docs: s.docs.map((d) => (d.id === id ? { ...d, ...patch, updatedAt: now() } : d)),
  }));
}

export function deleteDoc(id: string) {
  update((s) => ({ ...s, docs: s.docs.filter((d) => d.id !== id) }));
}

// ---------- Helpers ----------

export function formatIDR(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

export function formatDate(d: string | number): string {
  const date = typeof d === "string" ? new Date(d) : new Date(d);
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function projectProgress(projectId: string, store: Store): number {
  const tasks = store.tasks.filter((t) => t.projectId === projectId);
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.stage === "done").length;
  return Math.round((done / tasks.length) * 100);
}

// ---------- Mutations: Recruitment ----------

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function createJob(input: Omit<JobPosting, "id" | "slug" | "postedAt"> & { slug?: string }): JobPosting {
  const baseSlug = input.slug && input.slug.trim() ? slugify(input.slug) : slugify(input.title);
  // ensure unique slug
  let slug = baseSlug || `job-${Date.now()}`;
  let n = 2;
  while (state.jobs.some((j) => j.slug === slug)) slug = `${baseSlug}-${n++}`;
  const j: JobPosting = { ...input, slug, id: uid("job-"), postedAt: now() };
  update((s) => ({ ...s, jobs: [j, ...s.jobs] }));
  return j;
}

export function updateJob(id: string, patch: Partial<JobPosting>) {
  update((s) => ({ ...s, jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)) }));
}

export function deleteJob(id: string) {
  update((s) => ({
    ...s,
    jobs: s.jobs.filter((j) => j.id !== id),
    candidates: s.candidates.map((c) => (c.jobId === id ? { ...c, jobId: null } : c)),
    interviews: s.interviews.map((iv) => (iv.jobId === id ? { ...iv, jobId: null } : iv)),
  }));
}

export function createMPP(input: Omit<MPPRequest, "id" | "createdAt" | "decidedAt">): MPPRequest {
  const m: MPPRequest = { ...input, id: uid("mpp-"), createdAt: now(), decidedAt: null };
  update((s) => ({ ...s, mppRequests: [m, ...s.mppRequests] }));
  return m;
}

export function updateMPP(id: string, patch: Partial<MPPRequest>) {
  let approvedNow: MPPRequest | null = null;
  update((s) => ({
    ...s,
    mppRequests: s.mppRequests.map((m) => {
      if (m.id !== id) return m;
      const next = { ...m, ...patch };
      if (patch.status && (patch.status === "approved" || patch.status === "rejected") && !m.decidedAt) {
        next.decidedAt = now();
      }
      if (patch.status === "approved" && m.status !== "approved") approvedNow = next;
      return next;
    }),
  }));
  if (approvedNow) {
    const m = approvedNow as MPPRequest;
    const alreadyLinked = state.requisitions.some((r) => r.mppId === m.id);
    if (!alreadyLinked) {
      createRequisition({
        title: m.title,
        department: m.department,
        mppId: m.id,
        hiringManagerId: m.requestedById,
        openings: m.headcount,
        filled: 0,
        priority: "medium",
        status: "open",
        targetStartDate: new Date(Date.now() + 86400000 * 45).toISOString().slice(0, 10),
        notes: `Auto-created from MPP "${m.title}".`,
      });
    }
  }
}

export function deleteMPP(id: string) {
  update((s) => ({
    ...s,
    mppRequests: s.mppRequests.filter((m) => m.id !== id),
    requisitions: s.requisitions.map((r) => (r.mppId === id ? { ...r, mppId: null } : r)),
  }));
}

export function createRequisition(input: Omit<Requisition, "id" | "createdAt" | "code"> & { code?: string }): Requisition {
  const code = input.code && input.code.trim() ? input.code.trim() : `REQ-${new Date().getFullYear()}-${String(state.requisitions.length + 1).padStart(3, "0")}`;
  const r: Requisition = { ...input, code, id: uid("req-"), createdAt: now() };
  update((s) => ({ ...s, requisitions: [r, ...s.requisitions] }));
  if (r.status === "open") {
    const exists = state.jobs.some((j) => j.requisitionId === r.id);
    if (!exists) {
      createJob({
        title: r.title,
        team: r.department,
        location: "Remote / Jakarta",
        type: "Full-time",
        level: "Mid",
        summary: `Auto-drafted from requisition ${r.code}. Edit details before publishing.`,
        description: r.notes || "",
        status: "draft",
        requisitionId: r.id,
        hiringManagerId: r.hiringManagerId,
        openings: r.openings,
      });
    }
  }
  return r;
}

export function updateRequisition(id: string, patch: Partial<Requisition>) {
  update((s) => ({ ...s, requisitions: s.requisitions.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
}

export function deleteRequisition(id: string) {
  update((s) => ({
    ...s,
    requisitions: s.requisitions.filter((r) => r.id !== id),
    jobs: s.jobs.map((j) => (j.requisitionId === id ? { ...j, requisitionId: null } : j)),
  }));
}

export function createCandidate(input: Omit<Candidate, "id" | "appliedAt" | "notes"> & { notes?: CandidateNote[] }): Candidate {
  const c: Candidate = { ...input, id: uid("cand-"), appliedAt: now(), notes: input.notes ?? [] };
  update((s) => ({ ...s, candidates: [c, ...s.candidates] }));
  return c;
}

export function updateCandidate(id: string, patch: Partial<Candidate>) {
  update((s) => ({ ...s, candidates: s.candidates.map((c) => (c.id === id ? { ...c, ...patch } : c)) }));
}

export function moveCandidate(id: string, stage: CandidateStage) {
  update((s) => ({ ...s, candidates: s.candidates.map((c) => (c.id === id ? { ...c, stage } : c)) }));
  if (stage === "hired") {
    const cand = state.candidates.find((c) => c.id === id);
    const job = cand?.jobId ? state.jobs.find((j) => j.id === cand.jobId) : null;
    if (job?.requisitionId) {
      const reqId = job.requisitionId;
      update((s) => ({
        ...s,
        requisitions: s.requisitions.map((r) =>
          r.id === reqId
            ? { ...r, filled: Math.min(r.openings, r.filled + 1), status: r.filled + 1 >= r.openings ? "filled" : r.status }
            : r,
        ),
      }));
      const filledNow = state.requisitions.find((r) => r.id === reqId);
      if (filledNow && filledNow.status === "filled") {
        update((s) => ({
          ...s,
          jobs: s.jobs.map((j) => (j.requisitionId === reqId && j.status === "published" ? { ...j, status: "closed" } : j)),
        }));
      }
    }
  }
}

export function deleteCandidate(id: string) {
  update((s) => ({
    ...s,
    candidates: s.candidates.filter((c) => c.id !== id),
    interviews: s.interviews.filter((iv) => iv.candidateId !== id),
  }));
}

export function addCandidateNote(candidateId: string, message: string, authorId: string | null = null) {
  const trimmed = message.trim();
  if (!trimmed) return;
  const note: CandidateNote = { id: uid("n-"), at: now(), authorId, message: trimmed };
  update((s) => ({
    ...s,
    candidates: s.candidates.map((c) => (c.id === candidateId ? { ...c, notes: [note, ...c.notes] } : c)),
  }));
}

export function createInterview(input: Omit<Interview, "id" | "createdAt">): Interview {
  const iv: Interview = { ...input, id: uid("iv-"), createdAt: now() };
  update((s) => ({ ...s, interviews: [iv, ...s.interviews] }));
  return iv;
}

export function updateInterview(id: string, patch: Partial<Interview>) {
  update((s) => ({ ...s, interviews: s.interviews.map((iv) => (iv.id === id ? { ...iv, ...patch } : iv)) }));
}

export function deleteInterview(id: string) {
  update((s) => ({ ...s, interviews: s.interviews.filter((iv) => iv.id !== id) }));
}

export function formatDateTime(ts: number): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(ts));
}

// ---------- Mutations: Site Content ----------

export function updateSiteHero(patch: Partial<SiteHero>) {
  update((s) => ({ ...s, siteContent: { ...s.siteContent, hero: { ...s.siteContent.hero, ...patch } } }));
}

export function updateSiteFooter(patch: Partial<Omit<SiteFooter, "columns">>) {
  update((s) => ({ ...s, siteContent: { ...s.siteContent, footer: { ...s.siteContent.footer, ...patch } } }));
}

export function setSiteNav(nav: NavLink[]) {
  update((s) => ({ ...s, siteContent: { ...s.siteContent, nav } }));
}

export function addNavLink(label: string, to: string) {
  const link: NavLink = { id: uid("n-"), label: label || "Link", to: to || "/" };
  update((s) => ({ ...s, siteContent: { ...s.siteContent, nav: [...s.siteContent.nav, link] } }));
}

export function updateNavLink(id: string, patch: Partial<NavLink>) {
  update((s) => ({
    ...s,
    siteContent: { ...s.siteContent, nav: s.siteContent.nav.map((n) => (n.id === id ? { ...n, ...patch } : n)) },
  }));
}

export function removeNavLink(id: string) {
  update((s) => ({ ...s, siteContent: { ...s.siteContent, nav: s.siteContent.nav.filter((n) => n.id !== id) } }));
}

export function addFooterColumn() {
  const col: FooterColumn = { id: uid("fc-"), title: "New column", links: [] };
  update((s) => ({
    ...s,
    siteContent: { ...s.siteContent, footer: { ...s.siteContent.footer, columns: [...s.siteContent.footer.columns, col] } },
  }));
}

export function updateFooterColumn(id: string, patch: Partial<Omit<FooterColumn, "links" | "id">>) {
  update((s) => ({
    ...s,
    siteContent: {
      ...s.siteContent,
      footer: {
        ...s.siteContent.footer,
        columns: s.siteContent.footer.columns.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      },
    },
  }));
}

export function removeFooterColumn(id: string) {
  update((s) => ({
    ...s,
    siteContent: {
      ...s.siteContent,
      footer: { ...s.siteContent.footer, columns: s.siteContent.footer.columns.filter((c) => c.id !== id) },
    },
  }));
}

export function addFooterLink(columnId: string) {
  const link: FooterLink = { id: uid("fl-"), label: "New link", to: "/" };
  update((s) => ({
    ...s,
    siteContent: {
      ...s.siteContent,
      footer: {
        ...s.siteContent.footer,
        columns: s.siteContent.footer.columns.map((c) => (c.id === columnId ? { ...c, links: [...c.links, link] } : c)),
      },
    },
  }));
}

export function updateFooterLink(columnId: string, linkId: string, patch: Partial<FooterLink>) {
  update((s) => ({
    ...s,
    siteContent: {
      ...s.siteContent,
      footer: {
        ...s.siteContent.footer,
        columns: s.siteContent.footer.columns.map((c) =>
          c.id === columnId ? { ...c, links: c.links.map((l) => (l.id === linkId ? { ...l, ...patch } : l)) } : c,
        ),
      },
    },
  }));
}

export function removeFooterLink(columnId: string, linkId: string) {
  update((s) => ({
    ...s,
    siteContent: {
      ...s.siteContent,
      footer: {
        ...s.siteContent.footer,
        columns: s.siteContent.footer.columns.map((c) =>
          c.id === columnId ? { ...c, links: c.links.filter((l) => l.id !== linkId) } : c,
        ),
      },
    },
  }));
}

export function addSection() {
  const sec: SiteSection = { id: uid("sec-"), title: "New section", subtitle: "", visible: true, cards: [] };
  update((s) => ({ ...s, siteContent: { ...s.siteContent, sections: [...s.siteContent.sections, sec] } }));
}

export function updateSection(id: string, patch: Partial<Omit<SiteSection, "cards" | "id">>) {
  update((s) => ({
    ...s,
    siteContent: { ...s.siteContent, sections: s.siteContent.sections.map((sec) => (sec.id === id ? { ...sec, ...patch } : sec)) },
  }));
}

export function removeSection(id: string) {
  update((s) => ({
    ...s,
    siteContent: { ...s.siteContent, sections: s.siteContent.sections.filter((sec) => sec.id !== id) },
  }));
}

export function addSectionCard(sectionId: string) {
  const card: SectionCard = { id: uid("sc-"), title: "New card", description: "" };
  update((s) => ({
    ...s,
    siteContent: {
      ...s.siteContent,
      sections: s.siteContent.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, cards: [...sec.cards, card] } : sec,
      ),
    },
  }));
}

export function updateSectionCard(sectionId: string, cardId: string, patch: Partial<SectionCard>) {
  update((s) => ({
    ...s,
    siteContent: {
      ...s.siteContent,
      sections: s.siteContent.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, cards: sec.cards.map((c) => (c.id === cardId ? { ...c, ...patch } : c)) } : sec,
      ),
    },
  }));
}

export function removeSectionCard(sectionId: string, cardId: string) {
  update((s) => ({
    ...s,
    siteContent: {
      ...s.siteContent,
      sections: s.siteContent.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, cards: sec.cards.filter((c) => c.id !== cardId) } : sec,
      ),
    },
  }));
}

// ---------- Reorder helpers (Content Studio) ----------

function moveInArray<T>(arr: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= arr.length || to >= arr.length) return arr;
  const next = arr.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function reorderNav(from: number, to: number) {
  update((s) => ({ ...s, siteContent: { ...s.siteContent, nav: moveInArray(s.siteContent.nav, from, to) } }));
}

export function reorderSections(from: number, to: number) {
  update((s) => ({ ...s, siteContent: { ...s.siteContent, sections: moveInArray(s.siteContent.sections, from, to) } }));
}

export function reorderSectionCards(sectionId: string, from: number, to: number) {
  update((s) => ({
    ...s,
    siteContent: {
      ...s.siteContent,
      sections: s.siteContent.sections.map((sec) =>
        sec.id === sectionId ? { ...sec, cards: moveInArray(sec.cards, from, to) } : sec,
      ),
    },
  }));
}

export function reorderFooterColumns(from: number, to: number) {
  update((s) => ({
    ...s,
    siteContent: {
      ...s.siteContent,
      footer: { ...s.siteContent.footer, columns: moveInArray(s.siteContent.footer.columns, from, to) },
    },
  }));
}

export function reorderFooterLinks(columnId: string, from: number, to: number) {
  update((s) => ({
    ...s,
    siteContent: {
      ...s.siteContent,
      footer: {
        ...s.siteContent.footer,
        columns: s.siteContent.footer.columns.map((c) =>
          c.id === columnId ? { ...c, links: moveInArray(c.links, from, to) } : c,
        ),
      },
    },
  }));
}

// ---------- Meeting helpers ----------

export function generateMeetingLink(provider: MeetingProvider): string {
  const code = Math.random().toString(36).slice(2, 6) + "-" + Math.random().toString(36).slice(2, 6) + "-" + Math.random().toString(36).slice(2, 5);
  switch (provider) {
    case "google-meet":
      return `https://meet.google.com/${code}`;
    case "ms-teams":
      return `https://teams.microsoft.com/l/meetup-join/zns-${code}`;
    case "zoom":
      return `https://zoom.us/j/${Math.floor(Math.random() * 9_000_000_000) + 1_000_000_000}`;
    default:
      return "";
  }
}

export function meetingProviderLabel(p: MeetingProvider): string {
  switch (p) {
    case "google-meet": return "Google Meet";
    case "ms-teams": return "Microsoft Teams";
    case "zoom": return "Zoom";
    case "onsite": return "On-site";
    case "phone": return "Phone";
    default: return "—";
  }
}

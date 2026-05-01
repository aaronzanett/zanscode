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

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  joinedAt: number;
};

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
};

export type Doc = {
  id: string;
  title: string;
  category: string;
  content: string; // markdown-ish plain text
  updatedAt: number;
  createdAt: number;
};

export type Store = {
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  transactions: Transaction[];
  team: TeamMember[];
  products: SaaSProduct[];
  docs: Doc[];
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
    { id: "tm-andi", name: "Andi Wibowo", email: "andi@zanscode.com", role: "Engineering Lead", initials: "AW", joinedAt: now() - 1000 * 60 * 60 * 24 * 400 },
    { id: "tm-maya", name: "Maya Putri", email: "maya@zanscode.com", role: "Product Manager", initials: "MP", joinedAt: now() - 1000 * 60 * 60 * 24 * 320 },
    { id: "tm-bagus", name: "Bagus Pratama", email: "bagus@zanscode.com", role: "Senior Developer", initials: "BP", joinedAt: now() - 1000 * 60 * 60 * 24 * 220 },
    { id: "tm-sinta", name: "Sinta Lestari", email: "sinta@zanscode.com", role: "UI/UX Designer", initials: "SL", joinedAt: now() - 1000 * 60 * 60 * 24 * 180 },
    { id: "tm-reza", name: "Reza Hakim", email: "reza@zanscode.com", role: "QA Engineer", initials: "RH", joinedAt: now() - 1000 * 60 * 60 * 24 * 90 },
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
    { id: "sp-zen-pos", name: "ZenPOS", tagline: "Point-of-sale for modern retail", status: "live", totalUsers: 4820, activeUsers: 3160, mrr: 84000000, churn: 2.4, launchedAt: isoDate(-540) },
    { id: "sp-zen-hr", name: "ZenHR", tagline: "Lightweight HRIS for SMBs", status: "live", totalUsers: 2140, activeUsers: 1580, mrr: 42000000, churn: 3.1, launchedAt: isoDate(-380) },
    { id: "sp-zen-stock", name: "ZenStock", tagline: "Inventory & supplier ops", status: "beta", totalUsers: 320, activeUsers: 240, mrr: 6500000, churn: 4.2, launchedAt: isoDate(-90) },
  ];

  const docs: Doc[] = [
    { id: uid("dc-"), title: "Engineering Onboarding", category: "Engineering", content: "# Welcome\n\nSetup steps:\n- Get repo access\n- Install Bun + Node 20\n- Run `bun install`\n- Read the architecture doc\n\nReach out to Andi for credentials.", updatedAt: now() - 86400000 * 10, createdAt: now() - 86400000 * 60 },
    { id: uid("dc-"), title: "Client Communication SOP", category: "Operations", content: "# Client Comms\n\n- Reply within 1 business day.\n- Weekly status update every Friday.\n- Escalate blockers to PM same-day.\n", updatedAt: now() - 86400000 * 4, createdAt: now() - 86400000 * 90 },
    { id: uid("dc-"), title: "Incident Response Runbook", category: "Engineering", content: "# Incident Response\n\n1. Acknowledge in #incidents.\n2. Assign incident commander.\n3. Open status page entry.\n4. Postmortem within 5 days.", updatedAt: now() - 86400000 * 18, createdAt: now() - 86400000 * 120 },
  ];

  return { clients, projects, tasks, transactions, team, products, docs };
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

export function createMember(input: Omit<TeamMember, "id" | "joinedAt" | "initials">): TeamMember {
  const initials = input.name.split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "ZS";
  const m: TeamMember = { ...input, id: uid("tm-"), joinedAt: now(), initials };
  update((s) => ({ ...s, team: [m, ...s.team] }));
  return m;
}

export function updateMember(id: string, patch: Partial<TeamMember>) {
  update((s) => ({ ...s, team: s.team.map((m) => (m.id === id ? { ...m, ...patch } : m)) }));
}

export function deleteMember(id: string) {
  update((s) => ({
    ...s,
    team: s.team.filter((m) => m.id !== id),
    projects: s.projects.map((p) => ({ ...p, memberIds: p.memberIds.filter((mid) => mid !== id) })),
    tasks: s.tasks.map((t) => (t.assigneeId === id ? { ...t, assigneeId: null } : t)),
  }));
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

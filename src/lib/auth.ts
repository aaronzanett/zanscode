// Mock staff auth — replace with Lovable Cloud when wiring real auth.
// Stored in localStorage so the demo session survives reloads.

export type StaffRole = "admin" | "manager" | "staff";

export type StaffSession = {
  email: string;
  name: string;
  initials: string;
  role: StaffRole;
  signedInAt: number;
};

const STORAGE_KEY = "zanscode.staff.session";

// Demo accounts. In production these come from the backend.
const DEMO_ACCOUNTS: Record<string, { password: string; name: string; role: StaffRole }> = {
  "admin@zanscode.com": { password: "admin123", name: "Admin Zanscode", role: "admin" },
  "manager@zanscode.com": { password: "manager123", name: "Maya Putri", role: "manager" },
  "staff@zanscode.com": { password: "staff123", name: "Bagus Pratama", role: "staff" },
};

function toInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "ZS";
}

export function getSession(): StaffSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StaffSession;
  } catch {
    return null;
  }
}

export function isSignedIn(): boolean {
  return getSession() !== null;
}

export async function signIn(email: string, password: string): Promise<StaffSession> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 450));
  const key = email.trim().toLowerCase();
  const account = DEMO_ACCOUNTS[key];
  if (!account || account.password !== password) {
    throw new Error("Email atau kata sandi salah.");
  }
  const session: StaffSession = {
    email: key,
    name: account.name,
    initials: toInitials(account.name),
    role: account.role,
    signedInAt: Date.now(),
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }
  return session;
}

export function signOut(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export const DEMO_HINTS = [
  { email: "admin@zanscode.com", password: "admin123", role: "Admin" },
  { email: "manager@zanscode.com", password: "manager123", role: "Manager" },
  { email: "staff@zanscode.com", password: "staff123", role: "Staff" },
];

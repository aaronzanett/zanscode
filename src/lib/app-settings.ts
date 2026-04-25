// Mock app-wide settings store — persisted to localStorage.
// Replace with Lovable Cloud when wiring real backend.

export type AppSettings = {
  appName: string;
  companyName: string;
  domain: string;
  currency: string;
  timezone: string;
  language: "id" | "en";
  dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
  weekStart: "sunday" | "monday";
  theme: "system" | "light" | "dark";
  density: "comfortable" | "compact";
  maintenanceMode: boolean;
  maintenanceMessage: string;
  allowSignup: boolean;
  twoFactorRequired: boolean;
  sessionTimeoutMinutes: number;
  notifyEmail: boolean;
  notifyInApp: boolean;
  notifyDigest: "off" | "daily" | "weekly";
};

const STORAGE_KEY = "zanscode.app.settings";

export const DEFAULT_SETTINGS: AppSettings = {
  appName: "Zanscode OS",
  companyName: "Zanscode",
  domain: "zanscode.com",
  currency: "IDR",
  timezone: "Asia/Jakarta",
  language: "id",
  dateFormat: "DD/MM/YYYY",
  weekStart: "monday",
  theme: "system",
  density: "comfortable",
  maintenanceMode: false,
  maintenanceMessage: "Sistem sedang dalam pemeliharaan. Silakan kembali sebentar lagi.",
  allowSignup: false,
  twoFactorRequired: false,
  sessionTimeoutMinutes: 60,
  notifyEmail: true,
  notifyInApp: true,
  notifyDigest: "daily",
};

const listeners = new Set<(s: AppSettings) => void>();

export function getAppSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function setAppSettings(next: AppSettings): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((l) => l(next));
  // Allow cross-tab updates via storage event
  window.dispatchEvent(new CustomEvent("zanscode:settings", { detail: next }));
}

export function subscribeAppSettings(cb: (s: AppSettings) => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb(getAppSettings());
  };
  const onCustom = () => cb(getAppSettings());
  window.addEventListener("storage", onStorage);
  window.addEventListener("zanscode:settings", onCustom as EventListener);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("zanscode:settings", onCustom as EventListener);
  };
}

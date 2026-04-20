// Host-based routing helper for the subdomain split.
// In production: marketing on root domain, internal app on `app.*` subdomain.

const APP_HOST_PREFIX = "app.";

export function isAppSubdomain(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hostname.startsWith(APP_HOST_PREFIX);
}

export function isLocalHost(): boolean {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h === "localhost" || h === "127.0.0.1" || h.endsWith(".lovable.app") || h.endsWith(".lovableproject.com");
}

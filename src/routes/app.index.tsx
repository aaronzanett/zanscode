import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  ShoppingBag,
  Users,
  Activity,
  Sunrise,
  Sun,
  Sunset,
  Moon,
} from "lucide-react";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

const kpis = [
  { l: "Revenue", v: "$284,392", d: "+12.4%", up: true, i: DollarSign },
  { l: "Active Customers", v: "1,284", d: "+5.2%", up: true, i: Users },
  { l: "Orders Today", v: "342", d: "-2.1%", up: false, i: ShoppingBag },
  { l: "Uptime", v: "99.98%", d: "+0.02%", up: true, i: Activity },
];

const activity = [
  { t: "Invoice #INV-2041 paid", w: "Acme Corp", a: "$4,200", time: "2m ago" },
  { t: "New customer onboarded", w: "Northwind Ltd", a: "—", time: "21m ago" },
  { t: "Project milestone completed", w: "Zenith App v2", a: "—", time: "1h ago" },
  { t: "Stock replenished — SKU 8821", w: "Warehouse JKT", a: "+240", time: "3h ago" },
  { t: "Monthly subscription renewed", w: "Riverside Inc", a: "$1,290", time: "5h ago" },
];

type Period = "morning" | "midday" | "afternoon" | "evening" | "night";

function getJakartaHour(date: Date): number {
  // Get hour in Asia/Jakarta regardless of client timezone
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const h = parts.find((p) => p.type === "hour")?.value ?? "0";
  return parseInt(h, 10) % 24;
}

function getPeriod(hour: number): Period {
  if (hour >= 5 && hour < 10) return "morning";
  if (hour >= 10 && hour < 15) return "midday";
  if (hour >= 15 && hour < 18) return "afternoon";
  if (hour >= 18 && hour < 21) return "evening";
  return "night";
}

const periodConfig: Record<
  Period,
  {
    label: string;
    greetings: string[];
    sub: string[];
    icon: typeof Sunrise;
    // Sky gradient (top to bottom)
    sky: string;
    // Sun/moon position & color
    orbX: string; // e.g. "20%"
    orbY: string;
    orbColor: string;
    orbGlow: string;
    // Silhouette/foreground tone
    silhouette: string;
    // Accent ring color
    accent: string;
  }
> = {
  morning: {
    label: "Pagi",
    greetings: [
      "Selamat pagi ☀️",
      "Pagi yang cerah!",
      "Halo, selamat pagi",
      "Semangat pagi 🌅",
    ],
    sub: [
      "Mulai hari dengan langkah ringan dan fokus yang jernih.",
      "Secangkir kopi dan satu kemenangan kecil — itu sudah cukup untuk memulai.",
      "Hari baru, peluang baru. Ayo kita buat berarti.",
    ],
    icon: Sunrise,
    sky: "linear-gradient(180deg, #ffd89b 0%, #ffb56b 45%, #ff8a5b 100%)",
    orbX: "22%",
    orbY: "62%",
    orbColor: "#fff3b0",
    orbGlow: "#ffd166",
    silhouette: "#7a3b2e",
    accent: "rgba(255, 209, 102, 0.55)",
  },
  midday: {
    label: "Siang",
    greetings: [
      "Selamat siang 🌤️",
      "Halo, siang ini produktif?",
      "Apa kabar siang ini?",
    ],
    sub: [
      "Ambil napas sebentar, lalu lanjutkan dengan tenang.",
      "Tetap terhidrasi — performa terbaik datang dari tubuh yang segar.",
      "Sedikit istirahat sering kali mempercepat hasil.",
    ],
    icon: Sun,
    sky: "linear-gradient(180deg, #7ec8ff 0%, #b6e0ff 50%, #e8f4ff 100%)",
    orbX: "75%",
    orbY: "20%",
    orbColor: "#fffbe6",
    orbGlow: "#ffe680",
    silhouette: "#1f4d6b",
    accent: "rgba(126, 200, 255, 0.6)",
  },
  afternoon: {
    label: "Sore",
    greetings: [
      "Selamat sore 🌇",
      "Sore yang hangat",
      "Halo, sudah sore",
    ],
    sub: [
      "Tinjau kembali progres hari ini — apa yang patut dirayakan?",
      "Saat terbaik untuk merapikan ekor pekerjaan sebelum esok.",
      "Sedikit refleksi sore mempertajam langkah esok hari.",
    ],
    icon: Sunset,
    sky: "linear-gradient(180deg, #ffb178 0%, #ff7e5f 45%, #c44569 100%)",
    orbX: "78%",
    orbY: "55%",
    orbColor: "#fff1c1",
    orbGlow: "#ff9966",
    silhouette: "#3a1f3a",
    accent: "rgba(255, 126, 95, 0.55)",
  },
  evening: {
    label: "Petang",
    greetings: [
      "Selamat petang 🌆",
      "Hari hampir usai",
      "Halo, petang yang tenang",
    ],
    sub: [
      "Saatnya menutup hari dengan rapi.",
      "Tarik napas — kamu sudah melewati banyak hal hari ini.",
      "Catat satu hal yang membuat hari ini bermakna.",
    ],
    icon: Sunset,
    sky: "linear-gradient(180deg, #4b3b8f 0%, #7a4a8c 45%, #d96e7a 100%)",
    orbX: "80%",
    orbY: "70%",
    orbColor: "#ffe4b5",
    orbGlow: "#ff7e5f",
    silhouette: "#1a1338",
    accent: "rgba(217, 110, 122, 0.5)",
  },
  night: {
    label: "Malam",
    greetings: [
      "Selamat malam 🌙",
      "Malam yang tenang",
      "Halo, masih bekerja?",
    ],
    sub: [
      "Beri ruang untuk istirahat — esok masih panjang.",
      "Bintang-bintang sudah keluar; mungkin saatnya pelan-pelan.",
      "Ide terbaik sering datang setelah tidur yang cukup.",
    ],
    icon: Moon,
    sky: "linear-gradient(180deg, #0b1029 0%, #161a3d 50%, #2a1f4a 100%)",
    orbX: "78%",
    orbY: "22%",
    orbColor: "#f4f1e1",
    orbGlow: "#cdd6ff",
    silhouette: "#05060f",
    accent: "rgba(120, 130, 220, 0.45)",
  },
};

function pickStable<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function Dashboard() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    // Update every minute — period boundaries don't need second precision
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const { period, config, greeting, sub, userName } = useMemo(() => {
    const hour = getJakartaHour(now);
    const period = getPeriod(hour);
    const config = periodConfig[period];
    // Stable per-day seed so the message doesn't flicker every minute
    const dayKey = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);
    const seed = dayKey.split("-").reduce((a, b) => a + parseInt(b, 10), 0);
    return {
      period,
      config,
      greeting: pickStable(config.greetings, seed),
      sub: pickStable(config.sub, seed + hour),
      userName: "",
    };
  }, [now]);

  const Icon = config.icon;
  const isNight = period === "night";
  const isEvening = period === "evening";

  return (
    <div className="space-y-6">
      {/* Greeting hero with time-adaptive silhouette */}
      <div
        className="relative overflow-hidden rounded-2xl border border-border shadow-soft"
        aria-label={`Greeting — ${config.label}`}
      >
        {/* Sky background */}
        <div
          className="absolute inset-0 transition-[background] duration-1000"
          style={{ background: config.sky }}
        />

        {/* Sun / Moon orb */}
        <div
          className="absolute h-32 w-32 rounded-full blur-[2px] transition-all duration-1000"
          style={{
            left: config.orbX,
            top: config.orbY,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle at 35% 35%, ${config.orbColor} 0%, ${config.orbGlow} 55%, transparent 75%)`,
            boxShadow: `0 0 80px 20px ${config.orbGlow}55`,
          }}
        />

        {/* Stars (only at night/evening) */}
        {(isNight || isEvening) && (
          <svg
            className="absolute inset-0 h-full w-full opacity-80"
            viewBox="0 0 800 240"
            preserveAspectRatio="none"
            aria-hidden
          >
            {Array.from({ length: isNight ? 28 : 12 }).map((_, i) => {
              const x = (i * 73) % 800;
              const y = (i * 31) % 110;
              const r = ((i % 3) + 1) * 0.6;
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={r}
                  fill="white"
                  opacity={0.4 + ((i * 13) % 50) / 100}
                />
              );
            })}
          </svg>
        )}

        {/* Cloud accents (day periods) */}
        {(period === "morning" || period === "midday" || period === "afternoon") && (
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 800 240"
            preserveAspectRatio="none"
            aria-hidden
          >
            <g fill="white" opacity="0.35">
              <ellipse cx="120" cy="60" rx="60" ry="14" />
              <ellipse cx="160" cy="55" rx="40" ry="12" />
              <ellipse cx="560" cy="90" rx="70" ry="14" />
              <ellipse cx="600" cy="85" rx="45" ry="11" />
            </g>
          </svg>
        )}

        {/* Skyline silhouette */}
        <svg
          className="absolute bottom-0 left-0 h-full w-full"
          viewBox="0 0 800 240"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id="silhouetteFade" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={config.silhouette} stopOpacity="0.95" />
              <stop offset="100%" stopColor={config.silhouette} stopOpacity="1" />
            </linearGradient>
          </defs>
          {/* Distant hills */}
          <path
            d="M0,180 Q150,140 300,160 T600,150 T800,170 L800,240 L0,240 Z"
            fill={config.silhouette}
            opacity="0.45"
          />
          {/* City skyline */}
          <path
            d="M0,200
               L40,200 L40,170 L70,170 L70,200
               L110,200 L110,150 L130,150 L130,140 L150,140 L150,200
               L190,200 L190,165 L210,165 L210,180 L235,180 L235,200
               L280,200 L280,135 L295,135 L295,125 L310,125 L310,135 L325,135 L325,200
               L370,200 L370,175 L395,175 L395,155 L415,155 L415,200
               L460,200 L460,160 L480,160 L480,145 L500,145 L500,160 L520,160 L520,200
               L560,200 L560,170 L585,170 L585,200
               L625,200 L625,140 L645,140 L645,130 L665,130 L665,140 L685,140 L685,200
               L725,200 L725,175 L755,175 L755,200
               L800,200 L800,240 L0,240 Z"
            fill="url(#silhouetteFade)"
          />
          {/* Window lights for evening/night */}
          {(isEvening || isNight) && (
            <g fill="#ffd27a" opacity={isNight ? 0.85 : 0.7}>
              <rect x="115" y="155" width="3" height="3" />
              <rect x="122" y="160" width="3" height="3" />
              <rect x="285" y="142" width="3" height="3" />
              <rect x="295" y="150" width="3" height="3" />
              <rect x="302" y="142" width="3" height="3" />
              <rect x="378" y="180" width="3" height="3" />
              <rect x="385" y="185" width="3" height="3" />
              <rect x="465" y="168" width="3" height="3" />
              <rect x="488" y="152" width="3" height="3" />
              <rect x="495" y="160" width="3" height="3" />
              <rect x="630" y="148" width="3" height="3" />
              <rect x="650" y="138" width="3" height="3" />
              <rect x="670" y="148" width="3" height="3" />
              <rect x="730" y="182" width="3" height="3" />
              <rect x="740" y="188" width="3" height="3" />
            </g>
          )}
        </svg>

        {/* Soft top glow for legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.25) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative px-6 py-10 sm:px-8 sm:py-12">
          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm"
            style={{
              borderColor: config.accent,
              background: "rgba(255,255,255,0.12)",
              color: "white",
            }}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{config.label} • Waktu Indonesia Barat</span>
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow-sm sm:text-4xl">
            {greeting}
            {userName ? `, ${userName}` : ""}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/85 sm:text-base">{sub}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.l} className="rounded-xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{k.l}</span>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-brand"><k.i className="h-4 w-4" /></div>
            </div>
            <div className="mt-3 text-2xl font-bold">{k.v}</div>
            <div className={`mt-1 flex items-center gap-1 text-xs ${k.up ? "text-emerald-600" : "text-rose-600"}`}>
              {k.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />} {k.d} vs last week
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Revenue trend</h2>
            <span className="text-xs text-muted-foreground">Last 30 days</span>
          </div>
          <svg viewBox="0 0 600 200" className="mt-4 h-56 w-full">
            <defs>
              <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.55 0.18 245)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="oklch(0.55 0.18 245)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0,150 C50,120 100,160 150,110 S250,40 300,80 S400,150 450,90 S550,30 600,60 L600,200 L0,200 Z" fill="url(#g)" />
            <path d="M0,150 C50,120 100,160 150,110 S250,40 300,80 S400,150 450,90 S550,30 600,60" fill="none" stroke="oklch(0.55 0.18 245)" strokeWidth="2.5" />
          </svg>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-semibold">Recent activity</h2>
          <ul className="mt-4 space-y-4">
            {activity.map((a, i) => (
              <li key={i} className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <div className="font-medium">{a.t}</div>
                  <div className="text-xs text-muted-foreground">{a.w} • {a.time}</div>
                </div>
                <div className="text-xs font-semibold text-brand">{a.a}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

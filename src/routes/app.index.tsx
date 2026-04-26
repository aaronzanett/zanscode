import { createFileRoute, Link } from "@tanstack/react-router";
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
  Plus,
  FileText,
  UserPlus,
  Receipt,
  CheckCircle2,
  Circle,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { getSession } from "@/lib/auth";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

const kpis = [
  {
    l: "Revenue",
    v: "$284K",
    d: "+12.4%",
    up: true,
    i: DollarSign,
    spark: [12, 18, 14, 22, 19, 26, 24, 30, 28, 34, 32, 40],
  },
  {
    l: "Customers",
    v: "1,284",
    d: "+5.2%",
    up: true,
    i: Users,
    spark: [20, 22, 21, 24, 23, 26, 25, 28, 27, 30, 29, 33],
  },
  {
    l: "Orders",
    v: "342",
    d: "-2.1%",
    up: false,
    i: ShoppingBag,
    spark: [30, 28, 32, 26, 24, 28, 22, 25, 20, 23, 21, 19],
  },
  {
    l: "Uptime",
    v: "99.98%",
    d: "+0.02%",
    up: true,
    i: Activity,
    spark: [38, 39, 39, 40, 39, 40, 40, 39, 40, 40, 40, 40],
  },
];

const activity = [
  { t: "Invoice #INV-2041 paid", w: "Acme Corp", a: "$4,200", time: "2m", tone: "emerald" as const },
  { t: "New customer onboarded", w: "Northwind Ltd", a: "—", time: "21m", tone: "sky" as const },
  { t: "Project milestone completed", w: "Zenith App v2", a: "—", time: "1h", tone: "violet" as const },
  { t: "Stock replenished — SKU 8821", w: "Jakarta Warehouse", a: "+240", time: "3h", tone: "amber" as const },
  { t: "Subscription renewed", w: "Riverside Inc", a: "$1,290", time: "5h", tone: "emerald" as const },
];

const tasks = [
  { t: "Review Q2 budget proposal", due: "Today", done: false },
  { t: "Approve 3 leave requests", due: "Today", done: false },
  { t: "Sign off vendor contract", due: "Tomorrow", done: false },
  { t: "Send weekly report to board", due: "Friday", done: true },
];

const quickActions = [
  { t: "Create invoice", to: "/app/finance" as const, i: FileText },
  { t: "Add customer", to: "/app/customers" as const, i: UserPlus },
  { t: "Log expense", to: "/app/expenses" as const, i: Receipt },
  { t: "New task", to: "/app/tasks" as const, i: Plus },
];

type Period = "morning" | "midday" | "afternoon" | "evening" | "night";

function getJakartaHour(date: Date): number {
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
    sky: string;
    orbX: string;
    orbY: string;
    orbColor: string;
    orbGlow: string;
    silhouette: string;
    accent: string;
  }
> = {
  morning: {
    label: "Morning",
    greetings: ["Good morning", "Rise and shine", "Hello, good morning", "A bright new morning"],
    sub: [
      "Start the day with a light step and a clear focus.",
      "A cup of coffee and one small win — that's enough to begin.",
      "A new day, new chances. Let's make it count.",
    ],
    icon: Sunrise,
    sky: "linear-gradient(180deg, #ffd89b 0%, #ffb56b 45%, #ff8a5b 100%)",
    orbX: "22%",
    orbY: "65%",
    orbColor: "#fff3b0",
    orbGlow: "#ffd166",
    silhouette: "#7a3b2e",
    accent: "rgba(255, 209, 102, 0.55)",
  },
  midday: {
    label: "Midday",
    greetings: ["Good afternoon", "Hope your day is productive", "How's your day going?"],
    sub: [
      "Take a breath, then carry on calmly.",
      "Stay hydrated — peak performance comes from a fresh body.",
      "A short break often speeds up the result.",
    ],
    icon: Sun,
    sky: "linear-gradient(180deg, #7ec8ff 0%, #b6e0ff 50%, #e8f4ff 100%)",
    orbX: "78%",
    orbY: "25%",
    orbColor: "#fffbe6",
    orbGlow: "#ffe680",
    silhouette: "#1f4d6b",
    accent: "rgba(126, 200, 255, 0.6)",
  },
  afternoon: {
    label: "Late afternoon",
    greetings: ["Good afternoon", "A warm afternoon", "Hello, the day rolls on"],
    sub: [
      "Look back at today's progress — what's worth celebrating?",
      "A great time to tidy up loose ends before tomorrow.",
      "A little afternoon reflection sharpens tomorrow's steps.",
    ],
    icon: Sunset,
    sky: "linear-gradient(180deg, #ffb178 0%, #ff7e5f 45%, #c44569 100%)",
    orbX: "80%",
    orbY: "60%",
    orbColor: "#fff1c1",
    orbGlow: "#ff9966",
    silhouette: "#3a1f3a",
    accent: "rgba(255, 126, 95, 0.55)",
  },
  evening: {
    label: "Evening",
    greetings: ["Good evening", "The day is winding down", "Hello, a calm evening"],
    sub: [
      "Time to wrap things up neatly.",
      "Take a breath — you've moved through a lot today.",
      "Note one thing that made today meaningful.",
    ],
    icon: Sunset,
    sky: "linear-gradient(180deg, #4b3b8f 0%, #7a4a8c 45%, #d96e7a 100%)",
    orbX: "82%",
    orbY: "70%",
    orbColor: "#ffe4b5",
    orbGlow: "#ff7e5f",
    silhouette: "#1a1338",
    accent: "rgba(217, 110, 122, 0.5)",
  },
  night: {
    label: "Night",
    greetings: ["Good night", "A quiet night", "Hello, still working?"],
    sub: [
      "Make space for rest — tomorrow is still long.",
      "The stars are out; perhaps it's time to slow down.",
      "The best ideas often come after good sleep.",
    ],
    icon: Moon,
    sky: "linear-gradient(180deg, #0b1029 0%, #161a3d 50%, #2a1f4a 100%)",
    orbX: "80%",
    orbY: "28%",
    orbColor: "#f4f1e1",
    orbGlow: "#cdd6ff",
    silhouette: "#05060f",
    accent: "rgba(120, 130, 220, 0.45)",
  },
};

function pickStable<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

const toneClass: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${30 - ((v - min) / range) * 28}`)
    .join(" ");
  const color = up ? "rgb(16 185 129)" : "rgb(244 63 94)";
  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-8 w-full">
      <defs>
        <linearGradient id={`sg-${up}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points={`0,32 ${points} 100,32`} fill={`url(#sg-${up})`} />
    </svg>
  );
}

function Dashboard() {
  const [now, setNow] = useState<Date>(() => new Date());
  const [taskState, setTaskState] = useState(tasks);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const { period, config, greeting, sub, userName, dateLabel } = useMemo(() => {
    const hour = getJakartaHour(now);
    const period = getPeriod(hour);
    const config = periodConfig[period];
    const dayKey = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Jakarta",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);
    const seed = dayKey.split("-").reduce((a, b) => a + parseInt(b, 10), 0);
    const dateLabel = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Jakarta",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(now);
    return {
      period,
      config,
      greeting: pickStable(config.greetings, seed),
      sub: pickStable(config.sub, seed + hour),
      userName: getSession()?.name?.split(" ")[0] ?? "",
      dateLabel,
    };
  }, [now]);

  const Icon = config.icon;
  const isNight = period === "night";
  const isEvening = period === "evening";

  const toggleTask = (i: number) =>
    setTaskState((prev) => prev.map((t, idx) => (idx === i ? { ...t, done: !t.done } : t)));

  return (
    <div className="space-y-5">
      {/* Greeting hero — compact */}
      <div
        className="relative h-44 overflow-hidden rounded-2xl border border-border shadow-soft sm:h-48"
        aria-label={`Greeting — ${config.label}`}
      >
        <div className="absolute inset-0 transition-[background] duration-1000" style={{ background: config.sky }} />
        <div
          className="absolute h-24 w-24 rounded-full blur-[2px] transition-all duration-1000"
          style={{
            left: config.orbX,
            top: config.orbY,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle at 35% 35%, ${config.orbColor} 0%, ${config.orbGlow} 55%, transparent 75%)`,
            boxShadow: `0 0 60px 16px ${config.orbGlow}55`,
          }}
        />
        {(isNight || isEvening) && (
          <svg className="absolute inset-0 h-full w-full opacity-80" viewBox="0 0 800 200" preserveAspectRatio="none" aria-hidden>
            {Array.from({ length: isNight ? 24 : 10 }).map((_, i) => {
              const x = (i * 73) % 800;
              const y = (i * 31) % 90;
              const r = ((i % 3) + 1) * 0.5;
              return <circle key={i} cx={x} cy={y} r={r} fill="white" opacity={0.4 + ((i * 13) % 50) / 100} />;
            })}
          </svg>
        )}
        {(period === "morning" || period === "midday" || period === "afternoon") && (
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 800 200" preserveAspectRatio="none" aria-hidden>
            <g fill="white" opacity="0.32">
              <ellipse cx="120" cy="50" rx="55" ry="12" />
              <ellipse cx="155" cy="46" rx="36" ry="10" />
              <ellipse cx="560" cy="75" rx="65" ry="12" />
              <ellipse cx="600" cy="71" rx="42" ry="10" />
            </g>
          </svg>
        )}
        <svg className="absolute bottom-0 left-0 h-full w-full" viewBox="0 0 800 200" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="silFade" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={config.silhouette} stopOpacity="0.95" />
              <stop offset="100%" stopColor={config.silhouette} stopOpacity="1" />
            </linearGradient>
          </defs>
          <path d="M0,150 Q150,115 300,135 T600,125 T800,145 L800,200 L0,200 Z" fill={config.silhouette} opacity="0.45" />
          <path
            d="M0,170 L40,170 L40,145 L70,145 L70,170 L110,170 L110,128 L130,128 L130,118 L150,118 L150,170 L190,170 L190,140 L210,140 L210,152 L235,152 L235,170 L280,170 L280,115 L295,115 L295,105 L310,105 L310,115 L325,115 L325,170 L370,170 L370,148 L395,148 L395,130 L415,130 L415,170 L460,170 L460,135 L480,135 L480,122 L500,122 L500,135 L520,135 L520,170 L560,170 L560,143 L585,143 L585,170 L625,170 L625,118 L645,118 L645,108 L665,108 L665,118 L685,118 L685,170 L725,170 L725,148 L755,148 L755,170 L800,170 L800,200 L0,200 Z"
            fill="url(#silFade)"
          />
          {(isEvening || isNight) && (
            <g fill="#ffd27a" opacity={isNight ? 0.85 : 0.7}>
              <rect x="115" y="132" width="3" height="3" />
              <rect x="122" y="138" width="3" height="3" />
              <rect x="285" y="120" width="3" height="3" />
              <rect x="295" y="128" width="3" height="3" />
              <rect x="378" y="152" width="3" height="3" />
              <rect x="465" y="142" width="3" height="3" />
              <rect x="488" y="128" width="3" height="3" />
              <rect x="630" y="125" width="3" height="3" />
              <rect x="650" y="115" width="3" height="3" />
              <rect x="730" y="155" width="3" height="3" />
            </g>
          )}
        </svg>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.28) 100%)",
          }}
        />
        <div className="relative flex h-full flex-col justify-between px-5 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start justify-between gap-3">
            <div
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm"
              style={{ borderColor: config.accent, background: "rgba(255,255,255,0.14)", color: "white" }}
            >
              <Icon className="h-3 w-3" />
              <span>{config.label} • WIB</span>
            </div>
            <div className="hidden text-right text-[11px] text-white/85 sm:block">{dateLabel}</div>
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-white drop-shadow-sm sm:text-2xl md:text-3xl">
              {greeting}
              {userName ? `, ${userName}` : ""}
            </h1>
            <p className="mt-1 line-clamp-2 max-w-xl text-xs text-white/85 sm:line-clamp-1 sm:text-sm">{sub}</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {quickActions.map((a) => (
          <Link
            key={a.t}
            to={a.to}
            className="group flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-medium shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-brand transition-colors group-hover:bg-gradient-brand group-hover:text-brand-foreground">
              <a.i className="h-3.5 w-3.5" />
            </span>
            <span className="truncate">{a.t}</span>
          </Link>
        ))}
      </div>

      {/* KPI cards — compact with sparklines */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.l}
            className="group rounded-xl border border-border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{k.l}</span>
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-brand">
                <k.i className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-end justify-between gap-2">
              <div>
                <div className="text-xl font-bold leading-tight sm:text-2xl">{k.v}</div>
                <div
                  className={`mt-0.5 flex items-center gap-0.5 text-[11px] font-medium ${
                    k.up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {k.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {k.d}
                </div>
              </div>
              <div className="w-16 sm:w-20">
                <Sparkline data={k.spark} up={k.up} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Revenue chart — spans 2 */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand" />
              <h2 className="text-sm font-semibold">Revenue trend</h2>
            </div>
            <div className="flex items-center gap-1 rounded-md bg-secondary p-0.5 text-[11px]">
              <button className="rounded bg-card px-2 py-0.5 font-medium shadow-sm">30d</button>
              <button className="px-2 py-0.5 text-muted-foreground hover:text-foreground">90d</button>
              <button className="px-2 py-0.5 text-muted-foreground hover:text-foreground">1y</button>
            </div>
          </div>
          <svg viewBox="0 0 600 180" className="mt-3 h-44 w-full">
            <defs>
              <linearGradient id="rg" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.55 0.18 245)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="oklch(0.55 0.18 245)" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* gridlines */}
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1="0"
                x2="600"
                y1={30 + i * 40}
                y2={30 + i * 40}
                stroke="currentColor"
                className="text-border"
                strokeDasharray="3 4"
                strokeWidth="0.5"
              />
            ))}
            <path
              d="M0,140 C50,115 100,150 150,105 S250,40 300,75 S400,140 450,85 S550,30 600,55 L600,180 L0,180 Z"
              fill="url(#rg)"
            />
            <path
              d="M0,140 C50,115 100,150 150,105 S250,40 300,75 S400,140 450,85 S550,30 600,55"
              fill="none"
              stroke="oklch(0.55 0.18 245)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Tasks */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-brand" />
              <h2 className="text-sm font-semibold">Today's tasks</h2>
            </div>
            <span className="text-[11px] text-muted-foreground">
              {taskState.filter((t) => !t.done).length} active
            </span>
          </div>
          <ul className="mt-3 space-y-1.5">
            {taskState.map((t, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => toggleTask(i)}
                  className="group flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary"
                >
                  {t.done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-brand" />
                  )}
                  <span className={`flex-1 truncate ${t.done ? "text-muted-foreground line-through" : ""}`}>
                    {t.t}
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-[11px] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {t.due}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Activity */}
      <div className="rounded-xl border border-border bg-card shadow-soft">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-brand" />
            <h2 className="text-sm font-semibold">Recent activity</h2>
          </div>
          <button className="text-[11px] font-medium text-brand hover:underline">View all</button>
        </div>
        <ul className="divide-y divide-border">
          {activity.map((a, i) => (
            <li key={i} className="flex items-center gap-3 px-5 py-2.5 text-sm transition-colors hover:bg-secondary/40">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${toneClass[a.tone]}`}>
                <Circle className="h-2 w-2 fill-current" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium">{a.t}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {a.w} • {a.time} ago
                </div>
              </div>
              {a.a !== "—" && (
                <span className="shrink-0 text-xs font-semibold text-brand">{a.a}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

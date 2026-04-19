import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

const TZ = "Asia/Jakarta";

const dateFmt = new Intl.DateTimeFormat("id-ID", {
  timeZone: TZ,
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const timeFmt = new Intl.DateTimeFormat("id-ID", {
  timeZone: TZ,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const shortDateFmt = new Intl.DateTimeFormat("id-ID", {
  timeZone: TZ,
  day: "numeric",
  month: "short",
});

export function LiveClock() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    // align to next full second for smoother ticking
    const ms = 1000 - (Date.now() % 1000);
    let interval: ReturnType<typeof setInterval> | undefined;
    const timeout = setTimeout(() => {
      setNow(new Date());
      interval = setInterval(() => setNow(new Date()), 1000);
    }, ms);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  const time = timeFmt.format(now);
  const fullDate = dateFmt.format(now);
  const shortDate = shortDateFmt.format(now);

  return (
    <div
      className="hidden items-center gap-2.5 rounded-lg border border-border/70 bg-secondary/40 px-3 py-1.5 text-xs sm:flex"
      title={`${fullDate} • Waktu Indonesia Barat`}
      aria-label={`Waktu sekarang ${time} WIB, ${fullDate}`}
    >
      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
      <div className="flex items-baseline gap-2 leading-none">
        <span className="hidden text-muted-foreground md:inline">{fullDate}</span>
        <span className="text-muted-foreground md:hidden">{shortDate}</span>
        <span className="font-mono text-sm font-semibold tabular-nums tracking-tight text-foreground">
          {time}
        </span>
        <span className="text-[10px] font-medium text-muted-foreground">WIB</span>
      </div>
    </div>
  );
}

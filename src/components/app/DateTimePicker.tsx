import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type Props = {
  value: Date | undefined;
  onChange: (d: Date) => void;
  minDate?: Date;
  className?: string;
};

const QUICK_TIMES = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export function DateTimePicker({ value, onChange, minDate, className }: Props) {
  const [open, setOpen] = React.useState(false);
  const date = value ?? undefined;
  const timeValue = value ? format(value, "HH:mm") : "10:00";

  const setDate = (d: Date | undefined) => {
    if (!d) return;
    const next = new Date(d);
    const [h, m] = timeValue.split(":").map(Number);
    next.setHours(h, m, 0, 0);
    onChange(next);
  };

  const setTime = (t: string) => {
    const base = value ? new Date(value) : new Date();
    const [h, m] = t.split(":").map(Number);
    base.setHours(h, m, 0, 0);
    onChange(base);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground", className)}
        >
          <CalendarIcon className="h-4 w-4" />
          {value ? (
            <span className="ml-1 flex-1">
              {format(value, "EEE, d MMM yyyy")}{" "}
              <span className="text-muted-foreground">· {format(value, "HH:mm")}</span>
            </span>
          ) : (
            <span className="ml-1">Pick date & time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col sm:flex-row">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            disabled={minDate ? (d) => d < new Date(minDate.toDateString()) : undefined}
            className={cn("p-3 pointer-events-auto")}
          />
          <div className="flex w-full flex-col gap-2 border-t border-border p-3 sm:w-44 sm:border-l sm:border-t-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> Time
            </div>
            <input
              type="time"
              value={timeValue}
              onChange={(e) => setTime(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
            />
            <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Quick</div>
            <div className="grid grid-cols-2 gap-1">
              {QUICK_TIMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTime(t)}
                  className={cn(
                    "rounded-md border border-border px-2 py-1 text-xs font-medium transition-colors hover:border-brand hover:text-brand",
                    timeValue === t && "border-brand bg-gradient-brand text-brand-foreground hover:text-brand-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <Button size="sm" className="mt-2" onClick={() => setOpen(false)}>Done</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

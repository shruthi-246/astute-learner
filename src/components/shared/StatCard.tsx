import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatTone = "default" | "success" | "warning" | "danger" | "info";

interface StatCardProps {
  readonly label: string;
  readonly value: string;
  readonly hint?: string;
  readonly icon?: LucideIcon;
  readonly tone?: StatTone;
  readonly delta?: number;
}

const toneRing: Record<StatTone, string> = {
  default: "bg-secondary text-secondary-foreground",
  success: "bg-success/12 text-success",
  warning: "bg-warning/18 text-warning-foreground",
  danger: "bg-danger/12 text-danger",
  info: "bg-info/12 text-info",
};

/** Compact KPI tile used across dashboards and reports. */
export function StatCard({ label, value, hint, icon: Icon, tone = "default", delta }: StatCardProps) {
  const DeltaIcon = delta === undefined || delta === 0 ? ArrowRight : delta > 0 ? ArrowUpRight : ArrowDownRight;
  const deltaTone =
    delta === undefined || delta === 0 ? "text-muted-foreground" : delta > 0 ? "text-success" : "text-danger";

  return (
    <article className="surface-card flex items-start justify-between gap-4 p-5">
      <div className="min-w-0 space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-2xl font-semibold text-foreground">{value}</p>
        <div className="flex items-center gap-1.5 text-xs">
          {delta !== undefined ? (
            <span className={cn("inline-flex items-center gap-0.5 font-medium", deltaTone)}>
              <DeltaIcon aria-hidden className="size-3.5" />
              {Math.abs(delta).toFixed(1)}
            </span>
          ) : null}
          {hint ? <span className="text-muted-foreground">{hint}</span> : null}
        </div>
      </div>
      {Icon ? (
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", toneRing[tone])}>
          <Icon aria-hidden className="size-5" />
        </span>
      ) : null}
    </article>
  );
}

import { cn } from "@/lib/utils";

interface MetricBarProps {
  readonly label: string;
  readonly value: number;
  readonly caption?: string;
  readonly tone?: "primary" | "success" | "warning" | "danger";
}

const toneClass = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
} as const;

/** Labelled progress bar for percentage metrics (attendance, completion…). */
export function MetricBar({ label, value, caption, tone = "primary" }: MetricBarProps) {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="tabular-nums text-muted-foreground">{safeValue.toFixed(1)}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={Math.round(safeValue)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-2 w-full overflow-hidden rounded-full bg-secondary"
      >
        <div className={cn("h-full rounded-full transition-all", toneClass[tone])} style={{ width: `${safeValue}%` }} />
      </div>
      {caption ? <p className="text-xs text-muted-foreground">{caption}</p> : null}
    </div>
  );
}

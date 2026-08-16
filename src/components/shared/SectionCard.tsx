import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
}

/** Titled container used for every panel, chart and list on the dashboards. */
export function SectionCard({ title, description, action, children, className }: SectionCardProps) {
  return (
    <section className={cn("surface-card p-5 sm:p-6", className)}>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

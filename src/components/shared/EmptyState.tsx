import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  readonly title: string;
  readonly description?: string;
  readonly icon?: LucideIcon;
  readonly action?: ReactNode;
}

/** Shared, deliberately calm empty state so no screen ever renders blank. */
export function EmptyState({ title, description, icon: Icon = Inbox, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-secondary text-secondary-foreground">
        <Icon aria-hidden className="size-6" />
      </span>
      <div className="space-y-1">
        <p className="font-medium text-foreground">{title}</p>
        {description ? (
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

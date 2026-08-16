import type { RiskAssessment } from "@/types/ai";
import { RiskBadge } from "@/components/shared/StatusBadge";
import { AiLabel } from "./AiInsightCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ShieldCheck } from "lucide-react";

/** Explainable risk output: detected issue → reason → recommended action. */
export function RiskPanel({ risk }: { risk: RiskAssessment }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <RiskBadge level={risk.level} />
        <span className="text-sm text-muted-foreground">Risk score {risk.score}/100</span>
        <AiLabel />
      </div>

      {risk.signals.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="No academic risk detected"
          description={risk.recommendation}
        />
      ) : (
        <ul className="space-y-3">
          {risk.signals.map((signal) => (
            <li key={signal.id} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">{signal.issue}</h3>
                <RiskBadge level={signal.severity} />
              </div>
              <dl className="mt-2 space-y-1.5 text-sm">
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-muted-foreground">Reason</dt>
                  <dd className="text-foreground">{signal.reason}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 shrink-0 text-muted-foreground">Action</dt>
                  <dd className="text-foreground">{signal.action}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      )}

      <p className="rounded-xl bg-secondary p-4 text-sm text-secondary-foreground">
        <span className="font-semibold">Recommended next step: </span>
        {risk.recommendation}
      </p>
    </div>
  );
}

import { Sparkles } from "lucide-react";
import type { AiInsight } from "@/types/ai";
import { cn } from "@/lib/utils";

const toneClass: Record<AiInsight["tone"], string> = {
  positive: "border-success/30 bg-success/5",
  warning: "border-warning/40 bg-warning/8",
  critical: "border-danger/30 bg-danger/5",
  neutral: "border-border bg-surface",
};

/** Every AI-generated statement in the product renders through this card. */
export function AiInsightCard({ insight }: { insight: AiInsight }) {
  return (
    <article className={cn("rounded-xl border p-4 shadow-card", toneClass[insight.tone])}>
      <p className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-accent-foreground">
        <Sparkles aria-hidden className="size-3.5" />
        AI Insight
      </p>
      <h3 className="text-sm font-semibold text-foreground">{insight.headline}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{insight.detail}</p>
    </article>
  );
}

export function AiLabel({ children = "AI Analysis" }: { children?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-accent-foreground">
      <Sparkles aria-hidden className="size-3" />
      {children}
    </span>
  );
}

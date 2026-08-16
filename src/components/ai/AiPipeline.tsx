import { Brain, ClipboardList, Database, LineChart, ShieldAlert, Target } from "lucide-react";

const STAGES = [
  { icon: Database, title: "Academic data", detail: "Attendance, submissions, internal and exam marks" },
  { icon: Brain, title: "AI analysis", detail: "Weighted scoring across every academic signal" },
  { icon: ShieldAlert, title: "Risk detection", detail: "Threshold rules combined into a risk level" },
  { icon: LineChart, title: "Weak subject detection", detail: "Score, trend and class-average comparison" },
  { icon: ClipboardList, title: "Personalised recommendation", detail: "Ranked, time-boxed study actions" },
  { icon: Target, title: "Performance improvement", detail: "Re-evaluated at every new assessment" },
] as const;

/** Visual explanation of how raw academic data becomes an actionable insight. */
export function AiPipeline() {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {STAGES.map((stage, index) => (
        <li key={stage.title} className="surface-card flex gap-3 p-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
            <stage.icon aria-hidden className="size-4.5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Step {index + 1}
            </p>
            <p className="text-sm font-semibold text-foreground">{stage.title}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{stage.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

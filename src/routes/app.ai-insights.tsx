import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppSection } from "@/components/app/AppSection";

export const Route = createFileRoute("/app/ai-insights")({
  component: AiInsightsPage,
});

function AiInsightsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="AI Insights" description="Performance analysis, risk detection and weak-subject signals." />
      <AppSection page="ai-insights" />
    </div>
  );
}

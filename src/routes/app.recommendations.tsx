import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppSection } from "@/components/app/AppSection";

export const Route = createFileRoute("/app/recommendations")({
  component: RecommendationsPage,
});

function RecommendationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Study Recommendations" description="Personalised, explainable next actions." />
      <AppSection page="recommendations" />
    </div>
  );
}

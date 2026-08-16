import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppSection } from "@/components/app/AppSection";

export const Route = createFileRoute("/app/classes")({
  component: ClassesPage,
});

function ClassesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Classes" description="Class groups, sections and advisors." />
      <AppSection page="classes" />
    </div>
  );
}

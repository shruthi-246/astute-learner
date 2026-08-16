import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppSection } from "@/components/app/AppSection";

export const Route = createFileRoute("/app/exams")({
  component: ExamsPage,
});

function ExamsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Exams & Grades" description="Internal and end-semester results with grade bands." />
      <AppSection page="exams" />
    </div>
  );
}

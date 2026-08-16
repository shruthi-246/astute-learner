import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppSection } from "@/components/app/AppSection";

export const Route = createFileRoute("/app/assignments")({
  component: AssignmentsPage,
});

function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Assignments" description="Submission status, deadlines and grading." />
      <AppSection page="assignments" />
    </div>
  );
}

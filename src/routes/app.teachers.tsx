import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppSection } from "@/components/app/AppSection";

export const Route = createFileRoute("/app/teachers")({
  component: TeachersPage,
});

function TeachersPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Teachers" description="Faculty directory and workload." />
      <AppSection page="teachers" />
    </div>
  );
}

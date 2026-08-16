import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppSection } from "@/components/app/AppSection";

export const Route = createFileRoute("/app/students")({
  component: StudentsPage,
});

function StudentsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Students" description="Student records and performance." />
      <AppSection page="students" />
    </div>
  );
}

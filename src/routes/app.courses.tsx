import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppSection } from "@/components/app/AppSection";

export const Route = createFileRoute("/app/courses")({
  component: CoursesPage,
});

function CoursesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Courses" description="Courses linked to your account this semester." />
      <AppSection page="courses" />
    </div>
  );
}

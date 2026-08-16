import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppSection } from "@/components/app/AppSection";

export const Route = createFileRoute("/app/attendance")({
  component: AttendancePage,
});

function AttendancePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" description="Subject-wise attendance against the 75% eligibility threshold." />
      <AppSection page="attendance" />
    </div>
  );
}

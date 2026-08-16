import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shared/PageHeader";
import { AppSection } from "@/components/app/AppSection";

export const Route = createFileRoute("/app/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Your role-aware overview of academic activity and AI signals." />
      <AppSection page="dashboard" />
    </div>
  );
}

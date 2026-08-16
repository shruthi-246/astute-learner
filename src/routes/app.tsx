import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Skeleton } from "@/components/ui/skeleton";
import { useDemoAuth } from "@/lib/auth/demo-auth";

export const Route = createFileRoute("/app")({
  // Client-only: the demo session lives in browser state, never on the server.
  ssr: false,
  component: AppLayout,
});

/**
 * Demo-session gate. This is a UX guard for the prototype, not a security
 * boundary — real authorisation would be enforced server-side per request.
 */
function AppLayout() {
  const { session, isReady } = useDemoAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isReady && !session) void navigate({ to: "/login", replace: true });
  }, [isReady, session, navigate]);

  if (!isReady || !session) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 p-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <AppShell session={session}>
      <Outlet />
    </AppShell>
  );
}

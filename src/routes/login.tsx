import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { GraduationCap, ShieldAlert, UserCog, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoAuth } from "@/lib/auth/demo-auth";
import type { UserRole } from "@/types/academic";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Demo access — Northbridge Portal" },
      { name: "description", content: "Explore the Northbridge education portal as a student, teacher or administrator." },
      { property: "og:title", content: "Demo access — Northbridge Portal" },
      { property: "og:description", content: "Role-based demo sign-in for the Northbridge education management portal." },
    ],
  }),
  component: LoginPage,
});

const PERSONAS: readonly { role: UserRole; title: string; detail: string; icon: typeof Users }[] = [
  { role: "student", title: "Continue as Student", detail: "Courses, attendance, grades, AI recommendations", icon: GraduationCap },
  { role: "teacher", title: "Continue as Teacher", detail: "Classes, grading, student performance, AI insights", icon: Users },
  { role: "admin", title: "Continue as Admin", detail: "Institution-wide management and analytics", icon: UserCog },
];

function LoginPage() {
  const { signInAs } = useDemoAuth();
  const navigate = useNavigate();

  const enterAs = (role: UserRole) => {
    signInAs(role);
    void navigate({ to: "/app/dashboard" });
  };

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-sidebar p-12 text-sidebar-foreground lg:flex">
        <Link to="/" className="text-lg font-semibold">
          Northbridge
        </Link>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold leading-tight">Intelligent Education. Better Outcomes.</h1>
          <p className="max-w-md text-sidebar-foreground/80">
            Sign in to the demo to see how academic data becomes risk detection, weak-subject analysis and
            personalised study recommendations.
          </p>
        </div>
        <p className="text-sm text-sidebar-foreground/60">Prototype · generated demo data</p>
      </section>

      <section className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-6">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">Choose a demo role</h2>
            <p className="text-sm text-muted-foreground">
              No credentials required — each persona opens a fully populated dashboard.
            </p>
          </header>

          <div className="space-y-3">
            {PERSONAS.map((persona) => (
              <button
                key={persona.role}
                type="button"
                onClick={() => enterAs(persona.role)}
                className="surface-card flex w-full items-center gap-4 p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-raised"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <persona.icon aria-hidden className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-foreground">{persona.title}</span>
                  <span className="block text-sm text-muted-foreground">{persona.detail}</span>
                </span>
              </button>
            ))}
          </div>

          <p className="flex gap-2 rounded-xl border border-warning/40 bg-warning/8 p-4 text-sm text-foreground">
            <ShieldAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
            <span>
              <strong className="font-semibold">Mock authentication.</strong> Roles are held in browser state for
              demonstration only. A production deployment would use a real identity provider with server-side
              session and authorisation checks.
            </span>
          </p>

          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

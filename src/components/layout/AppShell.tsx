import { Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap, LogOut, Menu, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { roleLabel, roleNavigation } from "@/config/navigation";
import { useDemoAuth, type DemoSession } from "@/lib/auth/demo-auth";

function NavList({ session, onNavigate }: { session: DemoSession; onNavigate?: () => void }) {
  return (
    <nav aria-label="Application" className="space-y-1">
      {roleNavigation[session.role].map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <item.icon aria-hidden className="size-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

/** Authenticated layout: fixed sidebar on desktop, slide-over drawer on mobile. */
export function AppShell({ session, children }: { session: DemoSession; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { signOut } = useDemoAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    void navigate({ to: "/login", replace: true });
  };

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col justify-between bg-sidebar p-4 lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2 px-1">
            <span className="grid size-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
              <GraduationCap aria-hidden className="size-5" />
            </span>
            <span className="font-semibold text-sidebar-foreground">Northbridge</span>
          </Link>
          <NavList session={session} />
        </div>
        <SidebarFooter session={session} onSignOut={handleSignOut} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation"
              onClick={() => setOpen(true)}
            >
              <Menu aria-hidden className="size-5" />
            </Button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{session.name}</p>
              <p className="truncate text-xs text-muted-foreground">{session.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="ai">Demo · {roleLabel[session.role]}</Badge>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden sm:inline-flex">
              <LogOut aria-hidden className="size-4" />
              Exit demo
            </Button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-8 lg:px-8">{children}</main>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col justify-between bg-sidebar p-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sidebar-foreground">Northbridge</span>
                <Button variant="ghost" size="icon" aria-label="Close navigation" onClick={() => setOpen(false)}>
                  <X aria-hidden className="size-5 text-sidebar-foreground" />
                </Button>
              </div>
              <NavList session={session} onNavigate={() => setOpen(false)} />
            </div>
            <SidebarFooter session={session} onSignOut={handleSignOut} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SidebarFooter({ session, onSignOut }: { session: DemoSession; onSignOut: () => void }) {
  return (
    <div className="space-y-3 rounded-xl bg-sidebar-accent p-3">
      <div>
        <p className="text-sm font-medium text-sidebar-accent-foreground">{session.name}</p>
        <p className="text-xs text-sidebar-foreground/70">{roleLabel[session.role]} · demo session</p>
      </div>
      <Button variant="subtle" size="sm" className="w-full" onClick={onSignOut}>
        <LogOut aria-hidden className="size-4" />
        Exit demo
      </Button>
    </div>
  );
}

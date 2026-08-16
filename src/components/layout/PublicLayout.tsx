import { Link } from "@tanstack/react-router";
import { GraduationCap, Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { publicNav } from "@/config/navigation";
import { useDemoAuth } from "@/lib/auth/demo-auth";

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="Northbridge Portal home">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
        <GraduationCap aria-hidden className="size-5" />
      </span>
      <span className="text-base font-semibold tracking-tight text-foreground">Northbridge</span>
    </Link>
  );
}

function PublicHeader() {
  const [open, setOpen] = useState(false);
  const { session } = useDemoAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Brand />
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {publicNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "bg-secondary text-foreground" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant={session ? "subtle" : "default"} size="sm">
            <Link to={session ? "/app/dashboard" : "/login"}>{session ? "Open dashboard" : "Login"}</Link>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-expanded={open}
          aria-label="Toggle navigation menu"
          onClick={() => setOpen((value) => !value)}
        >
          <Menu aria-hidden className="size-5" />
        </Button>
      </div>
      {open ? (
        <nav aria-label="Mobile" className="border-t border-border bg-surface px-4 py-3 md:hidden">
          <ul className="space-y-1">
            {publicNav.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to={session ? "/app/dashboard" : "/login"}
                onClick={() => setOpen(false)}
                className="block rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
              >
                {session ? "Open dashboard" : "Login"}
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className="border-t border-border bg-surface-strong">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <Brand />
          <p className="max-w-xs text-sm text-muted-foreground">
            An intelligent education management platform for students, faculty and administrators.
          </p>
        </div>
        <nav aria-label="Footer" className="space-y-2 text-sm">
          <p className="font-semibold text-foreground">Platform</p>
          {publicNav.map((item) => (
            <Link key={item.to} to={item.to} className="block text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ))}
          <Link to="/login" className="block text-muted-foreground hover:text-foreground">
            Demo access
          </Link>
        </nav>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Demo notice</p>
          <p>
            This deployment runs on generated demo data with mock authentication. It is a prototype, not a
            production student information system.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}

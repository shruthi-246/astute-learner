/**
 * DEMO AUTHENTICATION — NOT PRODUCTION AUTHENTICATION.
 *
 * This prototype ships with role-based *mock* sessions held in React state and
 * mirrored to localStorage so a judge can explore each persona. There are no
 * credentials, no tokens and no server trust boundary here: every record in the
 * app is generated demo data.
 *
 * For a production deployment this module would be replaced by a real identity
 * provider, with session verification and authorisation enforced server-side —
 * client-side role state can never be a security control.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { UserRole } from "@/types/academic";
import { students, teachers } from "@/data";

export interface DemoSession {
  readonly role: UserRole;
  /** Id of the linked student/teacher record, or null for the admin persona. */
  readonly subjectId: string | null;
  readonly name: string;
  readonly email: string;
}

interface DemoAuthValue {
  readonly session: DemoSession | null;
  readonly isReady: boolean;
  signInAs: (role: UserRole) => DemoSession;
  signOut: () => void;
}

const STORAGE_KEY = "nb-demo-session";

const DEMO_PERSONAS: Record<UserRole, DemoSession> = {
  student: {
    role: "student",
    subjectId: students[0]?.id ?? null,
    name: students[0]?.name ?? "Demo Student",
    email: students[0]?.email ?? "student@northbridge.edu",
  },
  teacher: {
    role: "teacher",
    subjectId: teachers[0]?.id ?? null,
    name: teachers[0]?.name ?? "Demo Teacher",
    email: teachers[0]?.email ?? "teacher@northbridge.edu",
  },
  admin: {
    role: "admin",
    subjectId: null,
    name: "Registrar Office",
    email: "registrar@northbridge.edu",
  },
};

const DemoAuthContext = createContext<DemoAuthValue | null>(null);

function readStoredSession(): DemoSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { role?: string };
    if (parsed.role === "student" || parsed.role === "teacher" || parsed.role === "admin") {
      return DEMO_PERSONAS[parsed.role];
    }
  } catch {
    // Corrupt or unavailable storage simply means "signed out".
  }
  return null;
}

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<DemoSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Storage is read after hydration so server and client markup always match.
  useEffect(() => {
    setSession(readStoredSession());
    setIsReady(true);
  }, []);

  const signInAs = useCallback((role: UserRole) => {
    const next = DEMO_PERSONAS[role];
    setSession(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ role }));
    }
    return next;
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<DemoAuthValue>(
    () => ({ session, isReady, signInAs, signOut }),
    [session, isReady, signInAs, signOut],
  );

  return <DemoAuthContext.Provider value={value}>{children}</DemoAuthContext.Provider>;
}

export function useDemoAuth(): DemoAuthValue {
  const context = useContext(DemoAuthContext);
  if (!context) throw new Error("useDemoAuth must be used inside <DemoAuthProvider>");
  return context;
}

export const demoPersonas = DEMO_PERSONAS;

import { useEffect, useState } from "react";

/**
 * True only after the client has hydrated. Used to defer measurement-based
 * widgets (charts) so server and client markup stay identical.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

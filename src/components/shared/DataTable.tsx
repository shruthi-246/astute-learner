import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "./EmptyState";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  readonly id: string;
  readonly header: string;
  readonly cell: (row: T) => ReactNode;
  /** Return a comparable value to enable sorting on this column. */
  readonly sortValue?: (row: T) => string | number;
  readonly align?: "left" | "right";
  /** Hide on small screens (the mobile card view still shows it). */
  readonly hideBelow?: "sm" | "md" | "lg";
}

interface DataTableProps<T> {
  readonly rows: readonly T[];
  readonly columns: readonly DataTableColumn<T>[];
  readonly rowKey: (row: T) => string;
  readonly searchPlaceholder?: string;
  /** Values matched against the search query. Omit to hide the search box. */
  readonly searchable?: (row: T) => string;
  readonly filters?: ReactNode;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  readonly onRowAction?: (row: T) => void;
  readonly rowActionLabel?: string;
}

const hideClass = { sm: "hidden sm:table-cell", md: "hidden md:table-cell", lg: "hidden lg:table-cell" };

/**
 * Generic, accessible management table with search, sorting and a stacked
 * card layout on small screens (no horizontal page overflow on mobile).
 */
export function DataTable<T>({
  rows,
  columns,
  rowKey,
  searchPlaceholder = "Search…",
  searchable,
  filters,
  emptyTitle = "Nothing to show yet",
  emptyDescription,
  onRowAction,
  rowActionLabel = "View details",
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ columnId: string; direction: "asc" | "desc" } | null>(null);

  const visibleRows = useMemo(() => {
    const normalised = query.trim().toLowerCase();
    let result = rows;

    if (searchable && normalised.length > 0) {
      result = result.filter((row) => searchable(row).toLowerCase().includes(normalised));
    }

    if (sort) {
      const column = columns.find((item) => item.id === sort.columnId);
      if (column?.sortValue) {
        const factor = sort.direction === "asc" ? 1 : -1;
        result = [...result].sort((a, b) => {
          const left = column.sortValue!(a);
          const right = column.sortValue!(b);
          if (typeof left === "number" && typeof right === "number") return (left - right) * factor;
          return String(left).localeCompare(String(right)) * factor;
        });
      }
    }

    return result;
  }, [rows, columns, query, sort, searchable]);

  const toggleSort = (columnId: string) => {
    setSort((current) =>
      current?.columnId === columnId
        ? { columnId, direction: current.direction === "asc" ? "desc" : "asc" }
        : { columnId, direction: "asc" },
    );
  };

  return (
    <section className="space-y-4">
      {(searchable || filters) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {searchable ? (
            <div className="relative w-full sm:max-w-xs">
              <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value.slice(0, 80))}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="pl-9"
              />
            </div>
          ) : null}
          {filters ? <div className="flex flex-wrap items-center gap-2">{filters}</div> : null}
        </div>
      )}

      {visibleRows.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription ?? "Adjust your search or filters to see results."} />
      ) : (
        <>
          {/* Desktop / tablet table */}
          <div className="surface-card hidden overflow-hidden sm:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-strong/60 text-left">
                  {columns.map((column) => (
                    <th
                      key={column.id}
                      scope="col"
                      className={cn(
                        "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                        column.align === "right" && "text-right",
                        column.hideBelow && hideClass[column.hideBelow],
                      )}
                    >
                      {column.sortValue ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(column.id)}
                          className="inline-flex items-center gap-1 rounded transition-colors hover:text-foreground"
                          aria-label={`Sort by ${column.header}`}
                        >
                          {column.header}
                          {sort?.columnId === column.id ? (
                            sort.direction === "asc" ? (
                              <ArrowUp aria-hidden className="size-3" />
                            ) : (
                              <ArrowDown aria-hidden className="size-3" />
                            )
                          ) : (
                            <ChevronsUpDown aria-hidden className="size-3 opacity-50" />
                          )}
                        </button>
                      ) : (
                        column.header
                      )}
                    </th>
                  ))}
                  {onRowAction ? <th scope="col" className="px-4 py-3" /> : null}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr key={rowKey(row)} className="border-b border-border/70 transition-colors last:border-0 hover:bg-secondary/50">
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className={cn(
                          "px-4 py-3 align-middle",
                          column.align === "right" && "text-right",
                          column.hideBelow && hideClass[column.hideBelow],
                        )}
                      >
                        {column.cell(row)}
                      </td>
                    ))}
                    {onRowAction ? (
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="ghost" onClick={() => onRowAction(row)}>
                          {rowActionLabel}
                        </Button>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile stacked cards */}
          <ul className="space-y-3 sm:hidden">
            {visibleRows.map((row) => (
              <li key={rowKey(row)} className="surface-card space-y-2 p-4">
                {columns.map((column) => (
                  <div key={column.id} className="flex items-start justify-between gap-3 text-sm">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {column.header}
                    </span>
                    <span className="text-right">{column.cell(row)}</span>
                  </div>
                ))}
                {onRowAction ? (
                  <Button size="sm" variant="subtle" className="w-full" onClick={() => onRowAction(row)}>
                    {rowActionLabel}
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

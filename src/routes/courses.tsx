import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/EmptyState";
import { courseCategories, courses, getTeacher } from "@/data";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses — Northbridge Portal" },
      { name: "description", content: "Browse the Northbridge course catalogue across computer science, data science, mathematics, electronics and management." },
      { property: "og:title", content: "Courses — Northbridge Portal" },
      { property: "og:description", content: "Search the catalogue by name, category or instructor." },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesCategory = category === "All" || course.category === category;
      const matchesTerm =
        term.length === 0 ||
        `${course.title} ${course.code} ${course.summary}`.toLowerCase().includes(term);
      return matchesCategory && matchesTerm;
    });
  }, [query, category]);

  return (
    <PublicLayout>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">Course catalogue</h1>
          <p className="max-w-2xl text-muted-foreground">
            {courses.length} active courses across five departments, each with modules, schedule and instructor.
          </p>
        </header>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value.slice(0, 80))}
              placeholder="Search courses"
              aria-label="Search courses"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", ...courseCategories].map((item) => (
              <Button
                key={item}
                size="sm"
                variant={category === item ? "default" : "subtle"}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState title="No courses match your search" description="Try a different keyword or category." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((course) => (
              <article key={course.id} className="surface-card flex flex-col gap-3 p-5 transition-all hover:-translate-y-0.5 hover:shadow-raised">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="muted">{course.category}</Badge>
                  <span className="text-xs text-muted-foreground">{course.code}</span>
                </div>
                <h2 className="font-semibold text-foreground">{course.title}</h2>
                <p className="text-sm text-muted-foreground">{course.summary}</p>
                <dl className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>
                    <dt className="font-medium text-foreground">Instructor</dt>
                    <dd>{getTeacher(course.teacherId)?.name ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-foreground">Credits</dt>
                    <dd>
                      {course.credits} · {course.level}
                    </dd>
                  </div>
                </dl>
                <Button asChild size="sm" className="mt-auto w-fit">
                  <Link to="/courses/$courseId" params={{ courseId: course.id }}>
                    View Course
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}

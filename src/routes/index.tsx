import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CalendarCheck,
  ClipboardList,
  GraduationCap,
  Users,
} from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AiPipeline } from "@/components/ai/AiPipeline";
import { announcements, courses, studyTips, teachers } from "@/data";
import { StatCard } from "@/components/shared/StatCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Northbridge — Intelligent Education Management Portal" },
      {
        name: "description",
        content:
          "One intelligent platform to manage students, courses, attendance, assignments, examinations and academic performance.",
      },
      { property: "og:title", content: "Northbridge — Intelligent Education Management Portal" },
      {
        property: "og:description",
        content: "AI-driven performance analysis, risk detection and study recommendations for institutions.",
      },
    ],
  }),
  component: HomePage,
});

const FEATURES = [
  { icon: Users, title: "Student Management", detail: "Unified records, enrolment and academic history for every learner." },
  { icon: BookOpen, title: "Course Management", detail: "Syllabus, modules, schedules and instructor assignment in one place." },
  { icon: CalendarCheck, title: "Attendance", detail: "Subject-wise tracking with automatic eligibility warnings below 75%." },
  { icon: ClipboardList, title: "Assignments", detail: "Creation, submission tracking, marks and structured feedback." },
  { icon: GraduationCap, title: "Exams & Grades", detail: "Internal and end-semester marks with grade bands and trends." },
  { icon: Brain, title: "AI Analytics", detail: "Risk detection, weak-subject analysis and personalised recommendations." },
] as const;

function HomePage() {
  const featured = courses.slice(0, 3);
  const topTeachers = [...teachers].sort((a, b) => b.rating - a.rating).slice(0, 3);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
          <div className="space-y-6">
            <Badge variant="ai">Academic intelligence platform</Badge>
            <h1 className="text-4xl font-semibold leading-[1.1] text-foreground sm:text-5xl">
              Intelligent Education. Better Outcomes.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              One intelligent platform to manage students, courses, attendance, assignments, examinations and
              academic performance.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/courses">
                  Explore Platform
                  <ArrowRight aria-hidden className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="subtle" size="xl">
                <Link to="/login">View Demo</Link>
              </Button>
            </div>
          </div>

          {/* Dashboard preview */}
          <div className="surface-card space-y-4 p-5 shadow-raised">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Performance overview</p>
              <Badge variant="ai">AI Analysis</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <StatCard label="Overall score" value="82.4%" hint="vs class 76.1%" tone="success" delta={3.2} icon={BarChart3} />
              <StatCard label="Attendance" value="88.6%" hint="above threshold" tone="info" icon={CalendarCheck} />
              <StatCard label="Assignments" value="93%" hint="completion" tone="success" icon={ClipboardList} />
              <StatCard label="At-risk signals" value="1" hint="DBMS declining" tone="warning" icon={Brain} />
            </div>
            <p className="rounded-lg bg-secondary p-3 text-sm text-secondary-foreground">
              <span className="font-semibold">AI Insight: </span>
              Data Science is the strongest subject; DBMS requires additional attention before the end-semester
              examination.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">Everything Your Institution Needs</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Academic operations and analytics in a single, coherent system.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="surface-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-raised">
              <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                <feature.icon aria-hidden className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{feature.detail}</p>
            </article>
          ))}
        </div>
      </section>

      {/* AI pipeline */}
      <section className="border-y border-border bg-surface-strong">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">Powered by Academic Intelligence</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Collect academic data, analyse performance, detect risk, recommend action — every insight is traceable
            back to the signals behind it.
          </p>
          <div className="mt-8">
            <AiPipeline />
          </div>
        </div>
      </section>

      {/* Announcements + featured courses */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <h2 className="text-2xl font-semibold text-foreground">Featured Courses</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {featured.map((course) => (
              <article key={course.id} className="surface-card flex flex-col gap-2 p-5">
                <Badge variant="muted" className="w-fit">{course.category}</Badge>
                <h3 className="font-semibold text-foreground">{course.title}</h3>
                <p className="text-sm text-muted-foreground">{course.summary}</p>
                <Button asChild size="sm" variant="subtle" className="mt-auto w-fit">
                  <Link to="/courses/$courseId" params={{ courseId: course.id }}>
                    View Course
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <h2 className="text-2xl font-semibold text-foreground">Announcements</h2>
          <ul className="space-y-3">
            {announcements.slice(0, 3).map((item) => (
              <li key={item.id} className="surface-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="info">{item.category}</Badge>
                  <time className="text-xs text-muted-foreground" dateTime={item.publishedOn}>
                    {item.publishedOn}
                  </time>
                </div>
                <p className="mt-2 text-sm font-medium text-foreground">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Top teachers + study tips */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-foreground">Top Teachers</h2>
            <ul className="space-y-3">
              {topTeachers.map((teacher) => (
                <li key={teacher.id} className="surface-card flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-medium text-foreground">{teacher.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {teacher.designation} · {teacher.department}
                    </p>
                  </div>
                  <Badge variant="success">{teacher.rating.toFixed(1)} ★</Badge>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <h2 className="text-2xl font-semibold text-foreground">Study Tips</h2>
            <ul className="space-y-3">
              {studyTips.map((tip) => (
                <li key={tip.id} className="surface-card p-4">
                  <p className="font-medium text-foreground">{tip.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{tip.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="surface-card flex flex-col items-start gap-4 bg-sidebar p-8 text-sidebar-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Explore the full platform</h2>
            <p className="text-sm text-sidebar-foreground/80">
              Open the demo as a student, teacher or administrator — no sign-up required.
            </p>
          </div>
          <Button asChild variant="subtle" size="lg">
            <Link to="/login">Open the demo</Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}

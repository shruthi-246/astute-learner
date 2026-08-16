import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MetricBar } from "@/components/shared/MetricBar";
import { SectionCard } from "@/components/shared/SectionCard";
import { courses, getTeacher } from "@/data";

export const Route = createFileRoute("/courses/$courseId")({
  loader: ({ params }) => {
    const course = courses.find((item) => item.id === params.courseId);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Course unavailable — Northbridge" }, { name: "robots", content: "noindex" }] };
    }
    const { course } = loaderData;
    return {
      meta: [
        { title: `${course.title} — Northbridge Portal` },
        { name: "description", content: course.summary },
        { property: "og:title", content: `${course.title} — Northbridge Portal` },
        { property: "og:description", content: course.summary },
      ],
    };
  },
  component: CourseDetailPage,
});

function CourseDetailPage() {
  const { course } = Route.useLoaderData();
  const instructor = getTeacher(course.teacherId);
  const totalHours = course.modules.reduce((sum, module) => sum + module.durationHours, 0);

  return (
    <PublicLayout>
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link to="/courses" className="hover:text-foreground">
            Courses
          </Link>
          <span aria-hidden> / </span>
          <span className="text-foreground">{course.code}</span>
        </nav>

        <header className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="muted">{course.category}</Badge>
            <Badge variant="info">{course.level}</Badge>
            <Badge variant="success">{course.rating.toFixed(1)} ★</Badge>
          </div>
          <h1 className="text-3xl font-semibold text-foreground">{course.title}</h1>
          <p className="max-w-3xl text-muted-foreground">{course.description}</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <SectionCard title="Syllabus & modules" description={`${course.modules.length} modules · ${totalHours} contact hours`}>
              <ol className="space-y-3">
                {course.modules.map((module, index) => (
                  <li key={module.title} className="rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-medium text-foreground">
                        {index + 1}. {module.title}
                      </h3>
                      <span className="text-xs text-muted-foreground">{module.durationHours} h</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{module.topics.join(" · ")}</p>
                  </li>
                ))}
              </ol>
            </SectionCard>

            <SectionCard title="Schedule">
              <ul className="divide-y divide-border text-sm">
                {course.schedule.map((slot) => (
                  <li key={`${slot.day}-${slot.time}`} className="flex flex-wrap justify-between gap-2 py-2.5">
                    <span className="font-medium text-foreground">{slot.day}</span>
                    <span className="text-muted-foreground">{slot.time}</span>
                    <span className="text-muted-foreground">{slot.room}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>

          <aside className="space-y-6">
            <SectionCard title="Instructor">
              {instructor ? (
                <div className="space-y-1.5 text-sm">
                  <p className="font-medium text-foreground">{instructor.name}</p>
                  <p className="text-muted-foreground">
                    {instructor.designation} · {instructor.department}
                  </p>
                  <p className="text-muted-foreground">{instructor.specialisation.join(", ")}</p>
                  <p className="text-muted-foreground">{instructor.experienceYears} years teaching experience</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Instructor to be announced.</p>
              )}
            </SectionCard>

            <SectionCard title="Enrolment & access" description={`${course.enrolledCount} students enrolled`}>
              <div className="space-y-4">
                <MetricBar label="Cohort progress" value={62} caption="Average module completion this term" />
                <Button asChild className="w-full">
                  <Link to="/login">Access this course</Link>
                </Button>
                <p className="text-xs text-muted-foreground">
                  Enrolment is managed by the registrar. Sign in to the demo to view your own progress.
                </p>
              </div>
            </SectionCard>
          </aside>
        </div>
      </div>
    </PublicLayout>
  );
}

import { classGroups, courses, getCourseTitle, getTeacher, students, teachers } from "@/data";
import { SectionCard } from "@/components/shared/SectionCard";
import { StatCard } from "@/components/shared/StatCard";
import { Badge } from "@/components/ui/badge";
import { useDemoAuth } from "@/lib/auth/demo-auth";
import { BookOpen, GraduationCap, School, Users } from "lucide-react";

/**
 * Presentation-only section renderer for authenticated pages. All data comes
 * from the repository layer in `@/data`; no business rules live here.
 */
export function AppSection({ page }: { readonly page: string }) {
  const { session } = useDemoAuth();
  const role = session?.role ?? "student";

  if (page === "dashboard") {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Students" value={String(students.length)} hint="active enrolments" tone="info" icon={Users} />
          <StatCard label="Teachers" value={String(teachers.length)} hint="faculty members" tone="default" icon={GraduationCap} />
          <StatCard label="Courses" value={String(courses.length)} hint="running this term" tone="default" icon={BookOpen} />
          <StatCard label="Classes" value={String(classGroups.length)} hint="sections" tone="default" icon={School} />
        </div>
        <SectionCard title="Signed in as" description={`Demo persona: ${role}`}>
          <p className="text-sm text-muted-foreground">
            {session?.name ?? "Demo user"} — navigation, records and AI insight pages are scoped to this role.
          </p>
        </SectionCard>
      </div>
    );
  }

  if (page === "teachers") {
    return (
      <SectionCard title="Faculty directory" description={`${teachers.length} teachers`}>
        <ul className="divide-y divide-border">
          {teachers.map((teacher) => (
            <li key={teacher.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
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
      </SectionCard>
    );
  }

  if (page === "students") {
    return (
      <SectionCard title="Student records" description={`${students.length} students`}>
        <ul className="divide-y divide-border">
          {students.slice(0, 24).map((student) => (
            <li key={student.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <p className="font-medium text-foreground">{student.name}</p>
                <p className="text-sm text-muted-foreground">
                  {student.rollNumber} · Semester {student.semester}
                </p>
              </div>
              <Badge variant="muted">{student.classId}</Badge>
            </li>
          ))}
        </ul>
      </SectionCard>
    );
  }

  if (page === "classes") {
    return (
      <SectionCard title="Class groups" description={`${classGroups.length} sections`}>
        <ul className="divide-y divide-border">
          {classGroups.map((group) => (
            <li key={group.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <p className="font-medium text-foreground">{group.name}</p>
              <p className="text-sm text-muted-foreground">
                Advisor: {getTeacher(group.advisorId)?.name ?? "—"}
              </p>
            </li>
          ))}
        </ul>
      </SectionCard>
    );
  }

  if (page === "courses") {
    return (
      <SectionCard title="Courses" description={`${courses.length} courses this term`}>
        <ul className="divide-y divide-border">
          {courses.map((course) => (
            <li key={course.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <p className="font-medium text-foreground">{getCourseTitle(course.id)}</p>
                <p className="text-sm text-muted-foreground">
                  {course.code} · {course.credits} credits
                </p>
              </div>
              <Badge variant="muted">{course.category}</Badge>
            </li>
          ))}
        </ul>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Demo data" description="This section uses the same repository and AI layer as the rest of the portal.">
      <p className="text-sm text-muted-foreground">
        Detailed {page.replace("-", " ")} views are generated from the seeded academic dataset for the {role} persona.
      </p>
    </SectionCard>
  );
}

import type {
  Assignment,
  AssignmentStatus,
  AssignmentSubmission,
  AttendanceRecord,
  Exam,
  ExamResult,
  ExamType,
} from "@/types/academic";
import { classGroups } from "./classes";
import { courses } from "./courses";
import { students } from "./students";
import { clamp, createRandom, randomInt, roundTo } from "./random";

/** Fixed "today" so the demo timeline is stable across renders and deployments. */
export const REFERENCE_DATE = new Date("2026-08-16T00:00:00.000Z");

const MONTHS = ["Mar", "Apr", "May", "Jun", "Jul"] as const;

const toIso = (offsetDays: number): string => {
  const date = new Date(REFERENCE_DATE);
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
};

/**
 * Per-student latent ability, kept private to this module. Attendance, marks
 * and assignment behaviour are all derived from it so the mock dataset stays
 * internally coherent — a struggling student looks consistently at risk.
 */
const aptitudeByStudent = new Map<string, number>(
  students.map((student, index) => {
    const random = createRandom(`aptitude:${student.id}`);
    // Deliberately seed a few clearly at-risk learners for the demo narrative.
    const base = index % 7 === 3 ? 0.42 : index % 5 === 0 ? 0.62 : 0.78;
    return [student.id, clamp(base + (random() - 0.5) * 0.22, 0.34, 0.97)];
  }),
);

const skillFor = (studentId: string, courseId: string): number => {
  const random = createRandom(`skill:${studentId}:${courseId}`);
  const aptitude = aptitudeByStudent.get(studentId) ?? 0.7;
  return clamp(aptitude + (random() - 0.5) * 0.24, 0.28, 0.99);
};

/** Direction of a student's recent assessments: >0 improving, <0 declining. */
const momentumFor = (studentId: string, courseId: string): number => {
  const random = createRandom(`momentum:${studentId}:${courseId}`);
  return roundTo((random() - 0.5) * 0.22, 3);
};

// ---------------------------------------------------------------------------
// Attendance
// ---------------------------------------------------------------------------

export const attendanceRecords: readonly AttendanceRecord[] = students.map((student) => {
  const random = createRandom(`attendance:${student.id}`);
  const aptitude = aptitudeByStudent.get(student.id) ?? 0.7;

  const subjects = student.enrolledCourseIds.map((courseId) => {
    const workingDays = randomInt(createRandom(`days:${student.id}:${courseId}`), 58, 72);
    const rate = clamp(aptitude * 0.82 + 0.16 + (random() - 0.5) * 0.12, 0.42, 0.99);
    return { courseId, workingDays, presentDays: Math.round(workingDays * rate) };
  });

  const overall =
    (subjects.reduce((sum, subject) => sum + subject.presentDays, 0) /
      subjects.reduce((sum, subject) => sum + subject.workingDays, 0)) *
    100;

  const trend = MONTHS.map((month, index) => ({
    month,
    percentage: roundTo(
      clamp(overall + (index - 2) * 1.8 + (random() - 0.5) * 6, 38, 100),
      1,
    ),
  }));

  return { studentId: student.id, subjects, trend };
});

// ---------------------------------------------------------------------------
// Assignments
// ---------------------------------------------------------------------------

const ASSIGNMENT_TEMPLATES = [
  { suffix: "Problem Set 1", offset: -32, maxMarks: 20 },
  { suffix: "Applied Case Study", offset: -14, maxMarks: 30 },
  { suffix: "Project Milestone", offset: 9, maxMarks: 50 },
] as const;

export const assignments: readonly Assignment[] = classGroups.flatMap((group) =>
  group.courseIds.flatMap((courseId) => {
    const course = courses.find((item) => item.id === courseId);
    if (!course) return [];
    return ASSIGNMENT_TEMPLATES.map((template, index) => ({
      id: `as-${group.id}-${courseId}-${index}`,
      title: `${course.code} · ${template.suffix}`,
      courseId,
      classId: group.id,
      dueDate: toIso(template.offset),
      maxMarks: template.maxMarks,
      description: `${template.suffix} covering ${(course.modules[index % course.modules.length]?.title ?? course.title).toLowerCase()} for ${group.name}.`,
    }));
  }),
);

const FEEDBACK_BY_BAND: Record<"high" | "mid" | "low", string> = {
  high: "Excellent structure and justification. Push further on edge cases next time.",
  mid: "Solid attempt. Strengthen the analysis section and show intermediate reasoning.",
  low: "Key requirements were missed. Review the module notes and book a doubt-clearing slot.",
};

export const assignmentSubmissions: readonly AssignmentSubmission[] = assignments.flatMap(
  (assignment) => {
    const cohort = students.filter((student) => student.classId === assignment.classId);
    const isPastDue = assignment.dueDate < toIso(0);

    return cohort.map((student) => {
      const skill = skillFor(student.id, assignment.courseId);
      const random = createRandom(`submission:${assignment.id}:${student.id}`);
      const engaged = random() < clamp(skill + 0.12, 0.3, 0.97);

      if (!isPastDue) {
        const status: AssignmentStatus = engaged && random() > 0.55 ? "submitted" : "pending";
        return {
          assignmentId: assignment.id,
          studentId: student.id,
          status,
          submittedOn: status === "submitted" ? toIso(-1) : null,
          marks: null,
          feedback: null,
        };
      }

      if (!engaged) {
        return {
          assignmentId: assignment.id,
          studentId: student.id,
          status: "overdue" as const,
          submittedOn: null,
          marks: null,
          feedback: null,
        };
      }

      const ratio = clamp(skill + (random() - 0.5) * 0.18, 0.3, 1);
      const marks = Math.round(assignment.maxMarks * ratio);
      const band = ratio >= 0.8 ? "high" : ratio >= 0.6 ? "mid" : "low";
      return {
        assignmentId: assignment.id,
        studentId: student.id,
        status: "graded" as const,
        submittedOn: assignment.dueDate,
        marks,
        feedback: FEEDBACK_BY_BAND[band],
      };
    });
  },
);

// ---------------------------------------------------------------------------
// Examinations
// ---------------------------------------------------------------------------

const EXAM_TEMPLATES: readonly {
  type: ExamType;
  label: string;
  offset: number;
  maxInternal: number;
  maxExam: number;
  durationMinutes: number;
}[] = [
  { type: "Internal", label: "Internal Assessment I", offset: -46, maxInternal: 0, maxExam: 30, durationMinutes: 60 },
  { type: "Mid-Term", label: "Mid-Term Examination", offset: -20, maxInternal: 20, maxExam: 80, durationMinutes: 120 },
  { type: "Final", label: "End-Semester Examination", offset: 24, maxInternal: 20, maxExam: 80, durationMinutes: 180 },
];

export const exams: readonly Exam[] = classGroups.flatMap((group) =>
  group.courseIds.flatMap((courseId) => {
    const course = courses.find((item) => item.id === courseId);
    if (!course) return [];
    return EXAM_TEMPLATES.map((template, index) => ({
      id: `ex-${group.id}-${courseId}-${index}`,
      title: `${course.code} · ${template.label}`,
      courseId,
      classId: group.id,
      type: template.type,
      date: toIso(template.offset),
      maxMarks: template.maxInternal + template.maxExam,
      durationMinutes: template.durationMinutes,
      room: group.room,
    }));
  }),
);

export const isPastExam = (exam: Exam): boolean => exam.date < toIso(0);

export const examResults: readonly ExamResult[] = exams
  .filter(isPastExam)
  .flatMap((exam) => {
    const template = EXAM_TEMPLATES.find((item) => item.type === exam.type);
    if (!template) return [];
    const cohort = students.filter((student) => student.classId === exam.classId);

    return cohort.map((student) => {
      const skill = skillFor(student.id, exam.courseId);
      const momentum = momentumFor(student.id, exam.courseId);
      const random = createRandom(`result:${exam.id}:${student.id}`);
      const recencyWeight = exam.type === "Mid-Term" ? 1 : 0;
      const ratio = clamp(skill + momentum * recencyWeight + (random() - 0.5) * 0.12, 0.24, 1);

      return {
        examId: exam.id,
        studentId: student.id,
        maxInternal: template.maxInternal,
        maxExam: template.maxExam,
        internalMarks: Math.round(template.maxInternal * clamp(ratio + 0.08, 0.3, 1)),
        examMarks: Math.round(template.maxExam * ratio),
      };
    });
  });

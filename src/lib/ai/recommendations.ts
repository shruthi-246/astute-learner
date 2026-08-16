/**
 * AI Engine — Personalised Study Recommendations.
 *
 * Recommendations are derived from weak subjects, attendance gaps, pending work
 * and upcoming deadlines, then ranked so the highest-impact action is first.
 */
import type { PerformanceAnalysis, StudyRecommendation, WeakSubjectFinding } from "@/types/ai";
import type { Student } from "@/types/academic";
import { getCourse } from "@/data";
import { ATTENDANCE_THRESHOLD } from "@/lib/grading";
import { getStudentAssignments, getUpcomingExams } from "@/lib/academic/selectors";

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 } as const;

function revisionTopicsFor(courseId: string): string {
  const course = getCourse(courseId);
  if (!course) return "the core modules";
  return course.modules
    .slice(0, 2)
    .map((module) => module.title)
    .join(" and ");
}

export function buildStudyRecommendations(
  student: Student,
  analysis: PerformanceAnalysis,
  weakSubjects: readonly WeakSubjectFinding[],
): StudyRecommendation[] {
  const recommendations: StudyRecommendation[] = [];

  for (const weak of weakSubjects.slice(0, 3)) {
    recommendations.push({
      id: `revise-${weak.courseId}`,
      title: `Revise ${revisionTopicsFor(weak.courseId)} in ${weak.courseTitle}`,
      detail: `Scoring ${weak.score.toFixed(1)}% against a class average of ${weak.classAverage.toFixed(1)}%. Rebuild these modules before the next assessment.`,
      courseId: weak.courseId,
      priority: weak.severity === "high" ? "high" : "medium",
      suggestedMinutesPerWeek: weak.severity === "high" ? 240 : 150,
      kind: "revision",
    });
  }

  const pending = getStudentAssignments(student.id).filter(
    (entry) => entry.submission.status === "pending" || entry.submission.status === "overdue",
  );

  for (const entry of pending.slice(0, 3)) {
    const overdue = entry.submission.status === "overdue";
    recommendations.push({
      id: `deadline-${entry.assignment.id}`,
      title: `${overdue ? "Clear overdue" : "Complete"} — ${entry.assignment.title}`,
      detail: `${overdue ? "This submission is past its deadline of" : "Due on"} ${entry.assignment.dueDate}. Worth ${entry.assignment.maxMarks} marks toward internal assessment.`,
      courseId: entry.assignment.courseId,
      priority: overdue ? "high" : "medium",
      suggestedMinutesPerWeek: 90,
      kind: "deadline",
    });
  }

  if (analysis.attendance < ATTENDANCE_THRESHOLD) {
    recommendations.push({
      id: "habit-attendance",
      title: "Restore attendance above the eligibility threshold",
      detail: `Attendance is ${analysis.attendance.toFixed(1)}%. Full attendance for the next four weeks brings you back above ${ATTENDANCE_THRESHOLD}%.`,
      courseId: null,
      priority: "high",
      suggestedMinutesPerWeek: 0,
      kind: "habit",
    });
  }

  const nextExam = getUpcomingExams(student.classId)[0];
  if (nextExam) {
    recommendations.push({
      id: `practice-${nextExam.id}`,
      title: `Timed practice for ${nextExam.title}`,
      detail: `Scheduled for ${nextExam.date} in ${nextExam.room}. Two full-length attempts under exam conditions is the highest-yield preparation.`,
      courseId: nextExam.courseId,
      priority: "medium",
      suggestedMinutesPerWeek: 180,
      kind: "practice",
    });
  }

  if (analysis.strongSubjects[0]) {
    recommendations.push({
      id: `maintain-${analysis.strongSubjects[0].courseId}`,
      title: `Protect your lead in ${analysis.strongSubjects[0].courseTitle}`,
      detail: "A short weekly retrieval session is enough to hold a strong subject while you redirect effort elsewhere.",
      courseId: analysis.strongSubjects[0].courseId,
      priority: "low",
      suggestedMinutesPerWeek: 45,
      kind: "habit",
    });
  }

  return recommendations.sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
  );
}

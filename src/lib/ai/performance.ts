/**
 * AI Engine — Performance Analysis.
 *
 * A transparent, rule-based analytical model over attendance, assignment
 * completion and assessment results. Every number shown in the UI is traceable
 * back to the academic signals computed in `selectors.ts`.
 */
import type { PerformanceAnalysis, SubjectPerformance, Trend } from "@/types/ai";
import type { Student } from "@/types/academic";
import { roundTo } from "@/data/random";
import {
  getOverallAttendance,
  getOverallScore,
  getRecentScoreDelta,
  getSubjectAssignmentCompletion,
  getSubjectPerformance,
} from "@/lib/academic/selectors";

/** Relative contribution of each signal to the composite performance score. */
export const PERFORMANCE_WEIGHTS = {
  assessments: 0.6,
  attendance: 0.25,
  assignments: 0.15,
} as const;

const STRONG_SUBJECT_MIN = 75;
const WEAK_SUBJECT_MAX = 62;

function statusFor(score: number): PerformanceAnalysis["academicStatus"] {
  if (score >= 85) return "Excellent";
  if (score >= 72) return "Strong";
  if (score >= 60) return "Satisfactory";
  if (score >= 48) return "Needs Attention";
  return "Critical";
}

function trendFrom(delta: number): Trend {
  if (delta > 2.5) return "improving";
  if (delta < -2.5) return "declining";
  return "stable";
}

function buildSummary(
  student: Student,
  status: PerformanceAnalysis["academicStatus"],
  trend: Trend,
  strong: readonly SubjectPerformance[],
  weak: readonly SubjectPerformance[],
): string {
  const opening = `${student.name.split(" ")[0]}'s overall performance is ${status.toLowerCase()}.`;
  const strongest = strong[0];
  const weakest = weak[0];

  const strengthClause = strongest
    ? ` ${strongest.courseTitle} is the strongest subject at ${strongest.score.toFixed(1)}%.`
    : " No subject has yet crossed the strength threshold.";

  const weaknessClause = weakest
    ? ` ${weakest.courseTitle} requires additional attention at ${weakest.score.toFixed(1)}%.`
    : " No subject is currently flagged as weak.";

  const trendClause =
    trend === "improving"
      ? " Recent assessments show an upward trajectory."
      : trend === "declining"
        ? " Recent assessments show a decline that should be addressed early."
        : " Recent assessments are holding steady.";

  return opening + strengthClause + weaknessClause + trendClause;
}

export function analysePerformance(student: Student): PerformanceAnalysis {
  const subjects = getSubjectPerformance(student);
  const attendance = getOverallAttendance(student.id);
  const assignmentCompletion = getSubjectAssignmentCompletion(student.id);
  const assessmentScore = getOverallScore(student.id);

  const overallScore = roundTo(
    assessmentScore * PERFORMANCE_WEIGHTS.assessments +
      attendance * PERFORMANCE_WEIGHTS.attendance +
      assignmentCompletion * PERFORMANCE_WEIGHTS.assignments,
  );

  const trendDelta = getRecentScoreDelta(student.id);
  const trend = trendFrom(trendDelta);

  const ranked = [...subjects].sort((a, b) => b.score - a.score);
  const strongSubjects = ranked.filter((subject) => subject.score >= STRONG_SUBJECT_MIN);
  const weakSubjects = [...ranked]
    .reverse()
    .filter((subject) => subject.score < WEAK_SUBJECT_MAX || subject.score < subject.classAverage - 8);

  const academicStatus = statusFor(overallScore);

  return {
    studentId: student.id,
    overallScore,
    attendance,
    assignmentCompletion,
    trend,
    trendDelta,
    academicStatus,
    strongSubjects,
    weakSubjects,
    subjects,
    summary: buildSummary(student, academicStatus, trend, strongSubjects, weakSubjects),
  };
}

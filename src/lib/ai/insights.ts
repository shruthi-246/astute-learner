/**
 * AI Engine — Insights & Reports for students, teachers and administrators.
 *
 * Cohort-level aggregation built from the same per-student analysis, so a
 * class insight can always be traced down to the individual signals behind it.
 */
import type { AiInsight, ClassAnalytics } from "@/types/ai";
import type { ClassGroup } from "@/types/academic";
import { average, roundTo } from "@/data/random";
import { GRADE_BANDS, gradeFor } from "@/lib/grading";
import { getCourseTitle, getStudentsByClass } from "@/data";
import {
  getClassAverageForCourse,
  getOverallAttendance,
  getOverallScore,
  getSubjectAssignmentCompletion,
} from "@/lib/academic/selectors";
import { detectRisk } from "./risk";
import { analysePerformance } from "./performance";
import { identifyWeakSubjects } from "./weak-subjects";

export function analyseClass(group: ClassGroup): ClassAnalytics {
  const cohort = getStudentsByClass(group.id);
  const scores = cohort.map((student) => getOverallScore(student.id));

  const distribution = GRADE_BANDS.map((band) => ({
    grade: band.grade,
    count: scores.filter((score) => gradeFor(score).grade === band.grade).length,
  }));

  const weakestSubjects = group.courseIds
    .map((courseId) => ({
      courseId,
      title: getCourseTitle(courseId),
      average: getClassAverageForCourse(group.id, courseId),
    }))
    .sort((a, b) => a.average - b.average);

  return {
    classId: group.id,
    className: group.name,
    studentCount: cohort.length,
    averageScore: roundTo(average(scores)),
    averageAttendance: roundTo(average(cohort.map((student) => getOverallAttendance(student.id)))),
    assignmentCompletion: roundTo(
      average(cohort.map((student) => getSubjectAssignmentCompletion(student.id))),
    ),
    atRiskCount: cohort.filter((student) => detectRisk(student).level !== "low").length,
    gradeDistribution: distribution,
    weakestSubjects,
  };
}

export function buildTeacherInsights(groups: readonly ClassGroup[]): AiInsight[] {
  const insights: AiInsight[] = [];

  for (const group of groups) {
    const analytics = analyseClass(group);
    const weakest = analytics.weakestSubjects[0];

    if (analytics.atRiskCount > 0) {
      insights.push({
        id: `teacher-risk-${group.id}`,
        headline: `${analytics.atRiskCount} student${analytics.atRiskCount === 1 ? "" : "s"} in ${group.name} need attention`,
        detail: `Combined attendance, submission and assessment signals place ${analytics.atRiskCount} of ${analytics.studentCount} learners outside the safe band. Start with the highest risk score in the At-Risk view.`,
        tone: analytics.atRiskCount > analytics.studentCount / 3 ? "critical" : "warning",
        audience: "teacher",
      });
    }

    if (weakest) {
      insights.push({
        id: `teacher-topic-${group.id}`,
        headline: `${weakest.title} is the weakest topic area in ${group.name}`,
        detail: `Class average is ${weakest.average.toFixed(1)}%. A targeted revision session on the first two modules is likely to lift the cohort mean by several points.`,
        tone: "warning",
        audience: "teacher",
      });
    }

    if (analytics.averageAttendance >= 85) {
      insights.push({
        id: `teacher-attendance-${group.id}`,
        headline: `${group.name} attendance is healthy at ${analytics.averageAttendance.toFixed(1)}%`,
        detail: "Engagement is not the limiting factor for this cohort — focus interventions on assessment technique instead.",
        tone: "positive",
        audience: "teacher",
      });
    }
  }

  return insights;
}

export function buildAdminInsights(groups: readonly ClassGroup[]): AiInsight[] {
  const analytics = groups.map(analyseClass);
  if (analytics.length === 0) return [];

  const ranked = [...analytics].sort((a, b) => b.averageScore - a.averageScore);
  const best = ranked[0]!;
  const worst = ranked[ranked.length - 1]!;
  const totalAtRisk = analytics.reduce((sum, item) => sum + item.atRiskCount, 0);
  const institutionAttendance = roundTo(average(analytics.map((item) => item.averageAttendance)));

  return [
    {
      id: "admin-comparative",
      headline: `${best.className} leads institutional performance at ${best.averageScore.toFixed(1)}%`,
      detail: `${worst.className} trails at ${worst.averageScore.toFixed(1)}%, a spread of ${(best.averageScore - worst.averageScore).toFixed(1)} points. Faculty exchange between these cohorts is the fastest lever.`,
      tone: "neutral",
      audience: "admin",
    },
    {
      id: "admin-risk",
      headline: `${totalAtRisk} students are flagged at medium or high risk`,
      detail: "Risk is concentrated in cohorts where attendance and assignment completion fall together — a single intervention usually addresses both.",
      tone: totalAtRisk > 8 ? "critical" : "warning",
      audience: "admin",
    },
    {
      id: "admin-attendance",
      headline: `Institution-wide attendance is ${institutionAttendance.toFixed(1)}%`,
      detail:
        institutionAttendance >= 80
          ? "Attendance is above policy. Maintain the current advisory cadence."
          : "Attendance is close to the eligibility floor. Advisor check-ins should be weekly until it recovers.",
      tone: institutionAttendance >= 80 ? "positive" : "warning",
      audience: "admin",
    },
    {
      id: "admin-intervention",
      headline: "Recommended intervention: targeted remedial track",
      detail: `Run a four-week remedial track for ${worst.weakestSubjects[0]?.title ?? "the weakest subject"} across ${worst.className}, paired with mandatory attendance recovery for flagged learners.`,
      tone: "neutral",
      audience: "admin",
    },
  ];
}

/** Student-facing insights derived from the full analysis pipeline. */
export function buildInsightsForStudent(student: Parameters<typeof analysePerformance>[0]): AiInsight[] {
  const analysis = analysePerformance(student);
  const risk = detectRisk(student);
  const weak = identifyWeakSubjects(analysis);
  const insights: AiInsight[] = [
    {
      id: "student-summary",
      headline: `Academic status: ${analysis.academicStatus}`,
      detail: analysis.summary,
      tone:
        analysis.academicStatus === "Critical"
          ? "critical"
          : analysis.academicStatus === "Needs Attention"
            ? "warning"
            : "positive",
      audience: "student",
    },
  ];

  if (risk.signals.length > 0) {
    insights.push({
      id: "student-risk",
      headline: `Risk detection: ${risk.level === "high" ? "High" : risk.level === "medium" ? "Medium" : "Low"} risk`,
      detail: `${risk.signals.map((signal) => signal.reason).join(" ")} ${risk.recommendation}`,
      tone: risk.level === "high" ? "critical" : risk.level === "medium" ? "warning" : "neutral",
      audience: "student",
    });
  }

  if (weak[0]) {
    insights.push({
      id: "student-weak",
      headline: `${weak[0].courseTitle} has been identified as a weak subject`,
      detail: weak[0].recommendation,
      tone: "warning",
      audience: "student",
    });
  }

  if (analysis.trend === "improving") {
    insights.push({
      id: "student-trend",
      headline: `Performance is improving by ${analysis.trendDelta.toFixed(1)} points`,
      detail: "The most recent assessments are stronger than earlier ones. Keep the current study routine unchanged.",
      tone: "positive",
      audience: "student",
    });
  }

  return insights;
}

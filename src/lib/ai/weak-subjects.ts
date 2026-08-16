/**
 * AI Engine — Weak Subject Identification.
 *
 * A subject is weak when its score is low in absolute terms, when it trails the
 * class average, or when it is declining. Each finding carries the evidence
 * used to reach it.
 */
import type { PerformanceAnalysis, WeakSubjectFinding, RiskLevel } from "@/types/ai";
import { roundTo } from "@/data/random";

const ABSOLUTE_WEAK_SCORE = 62;
const CLASS_GAP_TOLERANCE = 8;

function severityFor(score: number, gap: number): RiskLevel {
  if (score < 50 || gap <= -15) return "high";
  if (score < 62 || gap <= -8) return "medium";
  return "low";
}

function recommendationFor(title: string, severity: RiskLevel, trend: string): string {
  if (severity === "high") {
    return `Prioritise ${title}: rebuild the fundamentals module by module and attempt one past paper per week under timed conditions.`;
  }
  if (severity === "medium") {
    return `Schedule two focused ${title} sessions each week and rework every incorrect answer from the last assessment.`;
  }
  return `${title} is ${trend}. Keep a light weekly revision slot to protect the gain.`;
}

export function identifyWeakSubjects(analysis: PerformanceAnalysis): WeakSubjectFinding[] {
  return analysis.subjects
    .map((subject) => {
      const gap = roundTo(subject.score - subject.classAverage);
      return { subject, gap };
    })
    .filter(
      ({ subject, gap }) =>
        subject.score < ABSOLUTE_WEAK_SCORE ||
        gap <= -CLASS_GAP_TOLERANCE ||
        subject.trend === "declining",
    )
    .map(({ subject, gap }) => {
      const severity = severityFor(subject.score, gap);
      return {
        courseId: subject.courseId,
        courseTitle: subject.courseTitle,
        score: subject.score,
        classAverage: subject.classAverage,
        gap,
        trend: subject.trend,
        severity,
        recommendation: recommendationFor(subject.courseTitle, severity, subject.trend),
      };
    })
    .sort((a, b) => a.score - b.score);
}

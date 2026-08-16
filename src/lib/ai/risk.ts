/**
 * AI Engine — At-Risk Student Detection.
 *
 * Signals are evaluated independently, each producing an explanation and a
 * recommended action, then combined into a weighted risk score. Explainability
 * is deliberate: a teacher must be able to see *why* a student was flagged.
 */
import type { RiskAssessment, RiskLevel, RiskSignal } from "@/types/ai";
import type { Student } from "@/types/academic";
import { clamp, roundTo } from "@/data/random";
import { ATTENDANCE_THRESHOLD } from "@/lib/grading";
import {
  getOverallAttendance,
  getOverallScore,
  getRecentScoreDelta,
  getSubjectAssignmentCompletion,
} from "@/lib/academic/selectors";

export const RISK_THRESHOLDS = {
  attendance: ATTENDANCE_THRESHOLD,
  averageGrade: 60,
  assignmentCompletion: 60,
  scoreDecline: -5,
} as const;

const SEVERITY_WEIGHT: Record<RiskLevel, number> = { low: 1, medium: 2, high: 3 };

function severityFrom(value: number, threshold: number, criticalGap: number): RiskLevel {
  const gap = threshold - value;
  if (gap >= criticalGap) return "high";
  if (gap >= criticalGap / 2) return "medium";
  return "low";
}

export function detectRisk(student: Student): RiskAssessment {
  const attendance = getOverallAttendance(student.id);
  const averageGrade = getOverallScore(student.id);
  const completion = getSubjectAssignmentCompletion(student.id);
  const delta = getRecentScoreDelta(student.id);

  const signals: RiskSignal[] = [];

  if (attendance < RISK_THRESHOLDS.attendance) {
    signals.push({
      id: "attendance",
      issue: "Attendance below institutional threshold",
      reason: `Attendance is ${attendance.toFixed(1)}% against the required ${RISK_THRESHOLDS.attendance}%.`,
      action: "Attend every scheduled session this month and request make-up sessions for missed labs.",
      severity: severityFrom(attendance, RISK_THRESHOLDS.attendance, 15),
      metric: attendance,
    });
  }

  if (averageGrade < RISK_THRESHOLDS.averageGrade) {
    signals.push({
      id: "academic",
      issue: "Average assessment score below the pass benchmark",
      reason: `Average across graded assessments is ${averageGrade.toFixed(1)}%, under the ${RISK_THRESHOLDS.averageGrade}% benchmark.`,
      action: "Book weekly remedial slots for the two lowest-scoring subjects and re-attempt past papers.",
      severity: severityFrom(averageGrade, RISK_THRESHOLDS.averageGrade, 15),
      metric: averageGrade,
    });
  }

  if (completion < RISK_THRESHOLDS.assignmentCompletion) {
    signals.push({
      id: "assignments",
      issue: "Low assignment completion",
      reason: `Only ${completion.toFixed(0)}% of due assignments have been submitted.`,
      action: "Clear all overdue submissions before the next deadline and set reminders 48 hours ahead.",
      severity: severityFrom(completion, RISK_THRESHOLDS.assignmentCompletion, 25),
      metric: completion,
    });
  }

  if (delta <= RISK_THRESHOLDS.scoreDecline) {
    signals.push({
      id: "trend",
      issue: "Declining performance trend",
      reason: `Recent assessments are ${Math.abs(delta).toFixed(1)} points below earlier ones.`,
      action: "Review the last two assessments with the course instructor to isolate the regression.",
      severity: delta <= -12 ? "high" : "medium",
      metric: delta,
    });
  }

  const weighted = signals.reduce((sum, signal) => sum + SEVERITY_WEIGHT[signal.severity], 0);
  const score = clamp(roundTo((weighted / 9) * 100, 0), 0, 100);
  const level: RiskLevel = weighted >= 5 ? "high" : weighted >= 2 ? "medium" : "low";

  const recommendation =
    signals.length === 0
      ? "No academic risk detected. Maintain current attendance and submission habits."
      : level === "high"
        ? "Escalate to the faculty advisor: improve attendance, clear pending assignments and start structured revision of weak subjects immediately."
        : level === "medium"
          ? "Address the flagged signals within two weeks and re-evaluate at the next assessment."
          : "Minor signal detected. A small correction now prevents escalation.";

  return { studentId: student.id, level, score, signals, recommendation };
}

export const riskLabel: Record<RiskLevel, string> = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk",
};

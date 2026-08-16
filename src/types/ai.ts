/** Types produced by the academic AI engine (src/lib/ai). */

export type RiskLevel = "low" | "medium" | "high";
export type Trend = "improving" | "stable" | "declining";

export interface SubjectPerformance {
  readonly courseId: string;
  readonly courseTitle: string;
  readonly score: number;
  readonly classAverage: number;
  readonly trend: Trend;
  readonly attendance: number;
  readonly assignmentCompletion: number;
}

export interface PerformanceAnalysis {
  readonly studentId: string;
  readonly overallScore: number;
  readonly attendance: number;
  readonly assignmentCompletion: number;
  readonly trend: Trend;
  readonly trendDelta: number;
  readonly academicStatus: "Excellent" | "Strong" | "Satisfactory" | "Needs Attention" | "Critical";
  readonly strongSubjects: readonly SubjectPerformance[];
  readonly weakSubjects: readonly SubjectPerformance[];
  readonly subjects: readonly SubjectPerformance[];
  readonly summary: string;
}

export interface RiskSignal {
  readonly id: string;
  readonly issue: string;
  readonly reason: string;
  readonly action: string;
  readonly severity: RiskLevel;
  readonly metric: number;
}

export interface RiskAssessment {
  readonly studentId: string;
  readonly level: RiskLevel;
  readonly score: number;
  readonly signals: readonly RiskSignal[];
  readonly recommendation: string;
}

export interface WeakSubjectFinding {
  readonly courseId: string;
  readonly courseTitle: string;
  readonly score: number;
  readonly classAverage: number;
  readonly gap: number;
  readonly trend: Trend;
  readonly severity: RiskLevel;
  readonly recommendation: string;
}

export interface StudyRecommendation {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
  readonly courseId: string | null;
  readonly priority: "high" | "medium" | "low";
  readonly suggestedMinutesPerWeek: number;
  readonly kind: "revision" | "practice" | "deadline" | "habit";
}

export interface AiInsight {
  readonly id: string;
  readonly headline: string;
  readonly detail: string;
  readonly tone: "positive" | "warning" | "critical" | "neutral";
  readonly audience: "student" | "teacher" | "admin";
}

export interface ClassAnalytics {
  readonly classId: string;
  readonly className: string;
  readonly studentCount: number;
  readonly averageScore: number;
  readonly averageAttendance: number;
  readonly assignmentCompletion: number;
  readonly atRiskCount: number;
  readonly gradeDistribution: readonly { readonly grade: string; readonly count: number }[];
  readonly weakestSubjects: readonly { readonly courseId: string; readonly title: string; readonly average: number }[];
}

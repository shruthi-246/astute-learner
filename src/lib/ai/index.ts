/**
 * Public facade of the academic AI engine.
 *
 * The engine is intentionally deterministic and explainable: every output is a
 * pure function of the academic record. Because it is isolated behind this
 * facade, the rule-based model can later be swapped for a server-side LLM call
 * without touching a single component.
 */
import type { Student } from "@/types/academic";
import type {
  AiInsight,
  PerformanceAnalysis,
  RiskAssessment,
  StudyRecommendation,
  WeakSubjectFinding,
} from "@/types/ai";
import { analysePerformance } from "./performance";
import { detectRisk } from "./risk";
import { identifyWeakSubjects } from "./weak-subjects";
import { buildStudyRecommendations } from "./recommendations";
import { buildInsightsForStudent } from "./insights";

export interface StudentIntelligenceProfile {
  readonly student: Student;
  readonly analysis: PerformanceAnalysis;
  readonly risk: RiskAssessment;
  readonly weakSubjects: readonly WeakSubjectFinding[];
  readonly recommendations: readonly StudyRecommendation[];
  readonly insights: readonly AiInsight[];
}

const profileCache = new Map<string, StudentIntelligenceProfile>();

/** Full AI pipeline for one student: analysis → risk → weak subjects → actions. */
export function buildStudentProfile(student: Student): StudentIntelligenceProfile {
  const cached = profileCache.get(student.id);
  if (cached) return cached;

  const analysis = analysePerformance(student);
  const weakSubjects = identifyWeakSubjects(analysis);
  const profile: StudentIntelligenceProfile = {
    student,
    analysis,
    risk: detectRisk(student),
    weakSubjects,
    recommendations: buildStudyRecommendations(student, analysis, weakSubjects),
    insights: buildInsightsForStudent(student),
  };

  profileCache.set(student.id, profile);
  return profile;
}

export { analysePerformance, detectRisk, identifyWeakSubjects, buildStudyRecommendations };
export { analyseClass, buildAdminInsights, buildTeacherInsights } from "./insights";
export { RISK_THRESHOLDS, riskLabel } from "./risk";
export { PERFORMANCE_WEIGHTS } from "./performance";

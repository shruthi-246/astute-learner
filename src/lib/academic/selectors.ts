/**
 * Derived academic metrics.
 *
 * Pure functions over the mock dataset. Everything the AI engine and the
 * dashboards display is computed here, so a metric is defined exactly once.
 */
import type { Assignment, AssignmentSubmission, Exam, ExamResult, Student } from "@/types/academic";
import type { SubjectPerformance, Trend } from "@/types/ai";
import {
  assignmentSubmissions,
  assignments,
  attendanceRecords,
  examResults,
  exams,
  getCourseTitle,
  getStudentsByClass,
  isPastExam,
  students,
} from "@/data";
import { average, roundTo } from "@/data/random";

const groupBy = <T, K>(items: readonly T[], key: (item: T) => K): Map<K, T[]> => {
  const map = new Map<K, T[]>();
  for (const item of items) {
    const bucket = map.get(key(item));
    if (bucket) bucket.push(item);
    else map.set(key(item), [item]);
  }
  return map;
};

const assignmentIndex = new Map(assignments.map((item) => [item.id, item]));
const examIndex = new Map(exams.map((item) => [item.id, item]));
const submissionsByStudent = groupBy(assignmentSubmissions, (item) => item.studentId);
const resultsByStudent = groupBy(examResults, (item) => item.studentId);
const attendanceIndex = new Map(attendanceRecords.map((record) => [record.studentId, record]));

export const pastAssignments = assignments.filter((item) => item.dueDate < new Date().toISOString().slice(0, 10));

export function getAttendanceRecord(studentId: string) {
  return attendanceIndex.get(studentId);
}

export function getStudentAssignments(studentId: string): {
  assignment: Assignment;
  submission: AssignmentSubmission;
}[] {
  return (submissionsByStudent.get(studentId) ?? [])
    .map((submission) => ({ submission, assignment: assignmentIndex.get(submission.assignmentId) }))
    .filter((entry): entry is { submission: AssignmentSubmission; assignment: Assignment } =>
      Boolean(entry.assignment),
    )
    .sort((a, b) => a.assignment.dueDate.localeCompare(b.assignment.dueDate));
}

export function getStudentExamResults(studentId: string): { exam: Exam; result: ExamResult }[] {
  return (resultsByStudent.get(studentId) ?? [])
    .map((result) => ({ result, exam: examIndex.get(result.examId) }))
    .filter((entry): entry is { result: ExamResult; exam: Exam } => Boolean(entry.exam))
    .sort((a, b) => a.exam.date.localeCompare(b.exam.date));
}

export function getUpcomingExams(classId: string): Exam[] {
  return exams
    .filter((exam) => exam.classId === classId && !isPastExam(exam))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export const resultPercentage = (result: ExamResult): number =>
  ((result.internalMarks + result.examMarks) / (result.maxInternal + result.maxExam)) * 100;

export function getSubjectAttendance(studentId: string, courseId: string): number {
  const subject = attendanceIndex.get(studentId)?.subjects.find((item) => item.courseId === courseId);
  if (!subject || subject.workingDays === 0) return 0;
  return roundTo((subject.presentDays / subject.workingDays) * 100);
}

export function getOverallAttendance(studentId: string): number {
  const record = attendanceIndex.get(studentId);
  if (!record || record.subjects.length === 0) return 0;
  const present = record.subjects.reduce((sum, subject) => sum + subject.presentDays, 0);
  const working = record.subjects.reduce((sum, subject) => sum + subject.workingDays, 0);
  return working === 0 ? 0 : roundTo((present / working) * 100);
}

export function getSubjectAssignmentCompletion(studentId: string, courseId?: string): number {
  const entries = getStudentAssignments(studentId).filter(
    (entry) =>
      (!courseId || entry.assignment.courseId === courseId) && entry.submission.status !== "pending",
  );
  if (entries.length === 0) return 100;
  const completed = entries.filter(
    (entry) => entry.submission.status === "graded" || entry.submission.status === "submitted",
  ).length;
  return roundTo((completed / entries.length) * 100);
}

export function getSubjectScore(studentId: string, courseId: string): number {
  const relevant = getStudentExamResults(studentId).filter(
    (entry) => entry.exam.courseId === courseId,
  );
  if (relevant.length === 0) return 0;
  return roundTo(average(relevant.map((entry) => resultPercentage(entry.result))));
}

export function getSubjectTrend(studentId: string, courseId: string): { trend: Trend; delta: number } {
  const relevant = getStudentExamResults(studentId).filter(
    (entry) => entry.exam.courseId === courseId,
  );
  if (relevant.length < 2) return { trend: "stable", delta: 0 };
  const first = resultPercentage(relevant[0]!.result);
  const last = resultPercentage(relevant[relevant.length - 1]!.result);
  const delta = roundTo(last - first);
  if (delta > 3) return { trend: "improving", delta };
  if (delta < -3) return { trend: "declining", delta };
  return { trend: "stable", delta };
}

const classAverageCache = new Map<string, number>();

export function getClassAverageForCourse(classId: string, courseId: string): number {
  const key = `${classId}:${courseId}`;
  const cached = classAverageCache.get(key);
  if (cached !== undefined) return cached;
  const cohort = getStudentsByClass(classId);
  const value = roundTo(
    average(cohort.map((student) => getSubjectScore(student.id, courseId)).filter((score) => score > 0)),
  );
  classAverageCache.set(key, value);
  return value;
}

export function getSubjectPerformance(student: Student): SubjectPerformance[] {
  return student.enrolledCourseIds.map((courseId) => ({
    courseId,
    courseTitle: getCourseTitle(courseId),
    score: getSubjectScore(student.id, courseId),
    classAverage: getClassAverageForCourse(student.classId, courseId),
    trend: getSubjectTrend(student.id, courseId).trend,
    attendance: getSubjectAttendance(student.id, courseId),
    assignmentCompletion: getSubjectAssignmentCompletion(student.id, courseId),
  }));
}

export function getOverallScore(studentId: string): number {
  const results = getStudentExamResults(studentId);
  if (results.length === 0) return 0;
  return roundTo(average(results.map((entry) => resultPercentage(entry.result))));
}

export function getRecentScoreDelta(studentId: string): number {
  const results = getStudentExamResults(studentId);
  if (results.length < 4) return 0;
  const half = Math.floor(results.length / 2);
  const older = average(results.slice(0, half).map((entry) => resultPercentage(entry.result)));
  const recent = average(results.slice(half).map((entry) => resultPercentage(entry.result)));
  return roundTo(recent - older);
}

export function getPerformanceTimeline(
  studentId: string,
): { label: string; score: number }[] {
  const byExamType = groupBy(getStudentExamResults(studentId), (entry) => entry.exam.type);
  return Array.from(byExamType.entries()).map(([type, entries]) => ({
    label: type,
    score: roundTo(average(entries.map((entry) => resultPercentage(entry.result)))),
  }));
}

export const allStudents = students;

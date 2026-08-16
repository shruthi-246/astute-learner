/**
 * Domain model for the Education Management Portal.
 * These types are the single source of truth shared by the mock data layer,
 * the AI engine and every presentation component.
 */

export type UserRole = "student" | "teacher" | "admin";

export type CourseCategory =
  | "Computer Science"
  | "Data Science"
  | "Mathematics"
  | "Electronics"
  | "Management";

export interface CourseModule {
  readonly title: string;
  readonly topics: readonly string[];
  readonly durationHours: number;
}

export interface Course {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly category: CourseCategory;
  readonly summary: string;
  readonly description: string;
  readonly teacherId: string;
  readonly credits: number;
  readonly level: "Beginner" | "Intermediate" | "Advanced";
  readonly enrolledCount: number;
  readonly rating: number;
  readonly schedule: readonly { readonly day: string; readonly time: string; readonly room: string }[];
  readonly modules: readonly CourseModule[];
}

export interface Teacher {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly department: string;
  readonly designation: string;
  readonly specialisation: readonly string[];
  readonly experienceYears: number;
  readonly rating: number;
  readonly courseIds: readonly string[];
}

export interface ClassGroup {
  readonly id: string;
  readonly name: string;
  readonly program: string;
  readonly semester: number;
  readonly advisorId: string;
  readonly room: string;
  readonly courseIds: readonly string[];
}

export interface Student {
  readonly id: string;
  readonly rollNumber: string;
  readonly name: string;
  readonly email: string;
  readonly classId: string;
  readonly semester: number;
  readonly enrolledCourseIds: readonly string[];
  readonly guardianName: string;
  readonly joinedOn: string;
}

export interface SubjectAttendance {
  readonly courseId: string;
  readonly workingDays: number;
  readonly presentDays: number;
}

export interface AttendanceRecord {
  readonly studentId: string;
  readonly subjects: readonly SubjectAttendance[];
  /** Month-by-month attendance percentage, oldest first. */
  readonly trend: readonly { readonly month: string; readonly percentage: number }[];
}

export type AssignmentStatus = "submitted" | "pending" | "overdue" | "graded";

export interface Assignment {
  readonly id: string;
  readonly title: string;
  readonly courseId: string;
  readonly classId: string;
  readonly dueDate: string;
  readonly maxMarks: number;
  readonly description: string;
}

export interface AssignmentSubmission {
  readonly assignmentId: string;
  readonly studentId: string;
  readonly status: AssignmentStatus;
  readonly submittedOn: string | null;
  readonly marks: number | null;
  readonly feedback: string | null;
}

export type ExamType = "Internal" | "Mid-Term" | "Final" | "Practical";

export interface Exam {
  readonly id: string;
  readonly title: string;
  readonly courseId: string;
  readonly classId: string;
  readonly type: ExamType;
  readonly date: string;
  readonly maxMarks: number;
  readonly durationMinutes: number;
  readonly room: string;
}

export interface ExamResult {
  readonly examId: string;
  readonly studentId: string;
  readonly internalMarks: number;
  readonly examMarks: number;
  readonly maxInternal: number;
  readonly maxExam: number;
}

export interface Announcement {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly category: "Academic" | "Examination" | "Event" | "Notice";
  readonly publishedOn: string;
}

export interface StudyTip {
  readonly id: string;
  readonly title: string;
  readonly body: string;
}

/**
 * Mock data access layer.
 *
 * Components never import individual dataset files — they go through these
 * repositories. Swapping the demo dataset for a real API later means changing
 * only this module.
 */
import type { ClassGroup, Course, Student, Teacher } from "@/types/academic";
import { classGroups } from "./classes";
import { courses } from "./courses";
import { students } from "./students";
import { teachers } from "./teachers";

export { classGroups, courses, students, teachers };
export { announcements, faqs, studyTips } from "./content";
export {
  REFERENCE_DATE,
  assignments,
  assignmentSubmissions,
  attendanceRecords,
  examResults,
  exams,
  isPastExam,
} from "./academic-records";

const byId = <T extends { id: string }>(items: readonly T[]) =>
  new Map(items.map((item) => [item.id, item]));

const courseIndex = byId(courses);
const teacherIndex = byId(teachers);
const studentIndex = byId(students);
const classIndex = byId(classGroups);

export const getCourse = (id: string): Course | undefined => courseIndex.get(id);
export const getTeacher = (id: string): Teacher | undefined => teacherIndex.get(id);
export const getStudent = (id: string): Student | undefined => studentIndex.get(id);
export const getClassGroup = (id: string): ClassGroup | undefined => classIndex.get(id);

export const getCourseTitle = (id: string): string => courseIndex.get(id)?.title ?? "Unknown course";
export const getCourseCode = (id: string): string => courseIndex.get(id)?.code ?? "—";

export const getStudentsByClass = (classId: string): readonly Student[] =>
  students.filter((student) => student.classId === classId);

export const getCoursesByTeacher = (teacherId: string): readonly Course[] =>
  courses.filter((course) => course.teacherId === teacherId);

export const getClassesByTeacher = (teacherId: string): readonly ClassGroup[] => {
  const owned = new Set(getCoursesByTeacher(teacherId).map((course) => course.id));
  return classGroups.filter((group) => group.courseIds.some((id) => owned.has(id)));
};

export const courseCategories = Array.from(new Set(courses.map((course) => course.category)));

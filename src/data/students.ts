import type { Student } from "@/types/academic";
import { classGroups } from "./classes";

interface StudentSeed {
  readonly name: string;
  readonly classId: string;
  readonly guardianName: string;
}

/**
 * Roster seeds. Academic performance is derived separately in
 * `academic-records.ts` so that the roster stays readable and stable.
 */
const roster: readonly StudentSeed[] = [
  { name: "Aarav Sharma", classId: "cls-cse-a", guardianName: "Rohit Sharma" },
  { name: "Diya Patel", classId: "cls-cse-a", guardianName: "Nilesh Patel" },
  { name: "Kabir Rao", classId: "cls-cse-a", guardianName: "Suresh Rao" },
  { name: "Ishita Verma", classId: "cls-cse-a", guardianName: "Anil Verma" },
  { name: "Rehan Khan", classId: "cls-cse-a", guardianName: "Imran Khan" },
  { name: "Naina Gupta", classId: "cls-cse-a", guardianName: "Vivek Gupta" },
  { name: "Aditya Joshi", classId: "cls-cse-b", guardianName: "Prakash Joshi" },
  { name: "Sara Thomas", classId: "cls-cse-b", guardianName: "Elizabeth Thomas" },
  { name: "Manav Desai", classId: "cls-cse-b", guardianName: "Hiren Desai" },
  { name: "Tanvi Reddy", classId: "cls-cse-b", guardianName: "Srinivas Reddy" },
  { name: "Yash Kulkarni", classId: "cls-cse-b", guardianName: "Sanjay Kulkarni" },
  { name: "Zoya Sheikh", classId: "cls-cse-b", guardianName: "Farid Sheikh" },
  { name: "Neel Bhatt", classId: "cls-ds-a", guardianName: "Kiran Bhatt" },
  { name: "Ananya Pillai", classId: "cls-ds-a", guardianName: "Ravi Pillai" },
  { name: "Vihaan Mehta", classId: "cls-ds-a", guardianName: "Deepak Mehta" },
  { name: "Riya Chatterjee", classId: "cls-ds-a", guardianName: "Amit Chatterjee" },
  { name: "Arnav Saxena", classId: "cls-ds-a", guardianName: "Mohit Saxena" },
  { name: "Meher Kaur", classId: "cls-ds-a", guardianName: "Jaspreet Kaur" },
  { name: "Dev Malhotra", classId: "cls-ece-a", guardianName: "Rakesh Malhotra" },
  { name: "Prisha Nambiar", classId: "cls-ece-a", guardianName: "Girish Nambiar" },
  { name: "Ayaan Qureshi", classId: "cls-ece-a", guardianName: "Salim Qureshi" },
  { name: "Lavanya Iyer", classId: "cls-ece-a", guardianName: "Mahesh Iyer" },
  { name: "Rudra Ghosh", classId: "cls-ece-a", guardianName: "Partha Ghosh" },
  { name: "Sanya Kapoor", classId: "cls-ece-a", guardianName: "Rajesh Kapoor" },
];

const toEmail = (name: string) =>
  `${name.toLowerCase().replace(/[^a-z ]/g, "").split(" ").join(".")}@student.northbridge.edu`;

export const students: readonly Student[] = roster.map((seed, index) => {
  const group = classGroups.find((cls) => cls.id === seed.classId);
  if (!group) throw new Error(`Unknown class for student ${seed.name}`);
  const serial = String(index + 1).padStart(3, "0");
  return {
    id: `s-${serial}`,
    rollNumber: `NB24${serial}`,
    name: seed.name,
    email: toEmail(seed.name),
    classId: seed.classId,
    semester: group.semester,
    enrolledCourseIds: group.courseIds,
    guardianName: seed.guardianName,
    joinedOn: "2024-07-15",
  };
});

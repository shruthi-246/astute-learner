import type { UserRole } from "@/types/academic";
import {
  BarChart3,
  BookOpen,
  Brain,
  CalendarCheck,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Lightbulb,
  School,
  UserCircle,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  readonly label: string;
  readonly to: string;
  readonly icon: LucideIcon;
}

export const publicNav: readonly { readonly label: string; readonly to: string }[] = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/courses" },
  { label: "Contact", to: "/contact" },
];

const dashboard: NavItem = { label: "Dashboard", to: "/app/dashboard", icon: LayoutDashboard };
const profile: NavItem = { label: "Profile", to: "/app/profile", icon: UserCircle };

/** Single source of truth for role-aware navigation. Every link resolves to a real route. */
export const roleNavigation: Record<UserRole, readonly NavItem[]> = {
  student: [
    dashboard,
    { label: "My Courses", to: "/app/courses", icon: BookOpen },
    { label: "Assignments", to: "/app/assignments", icon: ClipboardList },
    { label: "Attendance", to: "/app/attendance", icon: CalendarCheck },
    { label: "Exams & Grades", to: "/app/exams", icon: GraduationCap },
    { label: "AI Insights", to: "/app/ai-insights", icon: Brain },
    { label: "Study Recommendations", to: "/app/recommendations", icon: Lightbulb },
    { label: "Reports", to: "/app/reports", icon: BarChart3 },
    profile,
  ],
  teacher: [
    dashboard,
    { label: "Courses", to: "/app/courses", icon: BookOpen },
    { label: "Classes", to: "/app/classes", icon: School },
    { label: "Assignments", to: "/app/assignments", icon: ClipboardList },
    { label: "Attendance", to: "/app/attendance", icon: CalendarCheck },
    { label: "Student Performance", to: "/app/students", icon: Users },
    { label: "Exams & Grades", to: "/app/exams", icon: GraduationCap },
    { label: "AI Insights", to: "/app/ai-insights", icon: Brain },
    { label: "Reports", to: "/app/reports", icon: BarChart3 },
    profile,
  ],
  admin: [
    dashboard,
    { label: "Students", to: "/app/students", icon: Users },
    { label: "Teachers", to: "/app/teachers", icon: GraduationCap },
    { label: "Courses", to: "/app/courses", icon: BookOpen },
    { label: "Classes", to: "/app/classes", icon: School },
    { label: "Assignments", to: "/app/assignments", icon: ClipboardList },
    { label: "Exams & Grades", to: "/app/exams", icon: CalendarCheck },
    { label: "AI Analytics", to: "/app/ai-insights", icon: Brain },
    { label: "Reports", to: "/app/reports", icon: BarChart3 },
    profile,
  ],
};

export const roleLabel: Record<UserRole, string> = {
  student: "Student",
  teacher: "Faculty",
  admin: "Administrator",
};

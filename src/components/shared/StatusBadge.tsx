import { Badge } from "@/components/ui/badge";
import type { AssignmentStatus } from "@/types/academic";
import type { RiskLevel, Trend } from "@/types/ai";
import { gradeFor } from "@/lib/grading";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "muted" | "secondary";

const ASSIGNMENT_VARIANT: Record<AssignmentStatus, BadgeVariant> = {
  graded: "success",
  submitted: "info",
  pending: "warning",
  overdue: "danger",
};

const ASSIGNMENT_LABEL: Record<AssignmentStatus, string> = {
  graded: "Graded",
  submitted: "Submitted",
  pending: "Pending",
  overdue: "Overdue",
};

export function AssignmentStatusBadge({ status }: { status: AssignmentStatus }) {
  return <Badge variant={ASSIGNMENT_VARIANT[status]}>{ASSIGNMENT_LABEL[status]}</Badge>;
}

const RISK_VARIANT: Record<RiskLevel, BadgeVariant> = {
  low: "success",
  medium: "warning",
  high: "danger",
};

const RISK_LABEL: Record<RiskLevel, string> = {
  low: "Low Risk",
  medium: "Medium Risk",
  high: "High Risk",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return <Badge variant={RISK_VARIANT[level]}>{RISK_LABEL[level]}</Badge>;
}

export function GradeBadge({ percentage }: { percentage: number }) {
  const band = gradeFor(percentage);
  const variant: BadgeVariant =
    band.min >= 80 ? "success" : band.min >= 60 ? "info" : band.min >= 50 ? "warning" : "danger";
  return (
    <Badge variant={variant} title={band.label}>
      {band.grade}
    </Badge>
  );
}

export function TrendPill({ trend, delta }: { trend: Trend; delta?: number }) {
  const Icon = trend === "improving" ? TrendingUp : trend === "declining" ? TrendingDown : Minus;
  const variant: BadgeVariant =
    trend === "improving" ? "success" : trend === "declining" ? "danger" : "muted";
  return (
    <Badge variant={variant} className="gap-1 capitalize">
      <Icon aria-hidden className="size-3" />
      {trend}
      {delta !== undefined && delta !== 0 ? ` ${delta > 0 ? "+" : ""}${delta.toFixed(1)}` : ""}
    </Badge>
  );
}

export function AttendanceBadge({ percentage, threshold = 75 }: { percentage: number; threshold?: number }) {
  const variant: BadgeVariant =
    percentage >= threshold + 10 ? "success" : percentage >= threshold ? "info" : "danger";
  return <Badge variant={variant}>{percentage.toFixed(1)}%</Badge>;
}

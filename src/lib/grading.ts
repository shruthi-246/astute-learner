/** Institutional grading scale, shared by every gradebook surface. */

export interface GradeBand {
  readonly grade: string;
  readonly min: number;
  readonly label: string;
}

export const GRADE_BANDS: readonly GradeBand[] = [
  { grade: "O", min: 90, label: "Outstanding" },
  { grade: "A", min: 80, label: "Excellent" },
  { grade: "B", min: 70, label: "Very good" },
  { grade: "C", min: 60, label: "Good" },
  { grade: "D", min: 50, label: "Pass" },
  { grade: "F", min: 0, label: "Fail" },
];

export function gradeFor(percentage: number): GradeBand {
  return GRADE_BANDS.find((band) => percentage >= band.min) ?? GRADE_BANDS[GRADE_BANDS.length - 1]!;
}

export const ATTENDANCE_THRESHOLD = 75;
export const PASSING_PERCENTAGE = 50;

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

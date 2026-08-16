import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useHydrated } from "@/hooks/use-hydrated";
import { Skeleton } from "@/components/ui/skeleton";

const AXIS_STYLE = { fontSize: 12, fill: "var(--color-muted-foreground)" } as const;

const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: "1px solid var(--color-border)",
  background: "var(--color-surface)",
  boxShadow: "var(--shadow-soft)",
  fontSize: 12,
  color: "var(--color-foreground)",
} as const;

/** Charts measure their container, so they only render after hydration. */
function ChartFrame({ height, children }: { height: number; children: React.ReactElement }) {
  const hydrated = useHydrated();
  if (!hydrated) return <Skeleton style={{ height }} className="w-full rounded-xl" />;
  return (
    <ResponsiveContainer width="100%" height={height}>
      {children}
    </ResponsiveContainer>
  );
}

interface SeriesPoint {
  readonly label: string;
  readonly value: number;
  readonly comparison?: number;
}

export function TrendAreaChart({
  data,
  height = 260,
  valueName = "Score",
  domain = [0, 100],
}: {
  data: readonly SeriesPoint[];
  height?: number;
  valueName?: string;
  domain?: [number, number];
}) {
  return (
    <ChartFrame height={height}>
      <AreaChart data={[...data]} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="label" tick={AXIS_STYLE} tickLine={false} axisLine={false} />
        <YAxis domain={domain} tick={AXIS_STYLE} tickLine={false} axisLine={false} width={44} />
        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value: number) => [`${value}%`, valueName]} />
        <Area
          type="monotone"
          dataKey="value"
          name={valueName}
          stroke="var(--color-chart-1)"
          strokeWidth={2.5}
          fill="url(#trendFill)"
        />
      </AreaChart>
    </ChartFrame>
  );
}

export function ComparisonBarChart({
  data,
  height = 280,
  valueName = "Student",
  comparisonName = "Class average",
}: {
  data: readonly SeriesPoint[];
  height?: number;
  valueName?: string;
  comparisonName?: string;
}) {
  const hasComparison = data.some((point) => point.comparison !== undefined);
  return (
    <ChartFrame height={height}>
      <BarChart data={[...data]} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="label" tick={AXIS_STYLE} tickLine={false} axisLine={false} interval={0} height={48} />
        <YAxis domain={[0, 100]} tick={AXIS_STYLE} tickLine={false} axisLine={false} width={44} />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "var(--color-secondary)" }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="value" name={valueName} fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} maxBarSize={38} />
        {hasComparison ? (
          <Bar
            dataKey="comparison"
            name={comparisonName}
            fill="var(--color-chart-2)"
            radius={[6, 6, 0, 0]}
            maxBarSize={38}
          />
        ) : null}
      </BarChart>
    </ChartFrame>
  );
}

const DISTRIBUTION_COLORS = [
  "var(--color-chart-3)",
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-4)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

export function DistributionChart({
  data,
  height = 240,
}: {
  data: readonly { readonly grade: string; readonly count: number }[];
  height?: number;
}) {
  return (
    <ChartFrame height={height}>
      <BarChart data={[...data]} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="grade" tick={AXIS_STYLE} tickLine={false} axisLine={false} />
        <YAxis allowDecimals={false} tick={AXIS_STYLE} tickLine={false} axisLine={false} width={40} />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: "var(--color-secondary)" }} />
        <Bar dataKey="count" name="Students" radius={[6, 6, 0, 0]} maxBarSize={44}>
          {data.map((entry, index) => (
            <Cell key={entry.grade} fill={DISTRIBUTION_COLORS[index % DISTRIBUTION_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartFrame>
  );
}

export function MultiLineChart({
  data,
  series,
  height = 280,
}: {
  data: readonly Record<string, string | number>[];
  series: readonly { readonly key: string; readonly name: string }[];
  height?: number;
}) {
  return (
    <ChartFrame height={height}>
      <LineChart data={[...data]} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="label" tick={AXIS_STYLE} tickLine={false} axisLine={false} />
        <YAxis domain={[0, 100]} tick={AXIS_STYLE} tickLine={false} axisLine={false} width={44} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {series.map((item, index) => (
          <Line
            key={item.key}
            type="monotone"
            dataKey={item.key}
            name={item.name}
            stroke={`var(--color-chart-${(index % 5) + 1})`}
            strokeWidth={2.5}
            dot={false}
          />
        ))}
      </LineChart>
    </ChartFrame>
  );
}

export function ScoreGauge({ value, label, height = 190 }: { value: number; label: string; height?: number }) {
  const data = [{ name: label, value: Math.max(0, Math.min(100, value)) }];
  return (
    <div className="relative">
      <ChartFrame height={height}>
        <RadialBarChart data={data} innerRadius="72%" outerRadius="100%" startAngle={220} endAngle={-40}>
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar dataKey="value" cornerRadius={12} fill="var(--color-chart-1)" background={{ fill: "var(--color-secondary)" }} />
        </RadialBarChart>
      </ChartFrame>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-4">
        <span className="text-3xl font-semibold text-foreground">{value.toFixed(1)}</span>
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

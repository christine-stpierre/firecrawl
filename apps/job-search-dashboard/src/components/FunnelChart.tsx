import { JobApplication, STAGE_CONFIG, ALL_STAGES } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

interface FunnelChartProps {
  jobs: JobApplication[]
}

const STAGE_COLORS: Record<string, string> = {
  saved: "#94a3b8",
  applied: "#3b82f6",
  screening: "#6366f1",
  interview_1: "#a855f7",
  interview_final: "#8b5cf6",
  offer: "#f59e0b",
  accepted: "#22c55e",
  rejected: "#ef4444",
  ghosted: "#f97316",
  withdrawn: "#6b7280",
}

export function FunnelChart({ jobs }: FunnelChartProps) {
  const data = ALL_STAGES.map((stage) => ({
    name: STAGE_CONFIG[stage].label,
    stage,
    count: jobs.filter((j) => j.stage === stage).length,
  })).filter((d) => d.count > 0)

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pipeline Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">No data yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pipeline Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Tooltip
              formatter={(value: number) => [value, "Applications"]}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.stage} fill={STAGE_COLORS[entry.stage] ?? "#94a3b8"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

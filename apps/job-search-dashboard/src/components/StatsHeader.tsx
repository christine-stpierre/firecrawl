import { JobApplication, ACTIVE_STAGES, CLOSED_STAGES } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, TrendingUp, Trophy, Clock } from "lucide-react"

interface StatsHeaderProps {
  jobs: JobApplication[]
}

export function StatsHeader({ jobs }: StatsHeaderProps) {
  const total = jobs.length
  const active = jobs.filter((j) => ACTIVE_STAGES.includes(j.stage)).length
  const offers = jobs.filter((j) => j.stage === "offer" || j.stage === "accepted").length
  const closed = jobs.filter((j) => CLOSED_STAGES.includes(j.stage)).length

  const appliedCount = jobs.filter((j) => j.stage !== "saved").length
  const offerRate = appliedCount > 0 ? Math.round((offers / appliedCount) * 100) : 0

  const avgDays = (() => {
    const withOffers = jobs.filter(
      (j) => (j.stage === "offer" || j.stage === "accepted") && j.dateApplied
    )
    if (withOffers.length === 0) return null
    const total = withOffers.reduce((acc, j) => {
      const applied = new Date(j.dateApplied!).getTime()
      const updated = new Date(j.dateUpdated).getTime()
      return acc + Math.floor((updated - applied) / (1000 * 60 * 60 * 24))
    }, 0)
    return Math.round(total / withOffers.length)
  })()

  const stats = [
    {
      label: "Total Opportunities",
      value: total,
      sub: `${active} active`,
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "In Pipeline",
      value: active,
      sub: `${closed} closed`,
      icon: TrendingUp,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Offers / Accepted",
      value: offers,
      sub: `${offerRate}% offer rate`,
      icon: Trophy,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Avg. Days to Offer",
      value: avgDays !== null ? `${avgDays}d` : "—",
      sub: "from application",
      icon: Clock,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-3xl font-bold">{s.value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{s.sub}</p>
              </div>
              <div className={`rounded-lg p-2 ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

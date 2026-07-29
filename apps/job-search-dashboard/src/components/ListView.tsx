import { useState } from "react"
import { JobApplication, PipelineStage, ALL_STAGES, STAGE_CONFIG } from "@/types"
import { formatDate, formatSalary } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, ArrowUpDown, ChevronUp, ChevronDown } from "lucide-react"

type SortKey = "company" | "role" | "stage" | "dateApplied" | "dateUpdated"
type SortDir = "asc" | "desc"

interface ListViewProps {
  jobs: JobApplication[]
  onClickJob: (job: JobApplication) => void
  onStageChange: (id: string, stage: PipelineStage) => void
}

export function ListView({ jobs, onClickJob, onStageChange }: ListViewProps) {
  const [search, setSearch] = useState("")
  const [stageFilter, setStageFilter] = useState<string>("all")
  const [sortKey, setSortKey] = useState<SortKey>("dateUpdated")
  const [sortDir, setSortDir] = useState<SortDir>("desc")

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("asc") }
  }

  const filtered = jobs
    .filter((j) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        j.company.toLowerCase().includes(q) ||
        j.role.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q)
      const matchesStage = stageFilter === "all" || j.stage === stageFilter
      return matchesSearch && matchesStage
    })
    .sort((a, b) => {
      let av: string, bv: string
      if (sortKey === "stage") {
        av = STAGE_CONFIG[a.stage].order.toString().padStart(2, "0")
        bv = STAGE_CONFIG[b.stage].order.toString().padStart(2, "0")
      } else {
        av = (a[sortKey] ?? "") as string
        bv = (b[sortKey] ?? "") as string
      }
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av)
    })

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
    return sortDir === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5" />
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          className="max-w-64"
          placeholder="Search company, role, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {ALL_STAGES.map((s) => (
              <SelectItem key={s} value={s}>
                {STAGE_CONFIG[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="self-center text-sm text-muted-foreground">
          {filtered.length} of {jobs.length}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {(
                [
                  { key: "company", label: "Company" },
                  { key: "role", label: "Role" },
                  { key: "stage", label: "Stage" },
                  { key: "dateApplied", label: "Applied" },
                  { key: "dateUpdated", label: "Updated" },
                ] as { key: SortKey; label: string }[]
              ).map(({ key, label }) => (
                <th key={key} className="px-3 py-2.5 text-left font-medium text-muted-foreground">
                  <button
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => toggleSort(key)}
                  >
                    {label}
                    <SortIcon col={key} />
                  </button>
                </th>
              ))}
              <th className="px-3 py-2.5 text-left font-medium text-muted-foreground">Salary</th>
              <th className="px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-muted-foreground text-sm">
                  No results
                </td>
              </tr>
            )}
            {filtered.map((job, i) => {
              const cfg = STAGE_CONFIG[job.stage]
              return (
                <tr
                  key={job.id}
                  className={`cursor-pointer border-t transition-colors hover:bg-accent/30 ${
                    i % 2 === 0 ? "" : "bg-muted/10"
                  }`}
                  onClick={() => onClickJob(job)}
                >
                  <td className="px-3 py-2.5">
                    <div className="font-medium">{job.company}</div>
                    <div className="text-xs text-muted-foreground">{job.location}</div>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">{job.role}</td>
                  <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={job.stage}
                      onValueChange={(v) => onStageChange(job.id, v as PipelineStage)}
                    >
                      <SelectTrigger className="h-7 w-36 text-xs border-0 p-0 shadow-none focus:ring-0">
                        <Badge className={`text-xs ${cfg.bgColor} ${cfg.color} border-0`}>
                          {cfg.label}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {ALL_STAGES.map((s) => (
                          <SelectItem key={s} value={s} className="text-xs">
                            {STAGE_CONFIG[s].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {formatDate(job.dateApplied)}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {formatDate(job.dateUpdated)}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {formatSalary(job.salary) || "—"}
                  </td>
                  <td className="px-3 py-2.5" onClick={(e) => e.stopPropagation()}>
                    {job.url && (
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                        <a href={job.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

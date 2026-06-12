import { JobApplication, STAGE_CONFIG } from "@/types"
import { formatSalary, formatDate, daysSince } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, DollarSign, ExternalLink, Users } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface JobCardProps {
  job: JobApplication
  onClick: (job: JobApplication) => void
}

export function JobCard({ job, onClick }: JobCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: job.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const cfg = STAGE_CONFIG[job.stage]
  const salary = formatSalary(job.salary)
  const days = daysSince(job.dateApplied)

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(job)}
      className="group cursor-pointer rounded-lg border bg-white p-3 shadow-sm transition-shadow hover:shadow-md select-none"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold text-sm leading-tight">{job.company}</p>
          <p className="truncate text-xs text-muted-foreground mt-0.5">{job.role}</p>
        </div>
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {job.location && (
          <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {job.location}
            {job.remote && " · Remote"}
          </span>
        )}
      </div>

      {salary && (
        <div className="mt-1.5 flex items-center gap-0.5 text-xs text-muted-foreground">
          <DollarSign className="h-3 w-3" />
          {salary}
        </div>
      )}

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {job.dateApplied && (
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {days !== null ? `${days}d ago` : formatDate(job.dateApplied)}
            </span>
          )}
          {job.contacts.length > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              {job.contacts.length}
            </span>
          )}
        </div>
        <Badge
          className={`text-xs px-1.5 py-0 ${cfg.bgColor} ${cfg.color} border-0`}
        >
          {cfg.label}
        </Badge>
      </div>

      {job.notes && (
        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground border-t pt-1.5">
          {job.notes}
        </p>
      )}
    </div>
  )
}

import { JobApplication, PipelineStage, STAGE_CONFIG } from "@/types"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { JobCard } from "@/components/JobCard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface KanbanColumnProps {
  stage: PipelineStage
  jobs: JobApplication[]
  onAddJob: (stage: PipelineStage) => void
  onClickJob: (job: JobApplication) => void
}

export function KanbanColumn({ stage, jobs, onAddJob, onClickJob }: KanbanColumnProps) {
  const cfg = STAGE_CONFIG[stage]
  const { setNodeRef, isOver } = useDroppable({ id: stage })

  return (
    <div className="flex w-64 shrink-0 flex-col">
      {/* Column header */}
      <div
        className={`flex items-center justify-between rounded-t-lg border-b-2 px-3 py-2 ${cfg.bgColor} ${cfg.borderColor}`}
      >
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
          <span
            className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${cfg.bgColor} ${cfg.color} ring-1 ${cfg.borderColor}`}
          >
            {jobs.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={`h-6 w-6 ${cfg.color} hover:${cfg.bgColor}`}
          onClick={() => onAddJob(stage)}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Droppable area */}
      <div
        ref={setNodeRef}
        className={`flex flex-1 flex-col gap-2 rounded-b-lg border border-t-0 p-2 transition-colors ${
          isOver ? "bg-accent/50" : "bg-muted/30"
        } ${cfg.borderColor} min-h-[120px]`}
      >
        <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onClick={onClickJob} />
          ))}
        </SortableContext>

        {jobs.length === 0 && (
          <button
            onClick={() => onAddJob(stage)}
            className="flex flex-col items-center justify-center gap-1 rounded-md border border-dashed py-4 text-muted-foreground transition-colors hover:bg-accent/30 hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
            <span className="text-xs">Add opportunity</span>
          </button>
        )}
      </div>
    </div>
  )
}

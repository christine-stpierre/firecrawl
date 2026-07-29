import { useState } from "react"
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core"
import { JobApplication, PipelineStage, ACTIVE_STAGES, CLOSED_STAGES, STAGE_CONFIG } from "@/types"
import { KanbanColumn } from "@/components/KanbanColumn"
import { JobCard } from "@/components/JobCard"

interface KanbanBoardProps {
  jobs: JobApplication[]
  onMoveJob: (id: string, stage: PipelineStage) => void
  onAddJob: (stage: PipelineStage) => void
  onClickJob: (job: JobApplication) => void
  showClosed: boolean
}

export function KanbanBoard({
  jobs,
  onMoveJob,
  onAddJob,
  onClickJob,
  showClosed,
}: KanbanBoardProps) {
  const [activeJob, setActiveJob] = useState<JobApplication | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const stages = showClosed
    ? ([...ACTIVE_STAGES, ...CLOSED_STAGES] as PipelineStage[])
    : ACTIVE_STAGES

  const jobsByStage = (stage: PipelineStage) =>
    jobs
      .filter((j) => j.stage === stage)
      .sort((a, b) => new Date(b.dateUpdated).getTime() - new Date(a.dateUpdated).getTime())

  const handleDragStart = (event: DragStartEvent) => {
    const job = jobs.find((j) => j.id === event.active.id)
    setActiveJob(job ?? null)
  }

  const handleDragOver = (_event: DragOverEvent) => {
    // handled on drag end
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveJob(null)
    const { active, over } = event
    if (!over) return
    const jobId = active.id as string
    const overId = over.id as string

    // over could be a column id (stage) or a job id
    const targetStage = (stages as string[]).includes(overId)
      ? (overId as PipelineStage)
      : jobs.find((j) => j.id === overId)?.stage

    if (!targetStage) return
    const currentStage = jobs.find((j) => j.id === jobId)?.stage
    if (currentStage !== targetStage) {
      onMoveJob(jobId, targetStage)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            jobs={jobsByStage(stage)}
            onAddJob={onAddJob}
            onClickJob={onClickJob}
          />
        ))}
      </div>

      <DragOverlay>
        {activeJob && (
          <div className="rotate-2 opacity-90">
            <JobCard job={activeJob} onClick={() => {}} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

export { STAGE_CONFIG }

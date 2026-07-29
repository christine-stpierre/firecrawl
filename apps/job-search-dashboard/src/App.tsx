import { useState, useRef } from "react"
import { JobApplication, PipelineStage } from "@/types"
import { useJobStore } from "@/hooks/useJobStore"
import { StatsHeader } from "@/components/StatsHeader"
import { FunnelChart } from "@/components/FunnelChart"
import { KanbanBoard } from "@/components/KanbanBoard"
import { ListView } from "@/components/ListView"
import { JobModal } from "@/components/JobModal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Download, Upload, Briefcase, LayoutGrid, List, BarChart2 } from "lucide-react"

export default function App() {
  const { jobs, addJob, updateJob, deleteJob, moveJob, exportJobs, importJobs } = useJobStore()

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null)
  const [defaultStage, setDefaultStage] = useState<PipelineStage | undefined>()
  const [showClosed, setShowClosed] = useState(false)
  const importRef = useRef<HTMLInputElement>(null)

  const openAdd = (stage?: PipelineStage) => {
    setSelectedJob(null)
    setDefaultStage(stage)
    setModalOpen(true)
  }

  const openEdit = (job: JobApplication) => {
    setSelectedJob(job)
    setDefaultStage(undefined)
    setModalOpen(true)
  }

  const handleSave = (data: Omit<JobApplication, "id" | "dateCreated" | "dateUpdated">) => {
    if (selectedJob) {
      updateJob(selectedJob.id, data)
    } else {
      addJob(data)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold tracking-tight">Job Search Pipeline</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportJobs}>
              <Download className="h-4 w-4 mr-1.5" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => importRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-1.5" />
              Import
            </Button>
            <input
              ref={importRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) importJobs(file)
                e.target.value = ""
              }}
            />
            <Button size="sm" onClick={() => openAdd()}>
              <Plus className="h-4 w-4 mr-1.5" />
              Add Opportunity
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-screen-2xl px-6 py-6 space-y-6">
        {/* KPI cards */}
        <StatsHeader jobs={jobs} />

        {/* Main tabs */}
        <Tabs defaultValue="board">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="board" className="gap-1.5">
                <LayoutGrid className="h-4 w-4" />
                Board
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-1.5">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
              <TabsTrigger value="stats" className="gap-1.5">
                <BarChart2 className="h-4 w-4" />
                Charts
              </TabsTrigger>
            </TabsList>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground select-none">
              <input
                type="checkbox"
                checked={showClosed}
                onChange={(e) => setShowClosed(e.target.checked)}
                className="h-4 w-4 rounded"
              />
              Show closed
            </label>
          </div>

          <TabsContent value="board" className="mt-4">
            <KanbanBoard
              jobs={showClosed ? jobs : jobs.filter((j) => !["rejected", "ghosted", "withdrawn", "accepted"].includes(j.stage))}
              onMoveJob={moveJob}
              onAddJob={openAdd}
              onClickJob={openEdit}
              showClosed={showClosed}
            />
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            <ListView jobs={jobs} onClickJob={openEdit} onStageChange={moveJob} />
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <div className="max-w-2xl">
              <FunnelChart jobs={jobs} />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <JobModal
        open={modalOpen}
        job={selectedJob}
        defaultStage={defaultStage}
        onSave={handleSave}
        onDelete={deleteJob}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}

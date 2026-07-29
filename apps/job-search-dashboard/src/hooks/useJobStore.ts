import { useState, useCallback, useEffect } from "react"
import { JobApplication, PipelineStage } from "@/types"
import { generateId } from "@/lib/utils"
import { sampleJobs } from "@/data/sampleJobs"

const STORAGE_KEY = "job-search-dashboard"

function load(): JobApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as JobApplication[]
  } catch {
    // ignore parse errors
  }
  return sampleJobs
}

function save(jobs: JobApplication[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
}

export function useJobStore() {
  const [jobs, setJobs] = useState<JobApplication[]>(load)

  useEffect(() => {
    save(jobs)
  }, [jobs])

  const addJob = useCallback((data: Omit<JobApplication, "id" | "dateCreated" | "dateUpdated">) => {
    const now = new Date().toISOString()
    const job: JobApplication = { ...data, id: generateId(), dateCreated: now, dateUpdated: now }
    setJobs((prev) => [job, ...prev])
    return job
  }, [])

  const updateJob = useCallback(
    (id: string, data: Partial<Omit<JobApplication, "id" | "dateCreated">>) => {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === id ? { ...j, ...data, dateUpdated: new Date().toISOString() } : j
        )
      )
    },
    []
  )

  const deleteJob = useCallback((id: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== id))
  }, [])

  const moveJob = useCallback((id: string, stage: PipelineStage) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, stage, dateUpdated: new Date().toISOString() } : j
      )
    )
  }, [])

  const exportJobs = useCallback(() => {
    const blob = new Blob([JSON.stringify(jobs, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `job-search-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [jobs])

  const importJobs = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string) as JobApplication[]
        setJobs(imported)
      } catch {
        alert("Invalid JSON file")
      }
    }
    reader.readAsText(file)
  }, [])

  return { jobs, addJob, updateJob, deleteJob, moveJob, exportJobs, importJobs }
}

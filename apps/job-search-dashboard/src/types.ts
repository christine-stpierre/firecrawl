export type PipelineStage =
  | "saved"
  | "applied"
  | "screening"
  | "interview_1"
  | "interview_final"
  | "offer"
  | "accepted"
  | "rejected"
  | "ghosted"
  | "withdrawn"

export interface Contact {
  name: string
  title?: string
  email?: string
  isReferral: boolean
}

export interface JobApplication {
  id: string
  company: string
  role: string
  location: string
  remote: boolean
  url?: string
  description?: string
  salary?: {
    min?: number
    max?: number
    currency: string
  }
  stage: PipelineStage
  dateApplied?: string
  dateFollowUp?: string
  dateCreated: string
  dateUpdated: string
  contacts: Contact[]
  notes: string
}

export const STAGE_CONFIG: Record<
  PipelineStage,
  { label: string; color: string; bgColor: string; borderColor: string; order: number }
> = {
  saved: {
    label: "Saved",
    color: "text-slate-600",
    bgColor: "bg-slate-100",
    borderColor: "border-slate-300",
    order: 0,
  },
  applied: {
    label: "Applied",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
    order: 1,
  },
  screening: {
    label: "Screening",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-300",
    order: 2,
  },
  interview_1: {
    label: "Interview",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-300",
    order: 3,
  },
  interview_final: {
    label: "Final Round",
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-300",
    order: 4,
  },
  offer: {
    label: "Offer",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-300",
    order: 5,
  },
  accepted: {
    label: "Accepted",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
    order: 6,
  },
  rejected: {
    label: "Rejected",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
    order: 7,
  },
  ghosted: {
    label: "Ghosted",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-300",
    order: 8,
  },
  withdrawn: {
    label: "Withdrawn",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
    order: 9,
  },
}

export const ACTIVE_STAGES: PipelineStage[] = [
  "saved",
  "applied",
  "screening",
  "interview_1",
  "interview_final",
  "offer",
]

export const CLOSED_STAGES: PipelineStage[] = ["accepted", "rejected", "ghosted", "withdrawn"]

export const ALL_STAGES = Object.keys(STAGE_CONFIG) as PipelineStage[]

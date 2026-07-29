import { useState, useEffect } from "react"
import { JobApplication, PipelineStage, ALL_STAGES, STAGE_CONFIG, Contact } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2 } from "lucide-react"

type JobFormData = Omit<JobApplication, "id" | "dateCreated" | "dateUpdated">

const emptyForm = (): JobFormData => ({
  company: "",
  role: "",
  location: "",
  remote: false,
  url: "",
  description: "",
  salary: { min: undefined, max: undefined, currency: "USD" },
  stage: "saved",
  dateApplied: "",
  dateFollowUp: "",
  contacts: [],
  notes: "",
})

interface JobModalProps {
  open: boolean
  job?: JobApplication | null
  defaultStage?: PipelineStage
  onSave: (data: JobFormData) => void
  onDelete?: (id: string) => void
  onClose: () => void
}

export function JobModal({ open, job, defaultStage, onSave, onDelete, onClose }: JobModalProps) {
  const [form, setForm] = useState<JobFormData>(emptyForm)

  useEffect(() => {
    if (open) {
      if (job) {
        setForm({
          company: job.company,
          role: job.role,
          location: job.location,
          remote: job.remote,
          url: job.url ?? "",
          description: job.description ?? "",
          salary: job.salary ?? { min: undefined, max: undefined, currency: "USD" },
          stage: job.stage,
          dateApplied: job.dateApplied ?? "",
          dateFollowUp: job.dateFollowUp ?? "",
          contacts: job.contacts,
          notes: job.notes,
        })
      } else {
        const f = emptyForm()
        if (defaultStage) f.stage = defaultStage
        setForm(f)
      }
    }
  }, [open, job, defaultStage])

  const set = <K extends keyof JobFormData>(key: K, value: JobFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const addContact = () =>
    setForm((prev) => ({
      ...prev,
      contacts: [...prev.contacts, { name: "", title: "", email: "", isReferral: false }],
    }))

  const updateContact = (i: number, field: keyof Contact, value: string | boolean) =>
    setForm((prev) => {
      const contacts = [...prev.contacts]
      contacts[i] = { ...contacts[i], [field]: value }
      return { ...prev, contacts }
    })

  const removeContact = (i: number) =>
    setForm((prev) => ({ ...prev, contacts: prev.contacts.filter((_, idx) => idx !== i) }))

  const handleSave = () => {
    if (!form.company.trim() || !form.role.trim()) return
    onSave(form)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{job ? "Edit Opportunity" : "Add Opportunity"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Core fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Company *</Label>
              <Input
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="Acme Corp"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Role *</Label>
              <Input
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                placeholder="Senior Engineer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Stage</Label>
              <Select value={form.stage} onValueChange={(v) => set("stage", v as PipelineStage)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_STAGES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STAGE_CONFIG[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remote"
              checked={form.remote}
              onChange={(e) => set("remote", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="remote">Remote</Label>
          </div>

          <div className="space-y-1.5">
            <Label>Job Posting URL</Label>
            <Input
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
              placeholder="https://..."
            />
          </div>

          <Separator />

          {/* Salary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label>Salary Min</Label>
              <Input
                type="number"
                value={form.salary?.min ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    salary: { ...prev.salary!, currency: prev.salary?.currency ?? "USD", min: e.target.value ? Number(e.target.value) : undefined },
                  }))
                }
                placeholder="120000"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Salary Max</Label>
              <Input
                type="number"
                value={form.salary?.max ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    salary: { ...prev.salary!, currency: prev.salary?.currency ?? "USD", max: e.target.value ? Number(e.target.value) : undefined },
                  }))
                }
                placeholder="160000"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Input
                value={form.salary?.currency ?? "USD"}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    salary: { ...prev.salary!, currency: e.target.value },
                  }))
                }
              />
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Date Applied</Label>
              <Input
                type="date"
                value={form.dateApplied}
                onChange={(e) => set("dateApplied", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Follow-up Date</Label>
              <Input
                type="date"
                value={form.dateFollowUp}
                onChange={(e) => set("dateFollowUp", e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Contacts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Contacts</Label>
              <Button variant="ghost" size="sm" onClick={addContact}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add
              </Button>
            </div>
            {form.contacts.map((c, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
                <div>
                  <Input
                    value={c.name}
                    onChange={(e) => updateContact(i, "name", e.target.value)}
                    placeholder="Name"
                  />
                </div>
                <div>
                  <Input
                    value={c.title ?? ""}
                    onChange={(e) => updateContact(i, "title", e.target.value)}
                    placeholder="Title"
                  />
                </div>
                <div>
                  <Input
                    value={c.email ?? ""}
                    onChange={(e) => updateContact(i, "email", e.target.value)}
                    placeholder="Email"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => removeContact(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Separator />

          {/* Description + Notes */}
          <div className="space-y-1.5">
            <Label>Job Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Paste job description or key details..."
              rows={3}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Your notes, interview prep, thoughts..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          {job && onDelete && (
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(job.id)
                onClose()
              }}
            >
              Delete
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!form.company.trim() || !form.role.trim()}>
            {job ? "Save Changes" : "Add Opportunity"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

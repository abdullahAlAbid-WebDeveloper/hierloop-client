export const WORKPLACE_TYPES = ["On-site", "Remote", "Hybrid"] as const
export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
] as const
export const EXPERIENCE_LEVELS = [
  "Entry level",
  "Junior",
  "Mid level",
  "Senior",
  "Lead",
] as const
export const JOB_CATEGORIES = [
  "Engineering",
  "Design",
  "Product",
  "Marketing",
  "Sales",
  "Customer Support",
  "Finance",
  "Operations",
  "Human Resources",
  "Other",
] as const
export const JOB_STATUSES = ["active", "expired"] as const

export type JobStatus = (typeof JOB_STATUSES)[number]

export type JobFormData = {
  title: string
  company: string
  location: string
  workplaceType: (typeof WORKPLACE_TYPES)[number]
  employmentType: (typeof EMPLOYMENT_TYPES)[number]
  experienceLevel: (typeof EXPERIENCE_LEVELS)[number]
  category: string
  status: JobStatus
  salaryMin: string
  salaryMax: string
  deadline: string
  description: string
  requirements: string
  skills: string
  contactEmail: string
}

export const EMPTY_JOB_FORM: JobFormData = {
  title: "",
  company: "",
  location: "",
  workplaceType: "On-site",
  employmentType: "Full-time",
  experienceLevel: "Mid level",
  category: "Engineering",
  status: "active",
  salaryMin: "",
  salaryMax: "",
  deadline: "",
  description: "",
  requirements: "",
  skills: "",
  contactEmail: "",
}

// Table rows carry the same flat shape the "Post a new job" form stores
// (JobFormData), plus the extra fields only the table needs.
export type JobRow = JobFormData & {
  _id: string
  applicants: number
  /** Relative post date, e.g. "Posted 4d ago". */
  posted: string
}

/**
 * Only fall back to "active" when a record has no status at all.
 * Any status the user (or an existing record) provided is kept.
 */
export const resolveJobStatus = (status?: string): JobStatus =>
  (status?.trim() || "active") as JobStatus

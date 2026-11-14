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

export type JobFormData = {
  title: string
  company: string
  location: string
  workplaceType: (typeof WORKPLACE_TYPES)[number]
  employmentType: (typeof EMPLOYMENT_TYPES)[number]
  experienceLevel: (typeof EXPERIENCE_LEVELS)[number]
  category: string
  salaryMin: string
  salaryMax: string
  deadline: string
  description: string
  requirements: string
  skills: string
  contactEmail: string
  /** Optional; the API stores "active" when this is not provided. */
  status?: string
}

export const EMPTY_JOB_FORM: JobFormData = {
  title: "",
  company: "",
  location: "",
  workplaceType: "On-site",
  employmentType: "Full-time",
  experienceLevel: "Mid level",
  category: "Engineering",
  salaryMin: "",
  salaryMax: "",
  deadline: "",
  description: "",
  requirements: "",
  skills: "",
  contactEmail: "",
}

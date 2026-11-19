/**
 * Applications are stored with a snapshot of the job and the applicant at the
 * moment they apply, so the seeker's "My Applications" page still renders
 * correctly even if the job post is edited or removed later.
 */

export const APPLICATION_STATUSES = [
  "applied",
  "in-review",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

/** Human-readable labels used by badges, filters and summaries. */
export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: "Applied",
  "in-review": "In Review",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
}

export type Application = {
  _id: string

  // Relationships
  jobId: string
  userId: string

  // Job snapshot
  jobTitle: string
  company: string
  companyLogo: string
  location: string
  workplaceType: string
  employmentType: string
  experienceLevel: string
  category: string
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string

  // Applicant snapshot
  applicantName: string
  applicantEmail: string
  resumeUrl: string | null
  coverLetter: string

  // Hiring contact
  recruiterId: string
  recruiterName: string
  recruiterEmail: string

  // Lifecycle
  status: ApplicationStatus
  /** ISO timestamp of when the application was submitted. */
  appliedAt: string
  /** ISO timestamp of the last status change. */
  updatedAt: string
}

/** The payload the client sends; the server adds `_id`, `status` and dates. */
export type ApplicationInput = Omit<
  Application,
  "_id" | "status" | "appliedAt" | "updatedAt"
>

/** Only fall back to "applied" when a record has no status at all. */
export const resolveApplicationStatus = (
  status?: string | null
): ApplicationStatus => {
  const value = status?.trim().toLowerCase().replace(/_/g, "-")

  return APPLICATION_STATUSES.includes(value as ApplicationStatus)
    ? (value as ApplicationStatus)
    : "applied"
}

import type { JobRow } from "@/lib/types/job"
import {
  resolveApplicationStatus,
  type Application,
  type ApplicationInput,
} from "@/lib/types/application"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

/**
 * Seekers can apply to this many jobs for free. The next attempt sends them
 * to the payment page so they can upgrade before applying again.
 */
export const FREE_APPLICATION_LIMIT = 10

type Applicant = {
  id: string
  name: string
  email: string
}

/**
 * Build the complete document we persist. Saving a snapshot of the job means
 * the seeker's applications list stays accurate even after the post changes.
 */
export const buildApplicationInput = (
  job: JobRow,
  applicant: Applicant
): ApplicationInput => {
  const salary = (value: string) => {
    const amount = Number(value)
    return Number.isFinite(amount) && amount > 0 ? amount : null
  }

  return {
    jobId: job._id,
    userId: applicant.id,

    jobTitle: job.title,
    company: job.company,
    companyLogo: "",
    location: job.location,
    workplaceType: job.workplaceType,
    employmentType: job.employmentType,
    experienceLevel: job.experienceLevel,
    category: job.category,
    salaryMin: salary(job.salaryMin),
    salaryMax: salary(job.salaryMax),
    salaryCurrency: "USD",

    applicantName: applicant.name,
    applicantEmail: applicant.email,
    resumeUrl: null,
    coverLetter: "",

    recruiterId: "",
    recruiterName: "",
    recruiterEmail: job.contactEmail || "",
  }
}

export const applyToAJob = async (data: ApplicationInput) => {
  const res = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(data),
    // Don't leave the button spinning forever if the API stops responding.
    signal: AbortSignal.timeout(15000),
  })

  if (!res.ok) {
    return res
      .json()
      .catch(() => ({ error: "Could not submit the application." }))
  }

  return res.json()
}

const asText = (value: unknown) =>
  typeof value === "string" ? value : value ? String(value) : ""

const asAmount = (value: unknown) => {
  if (value === null || value === undefined || value === "") return null
  const amount = Number(value)
  return Number.isFinite(amount) && amount >= 0 ? amount : null
}

/**
 * Older application documents may only have `jobId`, `userId` and `jobTitle`.
 * Fill in the missing fields so every card can render safely.
 */
const normalizeApplication = (raw: Record<string, unknown>): Application => ({
  _id: asText(raw._id),
  jobId: asText(raw.jobId),
  userId: asText(raw.userId),

  jobTitle: asText(raw.jobTitle),
  company: asText(raw.company),
  companyLogo: asText(raw.companyLogo),
  location: asText(raw.location),
  workplaceType: asText(raw.workplaceType),
  employmentType: asText(raw.employmentType),
  experienceLevel: asText(raw.experienceLevel),
  category: asText(raw.category),
  salaryMin: asAmount(raw.salaryMin),
  salaryMax: asAmount(raw.salaryMax),
  salaryCurrency: asText(raw.salaryCurrency) || "USD",

  applicantName: asText(raw.applicantName),
  applicantEmail: asText(raw.applicantEmail) || asText(raw.email),
  resumeUrl: asText(raw.resumeUrl) || null,
  coverLetter: asText(raw.coverLetter),

  recruiterId: asText(raw.recruiterId),
  recruiterName: asText(raw.recruiterName),
  recruiterEmail: asText(raw.recruiterEmail),

  status: resolveApplicationStatus(asText(raw.status)),
  appliedAt: asText(raw.appliedAt) || asText(raw.createdAt),
  updatedAt:
    asText(raw.updatedAt) || asText(raw.createdAt) || asText(raw.appliedAt),
})

/** Load the applications belonging to one seeker, newest first. */
export const getApplicationsByUser = async (
  userId: string
): Promise<Application[]> => {
  try {
    // Ask the API for this user's applications instead of downloading every
    // application in the database and filtering them in the browser.
    const res = await fetch(
      `${BASE_URL}/applications?userId=${encodeURIComponent(userId)}`,
      { cache: "no-store" }
    )

    if (!res.ok) return []

    const data: unknown = await res.json()

    if (!Array.isArray(data)) return []

    return data
      .filter(
        (item): item is Record<string, unknown> =>
          !!item &&
          typeof item === "object" &&
          (item as Record<string, unknown>).userId === userId
      )
      .map(normalizeApplication)
      .sort(
        (a, b) =>
          new Date(b.appliedAt || 0).getTime() -
          new Date(a.appliedAt || 0).getTime()
      )
  } catch {
    // A stopped API/network failure should show the empty state, not crash the
    // whole page.
    return []
  }
}

export const getApplicationCount = async (query = ""): Promise<number> => {
  try {
    const search = query ? `?${query}` : ""
    const res = await fetch(`${BASE_URL}/applications/count${search}`, {
      cache: "no-store",
    })

    if (!res.ok) return 0

    const data: unknown = await res.json()

    // The API responds with `{ count: number }`, not a bare number.
    return typeof (data as { count?: unknown })?.count === "number"
      ? (data as { count: number }).count
      : 0
  } catch {
    return 0
  }
}

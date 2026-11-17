import type { JobFormData, JobRow } from "@/lib/types/job"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const createJob = async (data: JobFormData) => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      status: data.status?.trim() || "active",
      salaryMin: data.salaryMin ? Number(data.salaryMin) : null,
      salaryMax: data.salaryMax ? Number(data.salaryMax) : null,
      skills: data.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      requirements: data.requirements
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    return { error: body?.error ?? "Could not publish the job." }
  }

  return res.json()
}

export const getJobById = async (
  jobId: string
): Promise<JobRow | undefined> => {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`)

  if (!res.ok) return undefined

  const job = await res.json()

  // The API returns null (or an empty body) for an unknown id.
  if (!job || !job._id) return undefined

  return job
}

export const deleteJob = async (jobId: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    return { error: body?.error ?? "Could not delete the job." }
  }

  return res.json()
}

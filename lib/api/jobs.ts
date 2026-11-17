import type { JobRow } from "@/lib/types/job"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const getJobs = async (query = ""): Promise<JobRow[]> => {
  const res = await fetch(`${BASE_URL}/jobs?${query}`)

  if (!res.ok) return []

  return res.json()
}

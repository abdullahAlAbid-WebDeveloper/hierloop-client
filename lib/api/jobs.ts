const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export const getJobs = async (query = "") => {
  const res = await fetch(`${BASE_URL}/jobs?${query}`)
  return res.json()
}

export const getJobById = async (id: string) => {
  const jobs = await getJobs()
  return jobs.find((job: { _id: string }) => job._id === id)
}

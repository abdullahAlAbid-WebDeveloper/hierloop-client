import type { JobFormData } from "@/lib/types/job"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

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

  return res.json()
}


export const deleteJob =async(jobId:string)=>{
  const res = await fetch(`${BASE_URL}/jobs/${jobId}`,{
    method:"DELETE"
  })
  return res.json();
}
import { auth } from "@/lib/auth"
import { getDb } from "@/lib/db"
import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  WORKPLACE_TYPES,
} from "@/lib/types/job"

const clean = (value: unknown) =>
  typeof value === "string" ? value.trim() : ""

function pickOption(
  value: unknown,
  options: readonly string[],
  fallback: string
) {
  const option = clean(value)
  return options.includes(option) ? option : fallback
}

function optionalNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null
  const number = Number(value)
  return Number.isFinite(number) && number >= 0 ? number : Number.NaN
}

function stringList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(clean).filter(Boolean)
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user) {
      return Response.json(
        { error: "Please sign in to post a job." },
        { status: 401 }
      )
    }

    const body = await request.json()

    const title = clean(body.title)
    const company = clean(body.company)
    const location = clean(body.location)
    const description = clean(body.description)

    if (!title || !company || !location || !description) {
      return Response.json(
        {
          error: "Job title, company, location and description are required.",
        },
        { status: 400 }
      )
    }

    const salaryMin = optionalNumber(body.salaryMin)
    const salaryMax = optionalNumber(body.salaryMax)

    if (Number.isNaN(salaryMin) || Number.isNaN(salaryMax)) {
      return Response.json(
        { error: "Salaries must be positive numbers." },
        { status: 400 }
      )
    }

    if (salaryMin !== null && salaryMax !== null && salaryMin > salaryMax) {
      return Response.json(
        {
          error: "The minimum salary cannot be higher than the maximum salary.",
        },
        { status: 400 }
      )
    }

    const deadline = clean(body.deadline)
      ? new Date(`${clean(body.deadline)}T23:59:59.999Z`)
      : null

    if (deadline && Number.isNaN(deadline.getTime())) {
      return Response.json(
        { error: "The application deadline is not a valid date." },
        { status: 400 }
      )
    }

    const now = new Date()
    const job = {
      title,
      company,
      location,
      workplaceType: pickOption(body.workplaceType, WORKPLACE_TYPES, "On-site"),
      employmentType: pickOption(
        body.employmentType,
        EMPLOYMENT_TYPES,
        "Full-time"
      ),
      experienceLevel: pickOption(
        body.experienceLevel,
        EXPERIENCE_LEVELS,
        "Mid level"
      ),
      category: clean(body.category) || "Other",
      salaryMin,
      salaryMax,
      salaryCurrency: "USD",
      deadline,
      description,
      requirements: stringList(body.requirements),
      skills: stringList(body.skills),
      contactEmail: clean(body.contactEmail) || session.user.email,
      recruiterId: session.user.id,
      recruiterName: session.user.name,
      recruiterEmail: session.user.email,
      status: "published",
      createdAt: now,
      updatedAt: now,
    }

    const db = await getDb()
    const result = await db.collection("jobs").insertOne(job)

    return Response.json(
      { ok: true, id: result.insertedId.toString() },
      { status: 201 }
    )
  } catch (error) {
    console.error("Failed to create job:", error)
    return Response.json(
      { error: "Could not publish the job. Please try again." },
      { status: 500 }
    )
  }
}

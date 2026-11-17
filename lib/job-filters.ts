import type { JobFormData, JobRow } from "@/lib/types/job"
import {
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  JOB_CATEGORIES,
  WORKPLACE_TYPES,
} from "@/lib/types/job"

/** Shape of the App Router `searchParams` object. */
export type SearchParams = Record<string, string | string[] | undefined>

/** The `JobFormData` fields the browse page is able to filter on. */
export type JobFilterKey = keyof Pick<
  JobFormData,
  "employmentType" | "workplaceType" | "experienceLevel" | "category"
>

export type JobFilterGroup = {
  key: JobFilterKey
  label: string
  options: readonly string[]
  /** Single-select groups keep at most one option active. */
  multiple: boolean
}

/** One entry per sidebar filter group, each backed by a `JobFormData` field. */
export const JOB_FILTER_GROUPS = [
  {
    key: "employmentType",
    label: "Job Type",
    options: EMPLOYMENT_TYPES,
    multiple: false,
  },
  {
    key: "workplaceType",
    label: "Workplace",
    options: WORKPLACE_TYPES,
    multiple: false,
  },
  {
    key: "experienceLevel",
    label: "Experience Level",
    options: EXPERIENCE_LEVELS,
    multiple: false,
  },
  {
    key: "category",
    label: "Category",
    options: JOB_CATEGORIES,
    multiple: true,
  },
] satisfies JobFilterGroup[]

export type JobFilters = Record<JobFilterKey, string[]>

const parseList = (value: string | string[] | undefined) => {
  const values = Array.isArray(value) ? value : [value ?? ""]

  return values
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean)
}

/**
 * Reads the active filters from the URL.
 * Accepts both repeated params (`?category=Design&category=Product`)
 * and comma separated values (`?category=Design,Product`).
 */
export const parseJobFilters = (params: SearchParams): JobFilters => {
  const filters = {} as JobFilters

  for (const group of JOB_FILTER_GROUPS) {
    const values = parseList(params[group.key])
    // Single-select groups only honour the first value, even if the URL
    // carries several (e.g. from a hand-edited link).
    filters[group.key] = group.multiple ? values : values.slice(0, 1)
  }

  return filters
}

/** Turns the active filters back into a query string for `getJobs`. */
export const toJobFilterQuery = (filters: JobFilters, search = "") => {
  const query = new URLSearchParams()

  if (search.trim()) query.set("search", search.trim())

  for (const group of JOB_FILTER_GROUPS) {
    const values = filters[group.key]
    if (values.length > 0) query.set(group.key, values.join(","))
  }

  return query.toString()
}

export type JobFilterCounts = Record<JobFilterKey, Record<string, number>>

/** Counts how many of the given jobs fall into each filter option. */
export const countJobFilters = (
  jobs: Pick<JobRow, JobFilterKey>[]
): JobFilterCounts => {
  const counts: JobFilterCounts = {
    employmentType: {},
    workplaceType: {},
    experienceLevel: {},
    category: {},
  }

  for (const job of jobs) {
    for (const group of JOB_FILTER_GROUPS) {
      const value = job[group.key]
      counts[group.key][value] = (counts[group.key][value] ?? 0) + 1
    }
  }

  return counts
}

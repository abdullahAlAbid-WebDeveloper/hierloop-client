"use client"

import {
  headingClass,
  metaTextClass,
} from "@/app/components/styles"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"

export const JOB_SORT_OPTIONS = ["Most Recent", "Highest Salary"] as const

export type JobSortOption = (typeof JOB_SORT_OPTIONS)[number]

type JobResultsHeaderProps = {
  /** Number of jobs matching the current search and filters. */
  count: number
  sort?: JobSortOption
}

export function JobResultsHeader({
  count,
  sort = "Most Recent",
}: JobResultsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 className={headingClass}>
        Found {count.toLocaleString()} {count === 1 ? "Job" : "Jobs"}
      </h2>

      <div className="flex items-center gap-3">
        <span className={metaTextClass}>Sort by:</span>

        <NativeSelect
          value={sort}
          aria-label="Sort jobs"
          onChange={() => {
            // TODO: write the selected option to the URL (`?sort=...`).
          }}
          className="[&_select]:h-9 [&_select]:w-[141px] [&_select]:rounded-lg [&_select]:border-white/10 [&_select]:bg-[#0c0c0f] [&_select]:px-3 [&_select]:text-[13px] [&_select]:font-medium [&_select]:text-[#ededef]"
        >
          {JOB_SORT_OPTIONS.map((option) => (
            <NativeSelectOption key={option} value={option}>
              {option}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </div>
    </div>
  )
}

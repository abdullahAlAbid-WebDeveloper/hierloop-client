"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { FilterCheckboxGroup } from "@/app/components/filter-checkbox-group"
import { headingClass, panelClass } from "@/app/components/styles"
import {
  JOB_FILTER_GROUPS,
  type JobFilterCounts,
  type JobFilterGroup,
  type JobFilters,
} from "@/lib/job-filters"
import { cn } from "@/lib/utils"

type JobFiltersSidebarProps = {
  /** Filters currently applied from the URL. */
  selected: JobFilters
  /** How many of the current results belong to each option. */
  counts?: JobFilterCounts
}

export function JobFiltersSidebar({
  selected,
  counts,
}: JobFiltersSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleToggle = (group: JobFilterGroup, option: string) => {
    const current = selected[group.key]
    const isActive = current.includes(option)

    let next: string[]

    if (group.multiple) {
      next = isActive
        ? current.filter((value) => value !== option)
        : [...current, option]
    } else {
      // Single-select: clicking the active option clears it, otherwise it
      // replaces whatever was selected before.
      next = isActive ? [] : [option]
    }

    const params = new URLSearchParams(searchParams.toString())

    if (next.length > 0) {
      params.set(group.key, next.join(","))
    } else {
      params.delete(group.key)
    }

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  return (
    <aside
      aria-label="Job filters"
      className={cn(panelClass, "flex h-fit flex-col gap-6 p-6")}
    >
      <h2 className={headingClass}>Filters</h2>

      {JOB_FILTER_GROUPS.map((group) => (
        <FilterCheckboxGroup
          key={group.key}
          title={group.label}
          options={group.options}
          selected={selected[group.key]}
          counts={counts?.[group.key]}
          onToggle={(option) => handleToggle(group, option)}
        />
      ))}
    </aside>
  )
}

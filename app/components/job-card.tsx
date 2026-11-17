import Link from "next/link"
import { Banknote, Bookmark, BriefcaseBusiness, MapPin } from "lucide-react"

import { panelClass, pillClass } from "@/app/components/styles"
import type { JobRow } from "@/lib/types/job"
import { cn } from "@/lib/utils"

type JobCardProps = {
  job: JobRow
}

const toThousands = (value?: string) => {
  const amount = Number(value)
  return Number.isFinite(amount) && amount > 0
    ? `$${Math.round(amount / 1000)}k`
    : ""
}

const salaryLabel = (job: JobRow) => {
  const min = toThousands(job.salaryMin)
  const max = toThousands(job.salaryMax)

  if (min && max) return `${min} - ${max}`
  if (min) return `From ${min}`
  if (max) return `Up to ${max}`
  return "Salary not specified"
}

/** A single listing in the browse jobs list. Opens the job details page. */
export function JobCard({ job }: JobCardProps) {
  return (
    <Link
      href={`/browse-jobs/${job._id}`}
      className={cn(
        panelClass,
        "flex gap-5 p-6 transition-colors hover:border-white/15"
      )}
    >
      <div className="flex size-16 shrink-0 items-center justify-center rounded-lg border border-white/[0.07] bg-[#222228]">
        <span className="text-xl font-semibold text-[#ededef]">
          {job.company.charAt(0) || "?"}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            <h3 className="truncate text-[22px] leading-7 font-semibold tracking-[-1.8px] text-[#ededef]">
              {job.title}
            </h3>
            <p className="truncate text-base leading-[27px] font-semibold text-[#6e6e78]">
              {job.company} • {job.location}
            </p>
          </div>

          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-[#8e9192]"
          >
            <Bookmark className="size-4" />
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className={pillClass}>
            <Banknote aria-hidden className="size-4 text-[#e5e2e3]" />
            {salaryLabel(job)}
          </span>
          <span className={pillClass}>
            <BriefcaseBusiness aria-hidden className="size-4 text-[#e5e2e3]" />
            {job.employmentType}
          </span>
          <span className={pillClass}>
            <MapPin aria-hidden className="size-4 text-[#e5e2e3]" />
            {job.workplaceType}
          </span>
        </div>
      </div>
    </Link>
  )
}

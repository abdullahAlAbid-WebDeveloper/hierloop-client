"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  Award,
  Banknote,
  BriefcaseBusiness,
  CalendarDays,
  CalendarCheck,
  Clock,
  Inbox,
  MapPin,
  Send,
  type LucideIcon,
} from "lucide-react"

import { ApplicationStatusBadge } from "@/app/components/ApplicationStatusBadge"
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  type Application,
  type ApplicationStatus,
} from "@/lib/types/application"
import { cn } from "@/lib/utils"

type FilterValue = "all" | ApplicationStatus

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  ...APPLICATION_STATUSES.map((status) => ({
    value: status,
    label: APPLICATION_STATUS_LABELS[status],
  })),
]

const pillClass =
  "inline-flex items-center gap-1.5 rounded-lg border bg-muted/50 px-2.5 py-1 text-xs text-foreground/80"

const formatDate = (value?: string | null) => {
  if (!value) return "—"

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return "—"

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const formatSalary = (application: Application) => {
  const format = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: application.salaryCurrency || "USD",
      maximumFractionDigits: 0,
    }).format(value)

  const { salaryMin, salaryMax } = application

  if (salaryMin !== null && salaryMax !== null) {
    return `${format(salaryMin)} – ${format(salaryMax)}`
  }

  if (salaryMin !== null) return `From ${format(salaryMin)}`
  if (salaryMax !== null) return `Up to ${format(salaryMax)}`

  return "Salary not listed"
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: number
}) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
        <Icon aria-hidden className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-2 font-jakarta text-2xl font-semibold tracking-tight">
        {value}
      </p>
    </div>
  )
}

function ApplicationCard({ application }: { application: Application }) {
  return (
    <article className="rounded-2xl border bg-card p-5 shadow-sm transition-colors hover:border-brand/30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span
            aria-hidden
            className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-lg font-semibold text-brand"
          >
            {application.company.charAt(0) || "?"}
          </span>

          <div className="flex min-w-0 flex-col gap-1.5">
            <h2 className="truncate font-jakarta text-lg leading-6 font-semibold tracking-tight">
              {application.jobTitle}
            </h2>
            <p className="truncate text-sm text-muted-foreground">
              {application.company} · {application.location}
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className={pillClass}>
                <Banknote aria-hidden className="size-3.5" />
                {formatSalary(application)}
              </span>
              <span className={pillClass}>
                <BriefcaseBusiness aria-hidden className="size-3.5" />
                {application.employmentType || "Not specified"}
              </span>
              <span className={pillClass}>
                <MapPin aria-hidden className="size-3.5" />
                {application.workplaceType || "Not specified"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-col sm:items-end">
          <ApplicationStatusBadge status={application.status} />

          <div className="flex items-center gap-1 sm:mt-1">
            <Link
              href={`/browse-jobs/${application.jobId}`}
              className="inline-flex h-7 items-center gap-1.5 rounded-lg px-2.5 text-[0.8rem] font-medium text-foreground transition-colors hover:bg-muted"
            >
              View job
              <ArrowUpRight aria-hidden className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CalendarDays aria-hidden className="size-3.5" />
          Applied {formatDate(application.appliedAt)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock aria-hidden className="size-3.5" />
          Updated {formatDate(application.updatedAt)}
        </span>
        <span className="flex items-center gap-1.5">
          <BriefcaseBusiness aria-hidden className="size-3.5" />
          {application.experienceLevel || "Experience not listed"}
        </span>
      </div>
    </article>
  )
}

type ApplicationsViewProps = {
  applications: Application[]
}

export function ApplicationsView({ applications }: ApplicationsViewProps) {
  const [filter, setFilter] = useState<FilterValue>("all")

  const counts = useMemo(() => {
    const next = { all: applications.length } as Record<FilterValue, number>

    for (const status of APPLICATION_STATUSES) {
      next[status] = applications.filter(
        (item) => item.status === status
      ).length
    }

    return next
  }, [applications])

  const visible =
    filter === "all"
      ? applications
      : applications.filter((item) => item.status === filter)

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Send} label="Total applied" value={counts.all} />
        <StatCard
          icon={CalendarCheck}
          label="In review"
          value={counts["in-review"]}
        />
        <StatCard
          icon={CalendarDays}
          label="Interviews"
          value={counts.interview}
        />
        <StatCard icon={Award} label="Offers" value={counts.offer} />
      </section>

      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5 border-b bg-muted/40 px-3 py-2.5">
          {FILTERS.map(({ value, label }) => {
            const active = filter === value

            return (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                aria-pressed={active}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {label}
                <span
                  className={cn(
                    "rounded-md px-1.5 text-xs tabular-nums",
                    active ? "bg-white/20" : "bg-muted text-muted-foreground"
                  )}
                >
                  {counts[value]}
                </span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-3 p-3 sm:p-4">
          {visible.length > 0 ? (
            visible.map((application) => (
              <ApplicationCard
                key={application._id}
                application={application}
              />
            ))
          ) : (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <Inbox aria-hidden className="size-5" />
              </span>
              <div className="flex max-w-sm flex-col gap-1">
                <p className="font-medium">
                  {applications.length === 0
                    ? "No applications yet"
                    : "Nothing in this stage"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {applications.length === 0
                    ? "Applications you submit will appear here so you can track their progress."
                    : "Try another filter to see the rest of your applications."}
                </p>
              </div>
              <Link
                href="/browse-jobs"
                className="text-sm font-medium text-brand underline-offset-4 hover:underline"
              >
                Browse open roles
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

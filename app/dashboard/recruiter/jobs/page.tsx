import Link from "next/link"
import { Eye, Pencil, Plus, Trash2, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { JobFormData } from "@/lib/types/job"
import { cn } from "@/lib/utils"

type JobStatus = "active" | "expired"

// Table rows carry the same flat shape the "Post a new job" form stores
// (JobFormData), plus the extra fields only the table needs.
export type JobRow = JobFormData & {
  _id: string
  applicants: number
  status: JobStatus
  /** Relative post date, e.g. "Posted 4d ago". */
  posted: string
}

// Dummy data so the table can be reviewed before it is wired to the API.
const dummyJobs: JobRow[] = [
  {
    _id: "job_001",
    title: "Senior Frontend Engineer",
    company: "HireLoop",
    location: "Dhaka, Bangladesh",
    workplaceType: "Remote",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    category: "Engineering",
    salaryMin: "90000",
    salaryMax: "120000",
    deadline: "2026-12-15",
    description:
      "Build and maintain the HireLoop web experience alongside a small product team.",
    requirements:
      "5+ years of experience with React\nStrong TypeScript skills\nExperience with design systems",
    skills: "React, TypeScript, Next.js, Tailwind CSS",
    contactEmail: "hiring@hireloop.com",
    applicants: 24,
    status: "active",
    posted: "Posted 2d ago",
  },
  {
    _id: "job_002",
    title: "Product Designer",
    company: "PixelCraft",
    location: "Berlin, Germany",
    workplaceType: "Hybrid",
    employmentType: "Full-time",
    experienceLevel: "Mid level",
    category: "Design",
    salaryMin: "65000",
    salaryMax: "85000",
    deadline: "2026-11-30",
    description:
      "Own end-to-end product design for our hiring tools, from research to polished UI.",
    requirements:
      "3+ years of product design experience\nStrong Figma skills\nA portfolio of shipped work",
    skills: "Figma, Prototyping, Design Systems",
    contactEmail: "design@pixelcraft.de",
    applicants: 12,
    status: "active",
    posted: "Posted 5d ago",
  },
  {
    _id: "job_003",
    title: "Backend Engineer (Node.js)",
    company: "CloudNest",
    location: "Remote",
    workplaceType: "Remote",
    employmentType: "Contract",
    experienceLevel: "Senior",
    category: "Engineering",
    salaryMin: "70000",
    salaryMax: "95000",
    deadline: "2026-10-20",
    description:
      "Design and ship APIs and background jobs for our recruiting platform.",
    requirements:
      "4+ years building Node.js services\nExperience with MongoDB\nComfortable with REST APIs",
    skills: "Node.js, MongoDB, Express, AWS",
    contactEmail: "jobs@cloudnest.io",
    applicants: 8,
    status: "expired",
    posted: "Posted 1mo ago",
  },
  {
    _id: "job_004",
    title: "Marketing Manager",
    company: "BrightLabs",
    location: "London, United Kingdom",
    workplaceType: "On-site",
    employmentType: "Part-time",
    experienceLevel: "Lead",
    category: "Marketing",
    salaryMin: "45000",
    salaryMax: "60000",
    deadline: "",
    description:
      "Plan and run campaigns that bring more companies and candidates to HireLoop.",
    requirements:
      "Experience owning multi-channel campaigns\nStrong writing skills",
    skills: "SEO, Content Marketing, Analytics",
    contactEmail: "careers@brightlabs.co.uk",
    applicants: 5,
    status: "active",
    posted: "Posted 1w ago",
  },
  {
    _id: "job_005",
    title: "Junior Data Analyst",
    company: "DataHive",
    location: "Toronto, Canada",
    workplaceType: "Hybrid",
    employmentType: "Internship",
    experienceLevel: "Junior",
    category: "Other",
    salaryMin: "30000",
    salaryMax: "40000",
    deadline: "2027-01-10",
    description:
      "Support the hiring analytics team with dashboards and reporting.",
    requirements:
      "Basic SQL knowledge\nComfortable with spreadsheets\nCurious and detail-oriented",
    skills: "SQL, Excel, Power BI",
    contactEmail: "interns@datahive.ca",
    applicants: 31,
    status: "active",
    posted: "Posted 3d ago",
  },
]

const formatMoney = (value: string) => {
  const amount = Number(value)
  return Number.isFinite(amount)
    ? `$${amount.toLocaleString("en-US")}`
    : `$${value}`
}

// "90000" / "120000" → "$90,000 – $120,000 / yr"
const formatCompensation = (job: JobRow) => {
  if (job.salaryMin && job.salaryMax) {
    return `${formatMoney(job.salaryMin)} – ${formatMoney(job.salaryMax)} / yr`
  }
  if (job.salaryMin) return `From ${formatMoney(job.salaryMin)} / yr`
  if (job.salaryMax) return `Up to ${formatMoney(job.salaryMax)} / yr`
  return "Not specified"
}

// "2026-12-15" → "Dec 15, 2026"
const formatDeadline = (deadline: string) => {
  if (!deadline) return "No deadline"

  const date = new Date(deadline)
  if (Number.isNaN(date.getTime())) return "No deadline"

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

// Responsive column visibility — shared by <th> and <td> so they always agree.
const columnVisibility = {
  company: "hidden md:table-cell",
  type: "hidden lg:table-cell",
  compensation: "hidden lg:table-cell",
  applicants: "hidden lg:table-cell",
  deadline: "hidden lg:table-cell",
} satisfies Record<string, string>

const headingClass =
  "px-3 py-3.5 text-xs font-medium tracking-wide text-muted-foreground uppercase"
const cellClass = "px-3 py-3.5"
const typePillClass =
  "inline-flex items-center whitespace-nowrap rounded-lg border bg-muted/50 px-2.5 py-0.5 text-xs text-foreground/80"

const statusStyles: Record<JobStatus, string> = {
  active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
  expired: "border-border bg-muted text-muted-foreground",
}

const iconButtonClass =
  "flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"

const ManageJobsPage = () => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Manage Jobs</span>
        <span aria-hidden className="text-muted-foreground/60">
          /
        </span>
        <span className="font-medium text-foreground">
          Job Listings &amp; Postings
        </span>
      </nav>

      {/* Page heading + primary action */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-jakarta text-2xl font-semibold tracking-tight sm:text-3xl">
            Manage Job Posts
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Review live listings, monitor applicants, and update job details
            across your organization.
          </p>
        </div>

        <Link
          href="/dashboard/recruiter/jobs/new"
          className={cn(
            buttonVariants(),
            "h-10 w-fit rounded-xl bg-brand px-5 font-manrope font-semibold text-white hover:bg-brand-soft"
          )}
        >
          <Plus className="size-4" />
          New Job Post
        </Link>
      </header>

      {/* Postings table — columns collapse away on smaller screens */}
      <section className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className={cn(headingClass, "px-5 lg:w-[22%]")}>
                Job title &amp; category
              </TableHead>
              <TableHead
                className={cn(headingClass, columnVisibility.company, "lg:w-[18%]")}
              >
                Company &amp; location
              </TableHead>
              <TableHead
                className={cn(headingClass, columnVisibility.type, "lg:w-[9%]")}
              >
                Type
              </TableHead>
              <TableHead
                className={cn(
                  headingClass,
                  columnVisibility.compensation,
                  "lg:w-[14%]"
                )}
              >
                Compensation
              </TableHead>
              <TableHead
                className={cn(
                  headingClass,
                  columnVisibility.applicants,
                  "lg:w-[12%]"
                )}
              >
                Applicants
              </TableHead>
              <TableHead className={cn(headingClass, "lg:w-[9%]")}>
                Status
              </TableHead>
              <TableHead
                className={cn(
                  headingClass,
                  columnVisibility.deadline,
                  "lg:w-[11%]"
                )}
              >
                Deadline
              </TableHead>
              <TableHead className={cn(headingClass, "px-5 lg:w-[11%]")}>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {dummyJobs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-16 text-center text-sm text-muted-foreground"
                >
                  No job posts yet. Create your first listing to get started.
                </TableCell>
              </TableRow>
            ) : (
              dummyJobs.map((job) => (
                <TableRow key={job._id}>
                  {/* Job title & category */}
                  <TableCell className={cn(cellClass, "px-5")}>
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden
                        className="hidden size-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-sm font-semibold text-brand sm:flex"
                      >
                        {job.title.charAt(0)}
                      </span>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-medium">{job.title}</span>
                        <span className="truncate text-xs text-muted-foreground">
                          {job.category} · {job.experienceLevel}
                        </span>
                        <span className="truncate text-xs text-muted-foreground md:hidden">
                          {job.location} · {job.workplaceType}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Company & location */}
                  <TableCell className={cn(cellClass, columnVisibility.company)}>
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate">{job.company}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {job.location} · {job.workplaceType}
                      </span>
                    </div>
                  </TableCell>

                  {/* Type */}
                  <TableCell className={cn(cellClass, columnVisibility.type)}>
                    <span className={typePillClass}>{job.employmentType}</span>
                  </TableCell>

                  {/* Compensation */}
                  <TableCell
                    className={cn(cellClass, columnVisibility.compensation)}
                  >
                    <span className="whitespace-nowrap text-foreground/80">
                      {formatCompensation(job)}
                    </span>
                  </TableCell>

                  {/* Applicants */}
                  <TableCell
                    className={cn(cellClass, columnVisibility.applicants)}
                  >
                    <span className="flex items-center gap-2 whitespace-nowrap text-foreground/80">
                      <Users aria-hidden className="size-4 text-muted-foreground" />
                      {job.applicants} candidates
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell className={cellClass}>
                    <Badge
                      variant="outline"
                      className={cn("capitalize", statusStyles[job.status])}
                    >
                      {job.status}
                    </Badge>
                  </TableCell>

                  {/* Deadline */}
                  <TableCell
                    className={cn(cellClass, columnVisibility.deadline)}
                  >
                    <div className="flex flex-col whitespace-nowrap">
                      <span>{formatDeadline(job.deadline)}</span>
                      <span className="text-xs text-muted-foreground">
                        {job.posted}
                      </span>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className={cn(cellClass, "px-5")}>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`View ${job.title}`}
                        className={iconButtonClass}
                      >
                        <Eye aria-hidden className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${job.title}`}
                        className={iconButtonClass}
                      >
                        <Pencil aria-hidden className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${job.title}`}
                        className={cn(
                          iconButtonClass,
                          "hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                        )}
                      >
                        <Trash2 aria-hidden className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}

export default ManageJobsPage

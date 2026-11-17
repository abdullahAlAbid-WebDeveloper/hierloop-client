import { notFound } from "next/navigation"
import {
  BarChart3,
  Banknote,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  Code2,
  KeyRound,
  Laptop,
  MapPin,
  ShieldCheck,
} from "lucide-react"

import { SaveJobButton } from "@/app/components/save-job-button"
import { headingClass, panelClass, pillClass } from "@/app/components/styles"
import { getJobById } from "@/lib/api/jobs"
import type { JobRow } from "@/lib/types/job"
import { cn } from "@/lib/utils"

const toAmount = (value: string) => {
  const amount = Number(value)
  return Number.isFinite(amount) && amount > 0 ? Math.round(amount / 1000) : 0
}

const salaryLabel = (job: JobRow) => {
  const min = toAmount(job.salaryMin)
  const max = toAmount(job.salaryMax)

  if (min && max) return `$${min}k – $${max}k`
  if (min) return `From $${min}k`
  if (max) return `Up to $${max}k`
  return "Not specified"
}

/** The API stores lists as arrays, but older jobs may have a string. */
const toList = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean)
  }

  if (typeof value === "string") {
    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

const BENEFITS = [
  { icon: ShieldCheck, label: "Full Health & Dental" },
  { icon: CircleDollarSign, label: "Competitive 401k" },
  { icon: Laptop, label: "Latest Hardware Stipend" },
  { icon: KeyRound, label: "Unlimited PTO" },
]

function MetaCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Banknote
  label: string
  value: string
}) {
  return (
    <div className={cn(panelClass, "flex flex-col gap-2 p-5 xl:p-6")}>
      <Icon aria-hidden className="size-5 text-[#a0a0ab]" />
      <p className="mt-1 text-[12px] font-medium tracking-[0.6px] text-[#6e6e78] uppercase">
        {label}
      </p>
      <p className="text-base font-semibold text-[#ededef] xl:text-[18px]">
        {value}
      </p>
    </div>
  )
}

const BrowseJobDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  const job: JobRow | undefined = await getJobById(id)

  if (!job) {
    notFound()
  }

  const responsibilities = toList(job.requirements)
  const skills = toList(job.skills)
  const applyHref = job.contactEmail
    ? `mailto:${job.contactEmail}?subject=${encodeURIComponent(
        `Application for ${job.title}`
      )}`
    : undefined

  return (
    <main className="min-h-svh bg-[#08080a] font-inter text-[#ededef]">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-[100px]">
        {/* Header */}
        <section
          className={cn(
            panelClass,
            "flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between lg:p-7"
          )}
        >
          <div className="flex items-center gap-6">
            <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl border border-white/[0.07] bg-[#222228] lg:size-24">
              <span className="text-3xl font-semibold text-[#ededef]">
                {job.company.charAt(0) || "?"}
              </span>
            </div>

            <div className="flex min-w-0 flex-col gap-2">
              <h1 className="text-[26px] leading-tight font-semibold tracking-[-1.5px] text-[#ededef] sm:text-[34px]">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-[18px] font-medium text-[#a0a0ab] sm:text-[22px]">
                <span>{job.company}</span>
                <span
                  aria-hidden
                  className="size-1 rounded-full bg-[#6e6e78]"
                />
                <span className="flex items-center gap-2 text-[13px] font-semibold text-[#22c55e] sm:text-sm">
                  <CheckCircle2 aria-hidden className="size-4" />
                  Verified Employer
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SaveJobButton />

            {applyHref ? (
              <a
                href={applyHref}
                className="inline-flex h-14 items-center justify-center rounded-xl bg-white px-6 text-base font-semibold text-[#0b0b0c] transition-colors hover:bg-white/90"
              >
                Apply Now
              </a>
            ) : (
              <span className="inline-flex h-14 items-center justify-center rounded-xl bg-white/50 px-6 text-base font-semibold text-[#0b0b0c]">
                Apply Now
              </span>
            )}
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_398px]">
          <div className="flex min-w-0 flex-col gap-6">
            {/* Meta cards */}
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              <MetaCard
                icon={Banknote}
                label="Salary Range"
                value={salaryLabel(job)}
              />
              <MetaCard icon={MapPin} label="Location" value={job.location} />
              <MetaCard
                icon={BriefcaseBusiness}
                label="Job Type"
                value={job.employmentType}
              />
              <MetaCard
                icon={BarChart3}
                label="Experience"
                value={job.experienceLevel}
              />
            </div>

            {/* Description and requirements */}
            <article className={cn(panelClass, "divide-y divide-white/[0.07]")}>
              <section className="p-6 lg:p-8">
                <h2 className={headingClass}>Job Description</h2>
                <p className="mt-5 text-[15px] leading-7 whitespace-pre-line text-[#a0a0ab]">
                  {job.description}
                </p>
              </section>

              {responsibilities.length > 0 ? (
                <section className="p-6 lg:p-8">
                  <h2 className={headingClass}>Responsibilities</h2>
                  <ul className="mt-5 flex list-disc flex-col gap-3 pl-5 text-[15px] leading-7 text-[#a0a0ab] marker:text-[#6e6e78]">
                    {responsibilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <section className="p-6 lg:p-8">
                <h2 className={headingClass}>Requirements</h2>

                {skills.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {skills.map((skill) => (
                      <span key={skill} className={pillClass}>
                        <Code2 aria-hidden className="size-4 text-[#a0a0ab]" />
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : null}

                <ul className="mt-5 flex list-disc flex-col gap-3 pl-5 text-[15px] leading-7 text-[#a0a0ab] marker:text-[#6e6e78]">
                  <li>
                    {job.experienceLevel} experience in {job.category}.
                  </li>
                  <li>
                    {job.workplaceType} role based in {job.location}.
                  </li>
                </ul>
              </section>

              <section className="p-6 lg:p-8">
                <h2 className={headingClass}>Benefits</h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  {BENEFITS.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-4">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#1a1a1f] text-[#ededef]">
                        <Icon aria-hidden className="size-5" />
                      </span>
                      <span className="text-[15px] font-semibold text-[#ededef]">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </article>
          </div>

          {/* Company overview */}
          <aside className={cn(panelClass, "h-fit p-6 lg:sticky lg:top-28")}>
            <h2 className="text-[22px] leading-7 font-semibold tracking-[-1.2px] text-[#ededef]">
              Company Overview
            </h2>

            <div className="mt-6 flex h-[200px] items-center justify-center rounded-xl border border-white/[0.07] bg-gradient-to-br from-[#1a1a1f] via-[#141418] to-[#0c0c0f]">
              <span className="text-5xl font-semibold text-white/20">
                {job.company.charAt(0) || "?"}
              </span>
            </div>

            <dl className="mt-2 divide-y divide-white/[0.07]">
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-[13px] font-medium text-[#6e6e78] uppercase">
                  Size
                </dt>
                <dd className="text-sm font-medium text-[#ededef]">
                  Not specified
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <dt className="text-[13px] font-medium text-[#6e6e78] uppercase">
                  Industry
                </dt>
                <dd className="text-sm font-medium text-[#ededef]">
                  {job.category}
                </dd>
              </div>
            </dl>

            {applyHref ? (
              <a
                href={applyHref}
                className="mt-4 flex h-12 w-full items-center justify-center rounded-lg border border-white/10 text-sm font-medium text-[#ededef] transition-colors hover:bg-white/5"
              >
                Contact Recruiter
              </a>
            ) : null}
          </aside>
        </div>
      </div>
    </main>
  )
}

export default BrowseJobDetailsPage

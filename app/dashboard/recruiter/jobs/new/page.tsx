"use client"

import Link from "next/link"
import { useState } from "react"
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  FileText,
  Loader2,
  Plus,
  Wallet,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FormSection } from "@/app/components/FormSection"
import { SelectField } from "@/app/components/SelectField"
import { controlClass } from "@/app/components/form-styles"
import { createJob } from "@/lib/actions/jobs"
import {
  EMPLOYMENT_TYPES,
  EMPTY_JOB_FORM,
  EXPERIENCE_LEVELS,
  JOB_CATEGORIES,
  JOB_STATUSES,
  WORKPLACE_TYPES,
  type JobFormData,
  type JobStatus,
} from "@/lib/types/job"
import { cn } from "@/lib/utils"
import { toast, Toast } from "@/components/ui/toast"

const NewJobsPage = () => {
  const [form, setForm] = useState<JobFormData>(EMPTY_JOB_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [createdJob, setCreatedJob] = useState<{
    id: string
    title: string
  } | null>(null)

  // One small helper keeps every field update simple: update("title", value)
  const update = <K extends keyof JobFormData>(
    key: K,
    value: JobFormData[K]
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError("")

    const salaryMin = form.salaryMin ? Number(form.salaryMin) : null
    const salaryMax = form.salaryMax ? Number(form.salaryMax) : null

    if (salaryMin !== null && salaryMax !== null && salaryMin > salaryMax) {
      setError("The minimum salary cannot be higher than the maximum salary.")
      return
    }

    setSubmitting(true)

    try {
      const data = await createJob(form)

      if (data.error) {
        setError(data.error)
        return
      }

      console.log(data)

      setCreatedJob({ id: data.insertedId ?? data.id, title: form.title })
      setForm(EMPTY_JOB_FORM)
    } catch {
      setError(
        "Something went wrong while publishing the job. Please try again."
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3">
        <Link
          href="/dashboard/recruiter/jobs"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Manage Jobs
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-jakarta text-2xl font-semibold tracking-tight sm:text-3xl">
            Post a new job
          </h1>
          <Badge variant="secondary" className="bg-brand/10 text-brand">
            Recruiter
          </Badge>
        </div>

        <p className="max-w-2xl text-sm text-muted-foreground">
          Add the essentials candidates need. You can always edit the listing
          later from Manage Jobs.
        </p>
      </div>

      {createdJob ? (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="size-7" />
            </span>

            <div className="space-y-1.5">
              <h2 className="font-jakarta text-xl font-semibold">
                Your job is live
              </h2>
              <p className="mx-auto max-w-md text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {createdJob.title}
                </span>{" "}
                has been posted. You can review it any time from Manage Jobs.
              </p>
            </div>

            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                onClick={() => setCreatedJob(null)}
                className="h-10 rounded-xl bg-brand px-5 font-manrope font-semibold text-white hover:bg-brand-soft"
              >
                <Plus className="size-4" />
                Post another job
              </Button>
              <Link
                href="/dashboard/recruiter/jobs"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-10 rounded-xl px-5 font-manrope font-medium"
                )}
              >
                Go to Manage Jobs
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
          <FormSection
            icon={Briefcase}
            title="Job details"
            description="The basics candidates see first."
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">
                  Job title <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(event) => update("title", event.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  required
                  className={controlClass}
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="company">
                    Company name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="company"
                    value={form.company}
                    onChange={(event) => update("company", event.target.value)}
                    placeholder="e.g. HireLoop"
                    required
                    className={controlClass}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="location">
                    Location <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(event) => update("location", event.target.value)}
                    placeholder="e.g. Dhaka, Bangladesh"
                    required
                    className={controlClass}
                  />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField
                  id="workplaceType"
                  label="Workplace"
                  value={form.workplaceType}
                  options={WORKPLACE_TYPES}
                  onChange={(value) =>
                    update(
                      "workplaceType",
                      value as JobFormData["workplaceType"]
                    )
                  }
                />

                <SelectField
                  id="employmentType"
                  label="Employment type"
                  value={form.employmentType}
                  options={EMPLOYMENT_TYPES}
                  onChange={(value) =>
                    update(
                      "employmentType",
                      value as JobFormData["employmentType"]
                    )
                  }
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField
                  id="experienceLevel"
                  label="Experience level"
                  value={form.experienceLevel}
                  options={EXPERIENCE_LEVELS}
                  onChange={(value) =>
                    update(
                      "experienceLevel",
                      value as JobFormData["experienceLevel"]
                    )
                  }
                />

                <SelectField
                  id="category"
                  label="Category"
                  value={form.category}
                  options={JOB_CATEGORIES}
                  onChange={(value) => update("category", value)}
                />
              </div>

              <SelectField
                id="status"
                label="Status"
                value={form.status}
                options={JOB_STATUSES}
                onChange={(value) => update("status", value as JobStatus)}
                description="Set to active while the role is open, or expired once it is filled or closed."
              />
            </FieldGroup>
          </FormSection>

          <FormSection
            icon={Wallet}
            title="Salary & deadline"
            description="Optional, but it helps attract the right people."
          >
            <FieldGroup>
              <div className="grid gap-5 sm:grid-cols-3">
                <Field>
                  <FieldLabel htmlFor="salaryMin">Minimum salary</FieldLabel>
                  <Input
                    id="salaryMin"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={form.salaryMin}
                    onChange={(event) =>
                      update("salaryMin", event.target.value)
                    }
                    placeholder="e.g. 50000"
                    className={controlClass}
                  />
                  <FieldDescription>Annual, in USD.</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="salaryMax">Maximum salary</FieldLabel>
                  <Input
                    id="salaryMax"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    value={form.salaryMax}
                    onChange={(event) =>
                      update("salaryMax", event.target.value)
                    }
                    placeholder="e.g. 80000"
                    className={controlClass}
                  />
                  <FieldDescription>Annual, in USD.</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="deadline">
                    Application deadline
                  </FieldLabel>
                  <Input
                    id="deadline"
                    type="date"
                    value={form.deadline}
                    onChange={(event) => update("deadline", event.target.value)}
                    className={controlClass}
                  />
                  <FieldDescription>
                    Leave empty for no deadline.
                  </FieldDescription>
                </Field>
              </div>
            </FieldGroup>
          </FormSection>

          <FormSection
            icon={FileText}
            title="Description"
            description="Tell candidates what the role is about."
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="description">
                  Job description <span className="text-destructive">*</span>
                </FieldLabel>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(event) =>
                    update("description", event.target.value)
                  }
                  placeholder="Describe the role, the team, and what a typical day looks like."
                  required
                  className="min-h-40 rounded-xl"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="requirements">Requirements</FieldLabel>
                <Textarea
                  id="requirements"
                  value={form.requirements}
                  onChange={(event) =>
                    update("requirements", event.target.value)
                  }
                  placeholder={
                    "3+ years of experience with React\nStrong understanding of TypeScript"
                  }
                  className="min-h-28 rounded-xl"
                />
                <FieldDescription>
                  Put each requirement on a new line.
                </FieldDescription>
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="skills">Skills</FieldLabel>
                  <Input
                    id="skills"
                    value={form.skills}
                    onChange={(event) => update("skills", event.target.value)}
                    placeholder="React, TypeScript, Node.js"
                    className={controlClass}
                  />
                  <FieldDescription>
                    Separate skills with commas.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="contactEmail">Contact email</FieldLabel>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={form.contactEmail}
                    onChange={(event) =>
                      update("contactEmail", event.target.value)
                    }
                    placeholder="hiring@company.com"
                    className={controlClass}
                  />
                  <FieldDescription>
                    Where candidates can reach you.
                  </FieldDescription>
                </Field>
              </div>
            </FieldGroup>
          </FormSection>

          {error ? (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/dashboard/recruiter/jobs"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-10 rounded-xl px-5 font-manrope font-medium"
              )}
            >
              Cancel
            </Link>

            <Button
              type="submit"
              disabled={submitting}
              className="h-11 rounded-xl bg-brand px-6 font-manrope font-semibold text-white hover:bg-brand-soft disabled:opacity-70"
            >
              {submitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              {submitting ? "Publishing..." : "Publish job"}
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default NewJobsPage

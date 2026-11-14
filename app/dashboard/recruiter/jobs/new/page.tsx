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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { createJob } from "@/lib/actions/jobs"
import {
  EMPLOYMENT_TYPES,
  EMPTY_JOB_FORM,
  EXPERIENCE_LEVELS,
  JOB_CATEGORIES,
  WORKPLACE_TYPES,
  type JobFormData,
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

      console.log(data);
      
    

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
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Briefcase className="size-4" />
                </span>
                <div className="space-y-0.5">
                  <CardTitle>Job details</CardTitle>
                  <CardDescription>
                    The basics candidates see first.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                    className="h-10 rounded-xl"
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
                      onChange={(event) =>
                        update("company", event.target.value)
                      }
                      placeholder="e.g. HireLoop"
                      required
                      className="h-10 rounded-xl"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="location">
                      Location <span className="text-destructive">*</span>
                    </FieldLabel>
                    <Input
                      id="location"
                      value={form.location}
                      onChange={(event) =>
                        update("location", event.target.value)
                      }
                      placeholder="e.g. Dhaka, Bangladesh"
                      required
                      className="h-10 rounded-xl"
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="workplaceType">Workplace</FieldLabel>
                    <NativeSelect
                      id="workplaceType"
                      value={form.workplaceType}
                      onChange={(event) =>
                        update(
                          "workplaceType",
                          event.target.value as JobFormData["workplaceType"]
                        )
                      }
                      className="w-full [&_select]:h-10 [&_select]:rounded-xl"
                    >
                      {WORKPLACE_TYPES.map((type) => (
                        <NativeSelectOption key={type} value={type}>
                          {type}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="employmentType">
                      Employment type
                    </FieldLabel>
                    <NativeSelect
                      id="employmentType"
                      value={form.employmentType}
                      onChange={(event) =>
                        update(
                          "employmentType",
                          event.target.value as JobFormData["employmentType"]
                        )
                      }
                      className="w-full [&_select]:h-10 [&_select]:rounded-xl"
                    >
                      {EMPLOYMENT_TYPES.map((type) => (
                        <NativeSelectOption key={type} value={type}>
                          {type}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="experienceLevel">
                      Experience level
                    </FieldLabel>
                    <NativeSelect
                      id="experienceLevel"
                      value={form.experienceLevel}
                      onChange={(event) =>
                        update(
                          "experienceLevel",
                          event.target.value as JobFormData["experienceLevel"]
                        )
                      }
                      className="w-full [&_select]:h-10 [&_select]:rounded-xl"
                    >
                      {EXPERIENCE_LEVELS.map((level) => (
                        <NativeSelectOption key={level} value={level}>
                          {level}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="category">Category</FieldLabel>
                    <NativeSelect
                      id="category"
                      value={form.category}
                      onChange={(event) =>
                        update("category", event.target.value)
                      }
                      className="w-full [&_select]:h-10 [&_select]:rounded-xl"
                    >
                      {JOB_CATEGORIES.map((category) => (
                        <NativeSelectOption key={category} value={category}>
                          {category}
                        </NativeSelectOption>
                      ))}
                    </NativeSelect>
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Wallet className="size-4" />
                </span>
                <div className="space-y-0.5">
                  <CardTitle>Salary & deadline</CardTitle>
                  <CardDescription>
                    Optional, but it helps attract the right people.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                      className="h-10 rounded-xl"
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
                      className="h-10 rounded-xl"
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
                      onChange={(event) =>
                        update("deadline", event.target.value)
                      }
                      className="h-10 rounded-xl"
                    />
                    <FieldDescription>
                      Leave empty for no deadline.
                    </FieldDescription>
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <FileText className="size-4" />
                </span>
                <div className="space-y-0.5">
                  <CardTitle>Description</CardTitle>
                  <CardDescription>
                    Tell candidates what the role is about.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                      className="h-10 rounded-xl"
                    />
                    <FieldDescription>
                      Separate skills with commas.
                    </FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="contactEmail">
                      Contact email
                    </FieldLabel>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={form.contactEmail}
                      onChange={(event) =>
                        update("contactEmail", event.target.value)
                      }
                      placeholder="hiring@company.com"
                      className="h-10 rounded-xl"
                    />
                    <FieldDescription>
                      Where candidates can reach you.
                    </FieldDescription>
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

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

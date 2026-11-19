"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { toast } from "@/components/ui/toast"
import { useSession } from "@/lib/auth-client"
import {
  applyToAJob,
  buildApplicationInput,
  FREE_APPLICATION_LIMIT,
  getApplicationsByUser,
} from "@/lib/actions/applications"
import type { JobRow } from "@/lib/types/job"

type ApplyJobButtonProps = {
  job: JobRow
}

/** Primary call-to-action on the job details page. */
export function ApplyJobButton({ job }: ApplyJobButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isApplying, setIsApplying] = useState(false)

  const handleApplyNow = async () => {
    // Ask the visitor to sign in first, then bring them back to this job.
    if (!session?.user) {
      const redirectTo = `/browse-jobs/${job._id}`
      router.push(`/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`)
      return
    }

    if (session.user.role !== "seeker") {
      toast.add({
        type: "error",
        title: "Only job seekers can apply",
        description:
          "Sign in with a job seeker account to apply for this role.",
      })
      return
    }

    setIsApplying(true)

    try {
      const applications = await getApplicationsByUser(session.user.id)

      // More than the free limit? Payment page e pathiye dao.
      if (applications.length >= FREE_APPLICATION_LIMIT) {
        router.push("/payment")
        return
      }

      const res = await applyToAJob(
        buildApplicationInput(job, {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
        })
      )

      if (res?.error) {
        toast.add({
          type: "error",
          title: "Could not submit application",
          description: res.error,
        })
        return
      }

      toast.add({
        type: "success",
        title: "Application submitted",
        description: `Your application for ${job.title} was sent to ${job.company}.`,
      })

      // The new application is now in the seeker's list.
      router.push("/dashboard/seeker/applications")
      router.refresh()
    } catch (error) {
      console.error("Could not submit application:", error)
      toast.add({
        type: "error",
        title: "Could not submit application",
        description: "Please try again.",
      })
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleApplyNow}
      disabled={isApplying}
      className="inline-flex h-14 items-center justify-center rounded-xl bg-white px-6 text-base font-semibold text-[#0b0b0c] transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isApplying ? "Applying…" : "Apply Now"}
    </button>
  )
}

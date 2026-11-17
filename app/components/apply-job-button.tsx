"use client"

import { useRouter } from "next/navigation"

import { useSession } from "@/lib/auth-client"
import type { JobRow } from "@/lib/types/job"
import { applyToAJob } from "@/lib/actions/applications"

type ApplyJobButtonProps = {
  job: JobRow
}

/** Primary call-to-action on the job details page. */
export function ApplyJobButton({ job }: ApplyJobButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()

  const handleApplyNow = async() => {
    // Ask the visitor to sign in first, then bring them back to this job.
    if (!session?.user) {
      const redirectTo = `/browse-jobs/${job._id}`
      router.push(`/sign-in?redirectTo=${encodeURIComponent(redirectTo)}`)
      return
    } else if (session.user.role === "seeker") {
      const application = {
        jobId: job._id,
        userId: session.user.id,
        email: session.user.email,
        jobTitle: job.title,
      }

      try {
        const res = await applyToAJob(application)

        if (res.insertedId) {
          router.push("/browse-jobs")
        } else {
          console.error("Could not submit application:", res.error)
        }
      } catch (error) {
        console.error("Could not submit application:", error)
      }
    } else {
      console.log("user is not job seeker")
    }
  }

  return (
    <button
      type="button"
      onClick={handleApplyNow}
      className="inline-flex h-14 items-center justify-center rounded-xl bg-white px-6 text-base font-semibold text-[#0b0b0c] transition-colors hover:bg-white/90"
    >
      Apply Now
    </button>
  )
}

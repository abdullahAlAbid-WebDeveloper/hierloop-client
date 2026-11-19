import Link from "next/link"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Plus } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { getApplicationsByUser } from "@/lib/actions/applications"
import { auth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { ApplicationsView } from "./applications-view"

const MyApplicationsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect(
      `/sign-in?redirectTo=${encodeURIComponent("/dashboard/seeker/applications")}`
    )
  }

  // This page only belongs to seekers; send other roles to their own dashboard.
  if (session.user.role !== "seeker") {
    redirect(`/dashboard/${session.user.role}`)
  }

  // Only applications submitted by this seeker are shown.
  const applications = await getApplicationsByUser(session.user.id)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Applications</span>
        <span aria-hidden className="text-muted-foreground/60">
          /
        </span>
        <span className="font-medium text-foreground">My Applications</span>
      </nav>

      {/* Page heading + primary action */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-jakarta text-2xl font-semibold tracking-tight sm:text-3xl">
            My Applications
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Keep track of every role you have applied to and follow each
            application from submission to offer.
          </p>
        </div>

        <Link
          href="/browse-jobs"
          className={cn(
            buttonVariants(),
            "h-10 w-fit rounded-xl bg-brand px-5 font-manrope font-semibold text-white hover:bg-brand-soft"
          )}
        >
          <Plus className="size-4" />
          Find more jobs
        </Link>
      </header>

      <ApplicationsView applications={applications} />
    </div>
  )
}

export default MyApplicationsPage

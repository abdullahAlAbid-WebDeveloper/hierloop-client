import { JobCard } from "@/app/components/job-card"
import { JobFiltersSidebar } from "@/app/components/job-filters-sidebar"
import { JobPagination } from "@/app/components/job-pagination"
import { JobResultsHeader } from "@/app/components/job-results-header"
import { JobSearchBar } from "@/app/components/job-search-bar"
import { panelClass } from "@/app/components/styles"
import { getJobs } from "@/lib/api/jobs"
import {
  JOB_FILTER_GROUPS,
  countJobFilters,
  parseJobFilters,
  type SearchParams,
} from "@/lib/job-filters"
import type { JobRow } from "@/lib/types/job"
import { cn } from "@/lib/utils"

const BrowseJobsPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) => {
  const params = await searchParams
  const filters = parseJobFilters(params)
  const search = typeof params.search === "string" ? params.search : ""

  // Send only the keyword to the API.
  const query = new URLSearchParams()
  if (search.trim()) {
    query.set("search", search.trim())
  }

  const allJobs: JobRow[] = await getJobs(query.toString())

  // Then filter the jobs here using the values selected in the URL.
  const jobs = allJobs.filter((job) => {
    for (const group of JOB_FILTER_GROUPS) {
      const selected = filters[group.key]

      if (selected.length > 0 && !selected.includes(job[group.key])) {
        return false
      }
    }

    return true
  })

  return (
    <main className="min-h-svh bg-[#08080a] font-inter text-[#ededef]">
      <h1 className="sr-only">Browse Jobs</h1>

      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-20">
        <JobSearchBar defaultValue={search} />

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[296px_minmax(0,1fr)]">
          <JobFiltersSidebar
            selected={filters}
            counts={countJobFilters(allJobs)}
          />

          <section className="flex min-w-0 flex-col gap-6">
            <JobResultsHeader count={jobs.length} />

            {jobs.length > 0 ? (
              <div className="flex flex-col gap-3">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <p
                className={cn(
                  panelClass,
                  "px-6 py-16 text-center text-sm text-[#6e6e78]"
                )}
              >
                No jobs match your search yet. Try a different keyword or
                filter.
              </p>
            )}

            {jobs.length > 0 ? <JobPagination /> : null}
          </section>
        </div>
      </div>
    </main>
  )
}

export default BrowseJobsPage

"use client"

import type { FormEvent } from "react"
import { Search } from "lucide-react"

import { panelClass } from "@/app/components/styles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"

type JobSearchBarProps = {
  /** Keyword currently applied from the URL. */
  defaultValue?: string
}

export function JobSearchBar({ defaultValue = "" }: JobSearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const search = String(formData.get("search") ?? "").trim()

    // Start with the URL's current filters so they are not lost.
    const params = new URLSearchParams(searchParams.toString())

    if (search) {
      params.set("search", search)
    } else {
      params.delete("search")
    }

    const query = params.toString()
    router.push(query ? `/browse-jobs?${query}` : "/browse-jobs")
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        panelClass,
        "flex flex-col gap-6 p-6 sm:flex-row sm:items-center"
      )}
    >
      <div className="relative flex-1">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-4 size-[18px] -translate-y-1/2 text-[#8e9192]"
        />
        <Input
          type="search"
          name="search"
          defaultValue={defaultValue}
          placeholder="Search by job title, keywords..."
          aria-label="Search jobs by title or keyword"
          className="h-[58px] rounded-lg border-white/[0.07] bg-[#1a1a1f] pl-[43px] text-[13px] leading-5 tracking-[-0.5px] text-[#ededef] placeholder:text-[#a0a0ab] focus-visible:border-white/20 focus-visible:ring-0"
        />
      </div>

      <Button
        type="submit"
        className="h-[59px] rounded-lg bg-white px-6 text-base leading-[27px] font-semibold text-[#2f3131] hover:bg-white/90"
      >
        Search Jobs
      </Button>
    </form>
  )
}

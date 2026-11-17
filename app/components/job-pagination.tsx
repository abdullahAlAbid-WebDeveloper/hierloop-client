"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

type JobPaginationProps = {
  page?: number
  totalPages?: number
}

const itemClass =
  "flex size-8 items-center justify-center rounded-lg border border-white/[0.08] text-[13px] leading-5 text-[#a0a0ab] transition-colors"

export function JobPagination({
  page = 1,
  totalPages = 12,
}: JobPaginationProps) {
  const goToPage = (target: number) => {
    // TODO: navigate to the requested page (URL param or client state).
    void target
  }

  // First three pages, an ellipsis, then the last page — as in the design.
  const pages = [1, 2, 3]

  return (
    <nav
      aria-label="Job results pages"
      className="flex items-center justify-center gap-1.5 py-6"
    >
      <button
        type="button"
        aria-label="Previous page"
        onClick={() => goToPage(page - 1)}
        className={cn(itemClass, "hover:bg-white/5 hover:text-[#ededef]")}
      >
        <ChevronLeft aria-hidden className="size-3.5 text-[#c4c7c8]" />
      </button>

      {pages.map((value) => (
        <button
          key={value}
          type="button"
          aria-label={`Page ${value}`}
          aria-current={value === page ? "page" : undefined}
          onClick={() => goToPage(value)}
          className={cn(
            itemClass,
            "hover:bg-white/5 hover:text-[#ededef]",
            value === page &&
              "border-transparent bg-white font-medium text-[#0b0b0c] hover:bg-white hover:text-[#0b0b0c]"
          )}
        >
          {value}
        </button>
      ))}

      <span className="flex size-8 items-center justify-center text-[13px] leading-5 text-[#a0a0ab]">
        …
      </span>

      <button
        type="button"
        aria-label={`Page ${totalPages}`}
        onClick={() => goToPage(totalPages)}
        className={cn(itemClass, "hover:bg-white/5 hover:text-[#ededef]")}
      >
        {totalPages}
      </button>

      <button
        type="button"
        aria-label="Next page"
        onClick={() => goToPage(page + 1)}
        className={cn(itemClass, "hover:bg-white/5 hover:text-[#ededef]")}
      >
        <ChevronRight aria-hidden className="size-3.5 text-[#c4c7c8]" />
      </button>
    </nav>
  )
}

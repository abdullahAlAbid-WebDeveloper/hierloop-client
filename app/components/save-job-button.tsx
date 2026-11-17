"use client"

import { useState } from "react"
import { Bookmark } from "lucide-react"

import { cn } from "@/lib/utils"

/** Bookmark toggle shown next to the Apply Now button. */
export function SaveJobButton() {
  const [saved, setSaved] = useState(false)

  return (
    <button
      type="button"
      aria-label={saved ? "Remove from saved jobs" : "Save job"}
      aria-pressed={saved}
      onClick={() => setSaved(!saved)}
      className={cn(
        "flex size-14 items-center justify-center rounded-xl border border-white/10 text-[#a0a0ab] transition-colors hover:bg-white/5 hover:text-[#ededef]",
        saved && "border-white/20 bg-white/5 text-white"
      )}
    >
      <Bookmark className={cn("size-5", saved && "fill-white")} />
    </button>
  )
}

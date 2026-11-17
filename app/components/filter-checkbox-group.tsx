"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

type FilterCheckboxGroupProps = {
  title: string
  options: readonly string[]
  /** Options that are currently active. */
  selected: readonly string[]
  /** Optional job count per option, shown on the right like the design. */
  counts?: Record<string, number>
  onToggle: (option: string) => void
  className?: string
}

/**
 * A titled list of checkboxes — the sidebar's building block.
 * Purely presentational: it reports toggles and renders whatever is selected.
 */
export function FilterCheckboxGroup({
  title,
  options,
  selected,
  counts,
  onToggle,
  className,
}: FilterCheckboxGroupProps) {
  return (
    <section className={cn("flex flex-col gap-6", className)}>
      <h3 className="text-base leading-[27px] font-semibold text-[#ededef]">
        {title}
      </h3>

      <ul className="flex flex-col gap-1">
        {options.map((option) => {
          const count = counts?.[option]

          return (
            <li key={option}>
              <label className="flex cursor-pointer items-center gap-3 py-1 text-[13px] leading-5 font-medium tracking-[-0.5px] text-[#a0a0ab] transition-colors hover:text-[#ededef]">
                <Checkbox
                  checked={selected.includes(option)}
                  onCheckedChange={() => onToggle(option)}
                  className="size-5 rounded-[4px] border-white/[0.07] bg-[#1a1a1f] data-checked:border-white data-checked:bg-white data-checked:text-[#0b0b0c]"
                />
                <span>{option}</span>
                {count ? (
                  <span className="ml-auto text-xs leading-5 text-[#6e6e78]">
                    {count.toLocaleString()}
                  </span>
                ) : null}
              </label>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

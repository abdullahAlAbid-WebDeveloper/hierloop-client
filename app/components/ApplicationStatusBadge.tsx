import { Badge } from "@/components/ui/badge"
import {
  APPLICATION_STATUS_LABELS,
  resolveApplicationStatus,
  type ApplicationStatus,
} from "@/lib/types/application"
import { cn } from "@/lib/utils"

const statusStyles: Record<ApplicationStatus, string> = {
  applied: "border-sky-500/30 bg-sky-500/10 text-sky-700",
  "in-review": "border-amber-500/30 bg-amber-500/10 text-amber-700",
  interview: "border-violet-500/30 bg-violet-500/10 text-violet-700",
  offer: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
  rejected: "border-rose-500/30 bg-rose-500/10 text-rose-700",
  withdrawn: "border-border bg-muted text-muted-foreground",
}

type ApplicationStatusBadgeProps = {
  status?: string | null
  className?: string
}

export function ApplicationStatusBadge({
  status,
  className,
}: ApplicationStatusBadgeProps) {
  const value = resolveApplicationStatus(status)

  return (
    <Badge
      variant="outline"
      className={cn("h-6 px-2.5", statusStyles[value], className)}
    >
      {APPLICATION_STATUS_LABELS[value]}
    </Badge>
  )
}

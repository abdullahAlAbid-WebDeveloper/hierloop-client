import { Badge } from "@/components/ui/badge"
import { resolveJobStatus, type JobStatus } from "@/lib/types/job"
import { cn } from "@/lib/utils"

const statusStyles: Record<JobStatus, string> = {
  active: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
  expired: "border-border bg-muted text-muted-foreground",
}

const fallbackStatusStyle = "border-border bg-muted text-muted-foreground"

type JobStatusBadgeProps = {
  status?: string | null
  className?: string
}

export function JobStatusBadge({ status, className }: JobStatusBadgeProps) {
  const value = resolveJobStatus(status ?? undefined)

  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        statusStyles[value] ?? fallbackStatusStyle,
        className
      )}
    >
      {value}
    </Badge>
  )
}

import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  viewAllHref?: string
  viewAllLabel?: string
}

export default function SectionHeader({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "Xem tất cả",
}: SectionHeaderProps) {
  return (
    <div className="mb-10 flex items-end justify-between">
      <div>
        {/* Title */}
        <h2 className="text-foreground text-2xl font-black tracking-tight md:text-3xl">{title}</h2>

        {subtitle && <p className="text-muted-foreground mt-2 max-w-md text-sm">{subtitle}</p>}

        {/* Gradient accent underline */}
        <div className="from-primary mt-3 h-1 w-14 rounded-full bg-linear-to-r to-transparent" />
      </div>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="group border-border/60 bg-muted/50 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-all"
        >
          {viewAllLabel}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}

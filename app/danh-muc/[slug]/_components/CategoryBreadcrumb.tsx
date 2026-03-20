import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface CategoryBreadcrumbProps {
  categoryName: string
}

export default function CategoryBreadcrumb({ categoryName }: CategoryBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="text-muted-foreground flex items-center gap-1.5 text-sm">
        <li>
          <Link href="/" className="hover:text-foreground transition-colors">
            Trang chủ
          </Link>
        </li>
        <li>
          <ChevronRight className="size-3.5" />
        </li>
        <li>
          <span className="text-foreground font-medium">{categoryName}</span>
        </li>
      </ol>
    </nav>
  )
}

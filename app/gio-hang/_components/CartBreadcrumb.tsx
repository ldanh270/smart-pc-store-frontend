import { ChevronRight } from "lucide-react"
import Link from "next/link"

export default function CartBreadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="text-muted-foreground flex items-center gap-1 text-sm">
        <li>
          <Link href="/" className="hover:text-foreground transition-colors">
            Trang chủ
          </Link>
        </li>
        <li>
          <ChevronRight className="size-3.5" />
        </li>
        <li className="text-foreground font-medium">Giỏ hàng</li>
      </ol>
    </nav>
  )
}

import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"

interface ProductBreadcrumbProps {
  productName: string
}

export default function ProductBreadcrumb({ productName }: ProductBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-muted-foreground mb-6 flex items-center gap-1.5 text-sm"
    >
      <Link href="/" className="hover:text-primary flex items-center gap-1 transition-colors">
        <Home className="h-3.5 w-3.5" />
        Trang Chủ
      </Link>

      <ChevronRight className="h-3.5 w-3.5" />

      <Link href="/san-pham" className="hover:text-primary transition-colors">
        Sản Phẩm
      </Link>

      <ChevronRight className="h-3.5 w-3.5" />

      <span className="text-foreground truncate font-medium">{productName}</span>
    </nav>
  )
}

import type { CategoryDetail } from "@/types/category"

import { Package, Tag } from "lucide-react"

interface CategoryInfoProps {
  category: CategoryDetail
}

export default function CategoryInfo({ category }: CategoryInfoProps) {
  return (
    <div className="border-border bg-card mb-8 rounded-xl border p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Name & Description */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
              <Tag className="text-primary size-5" />
            </div>
            <h1 className="text-foreground text-2xl font-bold">{category.name}</h1>
          </div>
          {category.description && (
            <p className="text-muted-foreground mt-2 pl-13 text-sm leading-relaxed">
              {category.description}
            </p>
          )}
        </div>

        {/* Right: Product Count Badge */}
        <div className="bg-muted/50 flex items-center gap-2 self-start rounded-lg px-4 py-2.5">
          <Package className="text-muted-foreground size-4" />
          <span className="text-foreground font-mono text-sm font-semibold">
            {category.products.length}
          </span>
          <span className="text-muted-foreground text-sm">sản phẩm</span>
        </div>
      </div>
    </div>
  )
}

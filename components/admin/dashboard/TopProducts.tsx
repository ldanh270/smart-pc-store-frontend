import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MOCK_ADMIN_PRODUCTS } from "@/configs/mock-admin-data"
import { cn } from "@/lib/utils"

// ─── Component ──────────────────────────────────────────────────────────────

export default function TopProducts({ className }: { className?: string }) {
  const topProducts = MOCK_ADMIN_PRODUCTS.slice(0, 5)

  return (
    <Card className={cn("border-border/50 flex h-full flex-col", className)}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Sản Phẩm Bán Chạy</CardTitle>
        <CardDescription>Top sản phẩm có doanh thu cao nhất</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {topProducts.map((product, index) => (
          <div key={product.id} className="flex items-center gap-3">
            <span className="bg-muted flex size-7 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.productName}</p>
              <Badge variant="secondary" className="mt-0.5 h-4 px-1.5 text-[10px]">
                {product.categoryName}
              </Badge>
            </div>
            <p className="shrink-0 font-mono text-sm font-semibold">
              {product.currentPrice.toLocaleString("vi-VN")} ₫
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useDashboardStore } from "@/stores/useDashboardStore"

// ─── Component ──────────────────────────────────────────────────────────────

export default function TopProducts({ className }: { className?: string }) {
  const { topProducts } = useDashboardStore()

  return (
    <Card className={cn("border-border/50 flex h-full flex-col", className)}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Sản Phẩm Bán Chạy</CardTitle>
        <CardDescription>Top sản phẩm có số lượng bán cao nhất</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {topProducts.map((product, index) => (
          <div key={product.id} className="flex items-center gap-3">
            <span className="bg-muted flex size-7 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{product.productName}</p>
              <div className="mt-0.5 flex items-center gap-2">
                <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                  Đã bán: {product.totalSold}
                </Badge>
              </div>
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

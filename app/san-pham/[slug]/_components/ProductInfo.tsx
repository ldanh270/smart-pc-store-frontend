import { formatPrice } from "@/lib/utils"
import { generateCategorySlug } from "@/types/category"
import { BackendProduct } from "@/types/product"

import { CheckCircle, Package, ShieldCheck, Store, Tag, Truck, XCircle } from "lucide-react"
import Link from "next/link"

interface ProductInfoProps {
  product: BackendProduct
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const isInStock = product.quantity > 0 && product.status

  return (
    <div className="flex flex-col gap-4">
      {/* Category badge */}
      {product.categoryName && (
        <Link
          href={`/danh-muc/${generateCategorySlug(product.categoryName)}`}
          className="bg-primary/10 text-primary hover:bg-primary/20 inline-flex w-fit items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-colors"
        >
          <Tag className="h-3 w-3" />
          {product.categoryName}
        </Link>
      )}

      {/* Product Name */}
      <h1 className="text-foreground font-sans text-2xl leading-tight font-bold lg:text-3xl">
        {product.productName}
      </h1>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-primary font-mono text-3xl font-bold">
          {formatPrice(product.currentPrice)}
        </span>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        {isInStock ? (
          <>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">
              Còn hàng ({product.quantity} sản phẩm)
            </span>
          </>
        ) : (
          <>
            <XCircle className="text-destructive h-4 w-4" />
            <span className="text-destructive text-sm font-medium">Hết hàng</span>
          </>
        )}
      </div>

      {/* Trust badges */}
      <div className="flex flex-wrap gap-3">
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
          Hàng chính hãng
        </span>
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Truck className="h-3.5 w-3.5 text-blue-500" />
          Miễn phí vận chuyển
        </span>
      </div>

      {/* Divider */}
      <div className="bg-border h-px" />

      {/* Description */}
      {product.description && (
        <div className="flex flex-col gap-2">
          <h2 className="text-muted-foreground font-sans text-sm font-semibold tracking-wide uppercase">
            Mô tả sản phẩm
          </h2>
          <p className="text-foreground/80 text-sm leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Product Details */}
      <div className="border-border bg-muted/30 flex flex-col gap-2 rounded-lg border p-3">
        <h2 className="text-muted-foreground font-sans text-xs font-semibold tracking-wider uppercase">
          Thông tin sản phẩm
        </h2>
        <div className="space-y-1.5 text-sm">
          <div className="text-foreground flex items-center gap-2">
            <Package className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
            <span className="text-muted-foreground">Mã sản phẩm:</span>
            <span className="font-mono font-medium">
              SP-{String(product.id).slice(-6).toUpperCase()}
            </span>
          </div>
          {product.supplierName && (
            <div className="text-foreground flex items-center gap-2">
              <Store className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
              <span className="text-muted-foreground">Nhà cung cấp:</span>
              <span className="font-medium">{product.supplierName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

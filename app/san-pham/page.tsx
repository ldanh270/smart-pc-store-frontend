import ProductCard from "@/components/shared/ProductCard"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { productService } from "@/services/productService"
import { mapBackendProduct } from "@/types/product"

import { Suspense } from "react"

import { AlertCircle, PackageX } from "lucide-react"
import { type Metadata } from "next"

import ProductFilters from "./_components/ProductFilters"

export const metadata: Metadata = {
  title: "Tìm kiếm sản phẩm | Smart PC Store",
  description: "Tìm kiếm các sản phẩm PC, linh kiện chất lượng cao",
}

interface SearchPageProps {
  searchParams: {
    name?: string
    categoryId?: string
    status?: string
    minPrice?: string
    maxPrice?: string
    page?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  // Need to wait for searchParams in Next.js 15+ async components
  const params = await searchParams

  const { name } = params

  // Render the main search grid
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          {name ? `Kết quả tìm kiếm cho "${name}"` : "Tất cả sản phẩm"}
        </h1>
        <p className="text-muted-foreground mt-2">
          Khám phá các sản phẩm chất lượng cao với giá tốt nhất
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Sidebar Filters */}
        <Suspense fallback={<FiltersSkeleton />}>
          <ProductFilters />
        </Suspense>

        {/* Product Grid Area */}
        <div className="flex-1">
          <Suspense fallback={<ProductGridSkeleton />} key={JSON.stringify(params)}>
            <ProductGrid params={params} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

async function ProductGrid({ params }: { params: SearchPageProps["searchParams"] }) {
  const p = await params
  // Prepare query params
  const queryParams = {
    name: p.name || undefined,
    categoryId: p.categoryId || undefined,
    status: p.status === "true" ? true : p.status === "false" ? false : undefined,
    minPrice: p.minPrice ? Number(p.minPrice) : undefined,
    maxPrice: p.maxPrice ? Number(p.maxPrice) : undefined,
    page: p.page ? Number(p.page) : 0,
    size: 20, // Default 20 items for grid
  }

  let backendProducts: Awaited<ReturnType<typeof productService.getProducts>> = []
  let hasError = false

  try {
    // CHIẾN LƯỢC TÌM KIẾM:
    // 1. Nếu gõ ngắn (1-2 chữ): Thường backend không xử lý tốt -> Fetch tập rộng rồi filter client-side.
    // 2. Nếu gõ dài hoặc filter theo category/giá: Dùng backend filter.

    const q = queryParams.name?.toLowerCase().trim() || ""

    if (q.length > 0 && q.length < 3) {
      // Xử lý từ khóa ngắn (1-2 ký tự)
      const allProducts = await productService.getProducts({ size: 20 })
      backendProducts = allProducts.filter(
        (p) =>
          p.productName.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)),
      )
    } else {
      // Gọi backend cho trường hợp bình thường
      backendProducts = await productService.getProducts(queryParams)

      // Fallback nếu backend trả về [] cho keyword dài (vì lý do đồng bộ hoặc index)
      if (backendProducts.length === 0 && q.length >= 3) {
        const allProducts = await productService.getProducts({ size: 20 })
        backendProducts = allProducts.filter((p) => p.productName.toLowerCase().includes(q))
      }
    }
  } catch (error) {
    console.error("Failed to load products, trying fallback:", error)
    // FALLBACK ON ERROR
    try {
      const allProducts = await productService.getProducts({ size: 20 })
      const q = queryParams.name?.toLowerCase().trim() || ""
      if (q) {
        backendProducts = allProducts.filter((p) => p.productName.toLowerCase().includes(q))
      } else {
        backendProducts = allProducts
      }
    } catch (fallbackError) {
      console.error("Complete data failure:", fallbackError)
      hasError = true
    }
  }

  if (hasError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
        <AlertDescription>
          Đã xảy ra lỗi khi tải danh sách sản phẩm. Vui lòng thử lại sau.
        </AlertDescription>
      </Alert>
    )
  }

  // Transform to UI format
  const products = backendProducts.map(mapBackendProduct)

  if (products.length === 0) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <div className="bg-muted mb-4 rounded-full p-4">
          <PackageX className="text-muted-foreground size-8" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">Chưa tìm thấy sản phẩm</h3>
        <p className="text-muted-foreground max-w-md text-sm">
          Chúng tôi không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại. Vui lòng thử tìm kiếm
          bằng từ khóa khác hoặc xóa bớt bộ lọc.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

// ─── Skeletons ──────────────────────────────────────────────────────────────

function FiltersSkeleton() {
  return (
    <div className="hidden w-64 lg:block">
      <div className="bg-card space-y-6 rounded-lg border p-6 shadow-xs">
        {/* Header */}
        <div className="mb-6 flex items-center border-b pb-4">
          <Skeleton className="mr-2 h-5 w-5" />
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Categories Section */}
        <div className="space-y-4">
          <Skeleton className="h-5 w-24" />
          <div className="space-y-2.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        {/* Price Range Section */}
        <div className="space-y-4">
          <Skeleton className="h-5 w-24" />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="border-border/60 bg-card flex flex-col overflow-hidden rounded-2xl border p-0 shadow-xs"
        >
          {/* Image Skeleton */}
          <Skeleton className="aspect-square w-full rounded-none" />

          {/* Info Skeleton */}
          <div className="flex flex-1 flex-col gap-2 p-4">
            {/* Name - matching min-h-[2.5rem] */}
            <div className="min-h-10 w-45 space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </div>

            {/* Price row */}
            <div className="mt-auto flex items-center justify-between pt-1">
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton"
import { fetchAllCategories } from "@/lib/api/categories"
import { productService } from "@/services/productService"

import { Suspense } from "react"

import { type Metadata } from "next"

import ProductSearchClient from "./_components/ProductSearchClient"

export const metadata: Metadata = {
  title: "Tìm kiếm sản phẩm | Smart PC Store",
  description: "Tìm kiếm các sản phẩm PC, linh kiện chất lượng cao",
}

export default async function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchDataWrapper />
    </Suspense>
  )
}

async function SearchDataWrapper() {
  try {
    // Fetch both categories and products in parallel
    const [allCategories, allProducts] = await Promise.all([
      fetchAllCategories(),
      productService.getProducts({ size: 1000 }),
    ])

    // eslint-disable-next-line react-hooks/error-boundaries
    return <ProductSearchClient initialProducts={allProducts} allCategories={allCategories} />
  } catch (error) {
    console.error("Failed to load search data:", error)
    // Fallback to empty data instead of crashing
    return <ProductSearchClient initialProducts={[]} allCategories={[]} />
  }
}

function SearchSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6 flex gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[250px_1fr]">
        {/* Sidebar Skeleton */}
        <div className="hidden space-y-8 md:block">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex flex-col gap-6">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

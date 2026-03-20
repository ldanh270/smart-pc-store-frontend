"use client"

import ProductCard from "@/components/shared/ProductCard"
import { Button } from "@/components/ui/button"
import type { BackendCategory } from "@/types/category"
import type { AdminProduct, Product } from "@/types/product"

import { useEffect, useMemo, useState } from "react"

import { ChevronLeft, ChevronRight, PackageOpen } from "lucide-react"
import { useSearchParams } from "next/navigation"

import CategoryBreadcrumb from "../../danh-muc/[slug]/_components/CategoryBreadcrumb"
import CategorySidebar from "../../danh-muc/[slug]/_components/CategorySidebar"
import CategorySortBar from "../../danh-muc/[slug]/_components/CategorySortBar"

// ─── Constants ──────────────────────────────────────────────────────────────

const PRODUCTS_PER_PAGE = 12

// ─── Mapper ─────────────────────────────────────────────────────────────────

function mapToProduct(p: AdminProduct): Product {
  return {
    id: String(p.id),
    name: p.productName,
    slug: p.slug || String(p.id),
    price: p.currentPrice,
    originalPrice: p.currentPrice * 1.2, // Mock discount for UI demo
    image: p.imageUrl || "/products/placeholder.svg",
    category: p.categoryName || "Linh kiện",
    stockStatus: p.quantity > 0 ? "In stock" : "Out of stock",
    quantity: p.quantity,
  }
}

// ─── Props ──────────────────────────────────────────────────────────────────

interface ProductSearchClientProps {
  initialProducts: AdminProduct[]
  allCategories: BackendCategory[]
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ProductSearchClient({
  initialProducts,
  allCategories,
}: ProductSearchClientProps) {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("name") || ""

  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<string>("name-asc")
  const [inStockOnly, setInStockOnly] = useState<boolean>(false)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Reset pagination when search query changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1)
  }, [searchQuery])

  // Extract available brands from products
  const availableBrands = useMemo(() => {
    const brands = new Set(
      initialProducts.map((p) => p.supplierName).filter((b): b is string => !!b),
    )
    return Array.from(brands).sort()
  }, [initialProducts])

  // Filter and Sort Logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...initialProducts]

    // 1. Search Query Filter (if not already filtered by backend)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          (p.productName && p.productName.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)),
      )
    }

    // 2. Stock Filter
    if (inStockOnly) {
      result = result.filter((p) => p.quantity > 0)
    }

    // 3. Brand Filter
    if (selectedBrands.length > 0) {
      result = result.filter((p) => p.supplierName && selectedBrands.includes(p.supplierName))
    }

    // 4. Category Filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => p.categoryId && selectedCategories.includes(p.categoryId))
    }

    // 5. Price Filter
    if (selectedPrices.length > 0) {
      result = result.filter((p) => {
        const pr = p.currentPrice
        return selectedPrices.some((range) => {
          if (range === "<100k") return pr < 100000
          if (range === "100k-200k") return pr >= 100000 && pr < 200000
          if (range === "200k-300k") return pr >= 200000 && pr < 300000
          if (range === "300k-500k") return pr >= 300000 && pr < 500000
          if (range === "500k-1m") return pr >= 500000 && pr < 1000000
          if (range === ">1m") return pr >= 1000000
          return false
        })
      })
    }

    // 6. Sorting
    result.sort((a, b) => {
      if (sortBy === "name-asc") return a.productName.localeCompare(b.productName)
      if (sortBy === "name-desc") return b.productName.localeCompare(a.productName)
      if (sortBy === "price-asc") return a.currentPrice - b.currentPrice
      if (sortBy === "price-desc") return b.currentPrice - a.currentPrice
      if (sortBy === "newest") return Number(b.id) - Number(a.id)
      return 0
    })

    return result
  }, [
    initialProducts,
    searchQuery,
    inStockOnly,
    selectedBrands,
    selectedPrices,
    selectedCategories,
    sortBy,
  ])

  const totalProducts = filteredAndSortedProducts.length
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE)

  const handleInStockChange = (val: boolean) => {
    setInStockOnly(val)
    setCurrentPage(1)
  }

  const handleSortChange = (val: string) => {
    setSortBy(val)
    setCurrentPage(1)
  }

  const handleBrandsChange = (val: string[] | ((prev: string[]) => string[])) => {
    setSelectedBrands(val)
    setCurrentPage(1)
  }

  const handlePricesChange = (val: string[] | ((prev: string[]) => string[])) => {
    setSelectedPrices(val)
    setCurrentPage(1)
  }

  const handleCategoriesChange = (val: string[] | ((prev: string[]) => string[])) => {
    setSelectedCategories(val)
    setCurrentPage(1)
  }

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE
    return filteredAndSortedProducts.slice(start, start + PRODUCTS_PER_PAGE)
  }, [filteredAndSortedProducts, currentPage])

  const mappedProducts = useMemo(() => paginatedProducts.map(mapToProduct), [paginatedProducts])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="flex w-full flex-col">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 lg:px-8">
        <CategoryBreadcrumb categoryName={searchQuery ? `Tìm kiếm: ${searchQuery}` : "Sản phẩm"} />

        <div className="mt-8 grid grid-cols-1 items-start gap-8 md:grid-cols-[250px_1fr]">
          <CategorySidebar
            allCategories={allCategories}
            availableBrands={availableBrands}
            currentCategorySlug=""
            inStockOnly={inStockOnly}
            setInStockOnly={handleInStockChange}
            selectedBrands={selectedBrands}
            setSelectedBrands={handleBrandsChange}
            selectedPrices={selectedPrices}
            setSelectedPrices={handlePricesChange}
            selectedCategories={selectedCategories}
            setSelectedCategories={handleCategoriesChange}
          />

          <div className="flex min-w-0 flex-col">
            <CategorySortBar sortBy={sortBy} setSortBy={handleSortChange} />

            {totalProducts === 0 ? (
              <EmptyState />
            ) : (
              <div className="flex flex-col">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {mappedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-20">
      <div className="bg-muted flex size-16 items-center justify-center rounded-full">
        <PackageOpen className="text-muted-foreground size-8" />
      </div>
      <h3 className="text-foreground mt-4 text-lg font-semibold">Chưa tìm thấy sản phẩm</h3>
      <p className="text-muted-foreground mt-1 text-sm">
        Thử tìm kiếm với từ khóa khác hoặc xóa bớt bộ lọc.
      </p>
    </div>
  )
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = useMemo(() => {
    const items: (number | "ellipsis")[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) items.push(i)
    } else {
      items.push(1)
      if (currentPage > 3) items.push("ellipsis")
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) items.push(i)
      if (currentPage < totalPages - 2) items.push("ellipsis")
      items.push(totalPages)
    }
    return items
  }, [currentPage, totalPages])

  return (
    <div className="mt-10 flex items-center justify-center gap-1.5">
      <Button
        variant="outline"
        size="icon"
        className="size-9"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="size-4" />
      </Button>

      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${index}`}
            className="text-muted-foreground flex size-9 items-center justify-center text-sm"
          >
            …
          </span>
        ) : (
          <Button
            key={`page-${page}`}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            className="size-9 text-sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        className="size-9"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}

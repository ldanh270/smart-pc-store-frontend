/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn, formatPrice } from "@/lib/utils"
import { productService } from "@/services/productService"
import { useCategoryStore } from "@/stores/useCategoryStore"
import { type Product, mapBackendProduct } from "@/types/product"

import { useEffect, useState } from "react"

import { Loader2, Search, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

type SearchDialogProps = {
  triggerMode?: "icon" | "bar"
  className?: string
  initialCategories?: any[]
}

export default function SearchDialog({
  triggerMode = "icon",
  className,
  initialCategories = [],
}: SearchDialogProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<Product[]>([])
  const { categories, fetchCategories } = useCategoryStore()
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Fetch Categories on mount
  useEffect(() => {
    // Nếu initialCategories có dữ liệu, ta có thể sync vào store hoặc dùng local
    if (categories.length === 0) {
      fetchCategories()
    }
  }, [categories.length, fetchCategories])

  // Ưu tiên dùng categories từ store, nếu trống thì dùng initialCategories làm fallback nhanh
  // Chỉ hiển thị các danh mục con (có parentId)
  const displayCategories = (categories.length > 0 ? categories : initialCategories).filter(
    (cat) => !!cat.parentId,
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    async function fetchResults() {
      const q = debouncedQuery.trim().toLowerCase()
      // Nếu không có cả từ khóa lẫn danh mục cụ thể thì ẩn kết quả
      if (!q && selectedCategory === "all") {
        setResults([])
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      try {
        // CHIẾN LƯỢC TÌM KIẾM:
        // 1. Nếu gõ ngắn (1-2 chữ): Backend thường bỏ qua hoặc trả về [] -> Ta fetch 100 cái rồi filter client-side ngay.
        // 2. Nếu gõ từ 3 chữ: Gọi backend như bình thường.

        let backendProducts: any[] = []

        if (q.length > 0 && q.length < 3) {
          // Fetch tập rộng để filter client-side cho từ khóa ngắn
          const allProducts = await productService.getProducts({ size: 100 })
          backendProducts = allProducts.filter(
            (p) =>
              p.productName.toLowerCase().includes(q) ||
              (p.description && p.description.toLowerCase().includes(q)),
          )
        } else {
          // Gõ đủ dài (> 2 chữ) hoặc chỉ chọn category -> Gọi backend filter
          const params: any = {}
          if (q) params.q = q
          if (selectedCategory !== "all") {
            params.categoryId = selectedCategory
          }
          backendProducts = await productService.getProducts(params)

          // Fallback nếu backend trả về [] cho từ khóa dài (có thể do sai lệch index)
          if (backendProducts.length === 0 && q.length >= 3) {
            const allProducts = await productService.getProducts({ size: 100 })
            backendProducts = allProducts.filter((p) => p.productName.toLowerCase().includes(q))
          }
        }

        setResults(backendProducts.map(mapBackendProduct))
      } catch (error) {
        console.error("Failed to fetch search results:", error)
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }

    fetchResults()
  }, [debouncedQuery, selectedCategory])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q || selectedCategory !== "all") {
      setIsOpen(false)
      const url = new URL("/san-pham", window.location.origin)
      if (q) url.searchParams.set("q", q)
      if (selectedCategory !== "all") url.searchParams.set("categoryId", selectedCategory)
      router.push(url.pathname + url.search)
    }
  }

  return (
    <div className={cn("relative z-50 w-full", className)}>
      <div className="mx-auto w-full max-w-2xl">
        {triggerMode === "bar" ? (
          <form
            onSubmit={handleSubmit}
            className={cn(
              "group border-border/60 bg-muted/30 hover:border-primary/40 focus-within:bg-background focus-within:border-primary/60 focus-within:ring-primary/20 flex h-10 w-full items-center overflow-visible rounded-xl border transition-all focus-within:ring-2",
              isOpen ? "border-primary/60 bg-background" : "",
            )}
          >
            {/* Category Select */}
            <div className="hidden h-full shrink-0 items-center md:flex">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="border-border/60 h-full w-36 cursor-pointer rounded-none border-0 border-r bg-transparent px-3 text-xs font-semibold shadow-none focus:ring-0 focus-visible:ring-0">
                  <SelectValue placeholder="Tất cả danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-semibold">
                    Tất cả danh mục
                  </SelectItem>
                  {displayCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Input */}
            <div className="relative flex h-full min-w-0 flex-1 items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setIsOpen(true)
                }}
                onFocus={() => setIsOpen(true)}
                placeholder="Tìm kiếm linh kiện, máy tính..."
                className="placeholder:text-muted-foreground/60 h-full w-full min-w-0 bg-transparent px-4 text-sm outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("")
                    setIsOpen(false)
                  }}
                  className="text-muted-foreground hover:text-foreground absolute right-2 cursor-pointer p-1"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              aria-label="Tìm kiếm"
              className="bg-primary/5 text-muted-foreground hover:bg-primary/10 hover:text-primary border-border/60 flex h-full w-12 shrink-0 cursor-pointer items-center justify-center rounded-r-xl border-l transition-colors"
            >
              <Search className="size-4" />
            </button>
          </form>
        ) : (
          /* Mobile Icon trigger */
          <div className="flex justify-end">
            <button
              type="button"
              aria-label="Tìm kiếm"
              onClick={() => setIsOpen((prev) => !prev)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg",
                "border-border/60 bg-muted/40 text-muted-foreground border",
                "hover:border-primary/40 hover:bg-primary/10 hover:text-primary cursor-pointer transition-all",
                isOpen && "bg-primary/10 text-primary border-primary/40",
              )}
            >
              {isOpen ? <X className="size-4" /> : <Search className="size-4" />}
            </button>
          </div>
        )}

        {/* Inline Dropdown for Results */}
        {isOpen && (
          <>
            {/* Overlay click to close */}
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <div
              className={cn(
                "border-border bg-popover animate-in fade-in zoom-in-95 absolute top-full z-50 mt-2 overflow-hidden rounded-xl border shadow-xl shadow-black/5",
                triggerMode === "icon" ? "right-0 w-[calc(100vw-32px)] max-w-90" : "left-0 w-full",
              )}
            >
              {/* Mobile Search Input (shows only when triggerMode is icon) */}
              {triggerMode === "icon" && (
                <div className="flex items-center gap-2 border-b p-3">
                  <Search className="text-muted-foreground ml-1 size-4 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm..."
                    className="flex-1 bg-transparent text-sm outline-none"
                    autoFocus
                  />
                </div>
              )}

              <ScrollArea className="h-full max-h-[60vh] overflow-y-auto md:max-h-100">
                {isSearching ? (
                  <div className="text-muted-foreground flex flex-col items-center justify-center py-10">
                    <Loader2 className="mb-3 size-5 animate-spin" />
                    <p className="text-xs">Đang tìm kiếm...</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="p-2">
                    <div className="text-muted-foreground mb-1.5 px-3 py-1 text-xs font-semibold uppercase">
                      Sản phẩm ({results.length})
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {results.slice(0, 10).map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          className="hover:bg-muted/60 flex items-center gap-3 rounded-lg p-2 text-left transition-colors"
                          onClick={() => {
                            setIsOpen(false)
                            router.push(`/san-pham/${product.slug}`)
                          }}
                        >
                          <div className="bg-background relative size-10 shrink-0 overflow-hidden rounded border">
                            <Image
                              src={product.image || "/placeholder.png"}
                              alt={product.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1 pr-2">
                            <h4 className="truncate text-sm leading-tight font-medium">
                              {product.name}
                            </h4>
                            <p className="text-primary mt-0.5 font-mono text-xs font-semibold">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="mt-2 border-t p-2 pb-1 text-center">
                      <Button
                        variant="ghost"
                        className="text-primary hover:text-primary hover:bg-primary/5 flex h-8 w-full items-center justify-center text-xs"
                        onClick={(e) => handleSubmit(e as any)}
                      >
                        Xem tất cả kết quả
                      </Button>
                    </div>
                  </div>
                ) : debouncedQuery.trim() || selectedCategory !== "all" ? (
                  <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
                    <Search className="text-muted-foreground/20 mx-auto mb-3 size-10" />
                    <p className="text-sm font-medium">Không tìm thấy sản phẩm nào</p>
                    <p className="text-muted-foreground mt-1 max-w-50 text-xs">
                      {selectedCategory !== "all"
                        ? "Thử bỏ lọc danh mục hoặc đổi từ khóa."
                        : "Thử một từ khóa khác hoặc kiểm tra lại lỗi chính tả."}
                    </p>
                  </div>
                ) : (
                  <div className="text-muted-foreground hidden flex-col items-center justify-center py-8 text-center md:flex">
                    <p className="text-xs">Gõ phím để tìm kiếm...</p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

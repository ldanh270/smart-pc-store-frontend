"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { BackendCategory } from "@/types/category"

import { useMemo, useState } from "react"

import { Search } from "lucide-react"
import Link from "next/link"

interface CategorySidebarProps {
  allCategories: BackendCategory[]
  availableBrands: string[]
  currentCategorySlug: string
  inStockOnly: boolean
  setInStockOnly: (val: boolean) => void
  selectedBrands: string[]
  setSelectedBrands: (val: string[] | ((prev: string[]) => string[])) => void
  selectedPrices: string[]
  setSelectedPrices: (val: string[] | ((prev: string[]) => string[])) => void
  selectedCategories: string[]
  setSelectedCategories: (val: string[] | ((prev: string[]) => string[])) => void
}

export default function CategorySidebar({
  allCategories,
  availableBrands,
  inStockOnly,
  setInStockOnly,
  selectedBrands,
  setSelectedBrands,
  selectedPrices,
  setSelectedPrices,
  selectedCategories,
  setSelectedCategories,
}: CategorySidebarProps) {
  const [brandSearch, setBrandSearch] = useState("")
  const [categorySearch, setCategorySearch] = useState("")

  const handleBrandChange = (brand: string, checked: boolean) => {
    setSelectedBrands((prev) => (checked ? [...prev, brand] : prev.filter((b) => b !== brand)))
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, categoryId] : prev.filter((id) => id !== categoryId),
    )
  }

  const handlePriceChange = (priceId: string, checked: boolean) => {
    setSelectedPrices((prev) => (checked ? [...prev, priceId] : prev.filter((p) => p !== priceId)))
  }

  const filteredBrands = useMemo(() => {
    return availableBrands.filter((brand) =>
      brand?.toLowerCase().includes(brandSearch.toLowerCase()),
    )
  }, [availableBrands, brandSearch])

  const filteredCategories = useMemo(() => {
    return allCategories.filter((cat) =>
      cat.categoryName?.toLowerCase().includes(categorySearch.toLowerCase()),
    )
  }, [allCategories, categorySearch])

  const PRICE_RANGES = [
    { id: "<100k", label: "Giá dưới 100.000đ" },
    { id: "100k-200k", label: "100.000đ - 200.000đ" },
    { id: "200k-300k", label: "200.000đ - 300.000đ" },
    { id: "300k-500k", label: "300.000đ - 500.000đ" },
    { id: "500k-1m", label: "500.000đ - 1.000.000đ" },
    { id: ">1m", label: "Giá trên 1.000.000đ" },
  ]

  return (
    <aside className="flex w-full shrink-0 flex-col gap-8 md:w-62.5">
      {/* Tìm theo */}
      <section className="pt-5">
        <h3 className="text-foreground mb-4 text-sm font-bold tracking-wider uppercase">
          Tìm theo
        </h3>

        <div className="flex flex-col gap-6">
          {/* Trạng thái tồn kho */}
          <div>
            <h4 className="text-foreground mb-3 text-sm font-semibold">Trạng thái tồn kho</h4>
            <label className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                id="in-stock"
                checked={inStockOnly}
                onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
              />
              Hàng có sẵn
            </label>
          </div>

          {/* Danh mục sản phẩm */}
          <div className="flex flex-col gap-3">
            <h4 className="text-foreground text-sm font-semibold">Danh mục sản phẩm</h4>

            {/* Category Search Input */}
            {allCategories.length > 8 && (
              <div className="relative mb-1">
                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5" />
                <Input
                  placeholder="Tìm danh mục..."
                  className="focus-visible:ring-primary/30 h-8 pl-8 text-xs"
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                />
              </div>
            )}

            <ScrollArea className={`${allCategories.length > 8 ? "h-48" : "h-auto max-h-48"} pr-3`}>
              <div className="flex flex-col gap-2.5">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <label
                      key={cat.id}
                      className="text-muted-foreground hover:text-foreground line-clamp-1 flex cursor-pointer items-center gap-2 text-sm"
                      title={cat.categoryName}
                    >
                      <Checkbox
                        id={`cat-${cat.id}`}
                        checked={selectedCategories.includes(cat.id)}
                        onCheckedChange={(checked) =>
                          handleCategoryChange(cat.id, checked as boolean)
                        }
                      />
                      {cat.categoryName}
                    </label>
                  ))
                ) : (
                  <span className="text-muted-foreground text-xs italic">Không tìm thấy</span>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Thương hiệu */}
          {availableBrands.length > 0 && (
            <div className="flex flex-col gap-3">
              <h4 className="text-foreground text-sm font-semibold">Thương hiệu</h4>

              {/* Brand Search Input - only show if many brands */}
              {availableBrands.length > 8 && (
                <div className="relative mb-1">
                  <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5" />
                  <Input
                    placeholder="Tìm hãng..."
                    className="focus-visible:ring-primary/30 h-8 pl-8 text-xs"
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                  />
                </div>
              )}

              <ScrollArea
                className={`${availableBrands.length > 8 ? "h-48" : "h-auto max-h-48"} pr-3`}
              >
                <div className="flex flex-col gap-2.5">
                  {filteredBrands.length > 0 ? (
                    filteredBrands.map((brand) => (
                      <label
                        key={brand}
                        className="text-muted-foreground hover:text-foreground line-clamp-1 flex cursor-pointer items-center gap-2 text-sm"
                        title={brand}
                      >
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) =>
                            handleBrandChange(brand, checked as boolean)
                          }
                        />
                        {brand}
                      </label>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-xs italic">Không tìm thấy</span>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Giá sản phẩm */}
          <div>
            <h4 className="text-foreground mb-3 text-sm font-semibold">Giá sản phẩm</h4>
            <div className="flex flex-col gap-2.5">
              {PRICE_RANGES.map((price) => (
                <label
                  key={price.id}
                  className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2 text-sm"
                >
                  <Checkbox
                    id={`price-${price.id}`}
                    checked={selectedPrices.includes(price.id)}
                    onCheckedChange={(checked) => handlePriceChange(price.id, checked as boolean)}
                  />
                  {price.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Links */}
      <section>
        <h3 className="text-foreground mb-4 text-sm font-bold tracking-wider uppercase">
          Liên kết
        </h3>
        <ul className="text-muted-foreground flex flex-col gap-3 text-sm">
          <li>
            <Link href="/" className="hover:text-primary transition-colors">
              Trang chủ
            </Link>
          </li>
          <li>
            <Link href="/ve-chung-toi" className="hover:text-primary block transition-colors">
              Về chúng tôi
            </Link>
          </li>
          <li>
            <Link href="/san-pham" className="hover:text-primary block transition-colors">
              Tất cả sản phẩm
            </Link>
          </li>
        </ul>
      </section>
    </aside>
  )
}

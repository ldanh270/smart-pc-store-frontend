"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface CategorySortBarProps {
  sortBy: string
  setSortBy: (val: string) => void
}

export default function CategorySortBar({ sortBy, setSortBy }: CategorySortBarProps) {
  return (
    <div className="border-border mb-6 flex flex-col gap-4 border-b py-4 sm:flex-row sm:items-center">
      <span className="text-foreground text-sm font-semibold whitespace-nowrap">Xếp theo:</span>
      <RadioGroup
        value={sortBy}
        onValueChange={setSortBy}
        className="flex flex-wrap items-center gap-4 sm:gap-6"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="name-asc" id="name-asc" />
          <label
            htmlFor="name-asc"
            className="text-muted-foreground hover:text-foreground cursor-pointer text-sm"
          >
            Tên A-Z
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="name-desc" id="name-desc" />
          <label
            htmlFor="name-desc"
            className="text-muted-foreground hover:text-foreground cursor-pointer text-sm"
          >
            Tên Z-A
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="newest" id="newest" />
          <label
            htmlFor="newest"
            className="text-muted-foreground hover:text-foreground cursor-pointer text-sm"
          >
            Hàng mới
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="price-asc" id="price-asc" />
          <label
            htmlFor="price-asc"
            className="text-muted-foreground hover:text-foreground cursor-pointer text-sm"
          >
            Giá thấp đến cao
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="price-desc" id="price-desc" />
          <label
            htmlFor="price-desc"
            className="text-muted-foreground hover:text-foreground cursor-pointer text-sm"
          >
            Giá cao xuống thấp
          </label>
        </div>
      </RadioGroup>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import * as React from "react"

import { Check, ChevronsUpDown } from "lucide-react"

interface ProductComboboxProps {
  products: {
    id: string
    productName: string
  }[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function ProductCombobox({ products, value, onChange, disabled = false }: ProductComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const selectedProduct = React.useMemo(() => {
    return products.find((p) => p.id === value)
  }, [products, value])

  return (
    <Popover
      open={open}
      modal={true}
      onOpenChange={(nextOpen) => {
        if (disabled) return
        setOpen(nextOpen)
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between px-3 font-normal"
        >
          <span className="truncate">
            {selectedProduct ? selectedProduct.productName : "Chọn sản phẩm..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-75 p-0" align="start">
        <Command>
          <CommandInput placeholder="Tìm kiếm sản phẩm..." />
          <CommandList>
            <CommandEmpty>Không tìm thấy sản phẩm nào.</CommandEmpty>
            <CommandGroup className="w-full">
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.productName} // command search by value implicitly
                  onSelect={() => {
                    onChange(product.id === value ? "" : product.id)
                    setOpen(false)
                  }}
                  className="w-full"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === product.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {product.productName}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

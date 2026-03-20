"use client"

import { BackendProduct } from "@/types/product"

import { useState } from "react"

import AddToCartButton from "./AddToCartButton"
import PriceChart from "./PriceChart"
import ProductBreadcrumb from "./ProductBreadcrumb"
import ProductImageGallery from "./ProductImageGallery"
import ProductInfo from "./ProductInfo"
import QuantitySelector from "./QuantitySelector"

interface ProductDetailClientProps {
  product: BackendProduct
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const isInStock = product.quantity > 0 && product.status
  const [quantity, setQuantity] = useState(1)

  return (
    <main className="mx-auto w-7xl px-4 py-8 lg:px-8">
      <ProductBreadcrumb productName={product.productName} />

      <div className="flex flex-col gap-10 lg:flex-row">
        {/* Left: Image */}
        <div className="w-full lg:w-1/2">
          <div className="sticky top-36">
            <ProductImageGallery imageUrl={product.imageUrl} productName={product.productName} />
          </div>
        </div>

        {/* Right: Info + Actions */}
        <div className="flex w-full flex-col gap-6 lg:w-1/2">
          <ProductInfo product={product} />

          {/* Divider */}
          <div className="bg-border h-px" />

          {/* Quantity + Add to Cart */}
          {isInStock && (
            <QuantitySelector
              value={quantity}
              maxQuantity={product.quantity}
              onChange={setQuantity}
            />
          )}

          <AddToCartButton productId={product.id} quantity={quantity} isInStock={isInStock} />
        </div>
      </div>

      {/* Price Chart */}
      <PriceChart productId={product.id} />
    </main>
  )
}

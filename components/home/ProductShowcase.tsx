"use client"

import ProductCard from "@/components/shared/ProductCard"
import { type Product } from "@/types/product"

import Link from "next/link"

interface ProductShowcaseProps {
  forYou: Product[]
}

export default function ProductShowcase({ forYou }: ProductShowcaseProps) {
  return (
    <div className="space-y-12">
      <div className="mb-10">
        <h2 className="text-foreground text-2xl font-black md:text-3xl">Gợi Ý Cho Bạn</h2>
        <p className="text-muted-foreground mt-2 max-w-md text-sm">
          Khám phá danh sách sản phẩm được cá nhân hóa dựa trên nhu cầu và sở thích của riêng bạn.
        </p>
        <div className="from-primary mt-3 h-1 w-14 rounded-full bg-linear-to-r to-transparent" />
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {forYou.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <Link
          href="/san-pham"
          className="group bg-foreground text-background hover:bg-primary flex items-center gap-2 rounded-full px-10 py-5 text-sm font-black tracking-widest uppercase transition-all duration-300 hover:shadow-[0_0_40px_rgba(14,165,233,0.4)] active:scale-95"
        >
          Xem Thêm Sản Phẩm
          <span className="transition-transform group-hover:translate-x-2">→</span>
        </Link>
      </div>
    </div>
  )
}

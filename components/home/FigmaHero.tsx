import { Button } from "@/components/ui/button"
import type { Product } from "@/types/product"

import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface FigmaHeroProps {
  products: Product[]
}

export default function FigmaHero({ products }: FigmaHeroProps) {
  // We only want the first 3 products for the sub-banners
  const subHeroProducts = products.slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Main Banner */}
      <div className="relative flex min-h-100 items-center overflow-hidden rounded-3xl bg-linear-to-r from-gray-100 to-gray-200 p-8 md:p-12 dark:from-gray-900 dark:to-gray-800">
        <div className="relative z-10 w-full space-y-6 md:w-1/2">
          <h1 className="text-muted/90 text-4xl leading-tight font-black tracking-tight md:text-6xl">
            Find devices that&apos;s <br /> right for you
          </h1>
          <p className="text-muted-foreground max-w-sm">
            Khám phá các thiết bị điện tử, linh kiện máy tính chất lượng cao với giá thành tốt nhất.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs font-semibold uppercase">
                Start From
              </span>
              <span className="text-primary text-3xl font-bold">$45.00</span>
            </div>
            <Button
              size="lg"
              className="rounded-full px-8 text-xs font-bold tracking-widest uppercase"
              asChild
            >
              <Link href="/san-pham">Learn More</Link>
            </Button>
          </div>
        </div>
        <div className="absolute top-1/2 right-0 hidden h-full w-2/3 -translate-y-1/2 md:block">
          <Image
            src="/hero/slide-pc-gaming.png" // Fallback to existing image
            alt="Hero Watch"
            fill
            className="scale-125 object-contain object-right drop-shadow-2xl"
            priority
          />
        </div>
      </div>

      {/* Sub Banners */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {subHeroProducts.map((product) => (
          <Link
            key={product.slug}
            href={`/san-pham/${product.slug}`}
            className="group relative flex aspect-2/1 flex-col justify-end overflow-hidden rounded-3xl bg-slate-900 p-6 md:aspect-4/3 lg:aspect-video"
          >
            {/* Background Image */}
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 z-10 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content */}
            <div className="relative z-20 space-y-1 transition-transform duration-300 group-hover:-translate-y-2">
              <h3 className="line-clamp-1 text-lg font-bold text-white md:text-xl">
                {product.name}
              </h3>
              <p className="line-clamp-2 min-h-[2em] text-xs text-white/70">
                {product.description || product.category}
              </p>
              <div className="mt-2 flex items-center justify-between border-t border-white/20 pt-2">
                <span className="font-bold text-white">${product.price.toLocaleString()}</span>
                <ArrowRight className="size-4 -translate-x-2 text-white opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
              </div>
            </div>
          </Link>
        ))}

        {/* Fallback if less than 3 products */}
        {subHeroProducts.length < 3 &&
          Array.from({ length: 3 - subHeroProducts.length }).map((_, i) => (
            <div
              key={`placeholder-${i}`}
              className="bg-muted aspect-2/1 animate-pulse rounded-3xl md:aspect-4/3 lg:aspect-video"
            />
          ))}
      </div>
    </div>
  )
}

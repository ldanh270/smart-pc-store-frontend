/* eslint-disable react-hooks/purity */
"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn, formatPrice } from "@/lib/utils"
import { type Product } from "@/types/product"

import Autoplay from "embla-carousel-autoplay"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Top10ProductsProps {
  products: Product[]
}

/**
 * Local component for a cleaner, Apple/Elextra style product card
 * specifically for the Top 10 section as requested by the user.
 * Now using primary colors from globals.css.
 */
function TopProductCard({ product }: { product: Product }) {
  // Mock some data that isn't in the DB but is in the user's reference image
  const mockSold = `${(Math.random() * 5 + 1).toFixed(1)}m sold`
  const mockStars = Math.floor(Math.random() * 2) + 3 // 3, 4, or 5 stars

  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="group flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="bg-muted/30 relative aspect-square overflow-hidden rounded-2xl">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 px-1">
        <h3 className="text-foreground group-hover:text-primary line-clamp-1 text-lg font-bold transition-colors">
          {product.name}
        </h3>
        <p className="text-muted-foreground/80 text-sm font-medium">{mockSold}</p>

        <div className="mt-1 flex items-center justify-between">
          <span className="text-foreground text-md font-semibold">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function Top10Products({ products }: Top10ProductsProps) {
  return (
    <div className="flex flex-col gap-12">
      {/* Centered Header */}
      {/* <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto px-4 mb-4">
				<h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
					Top 10 Selected Products On the Week
				</h2>
				<p className="text-muted-foreground text-sm md:text-base leading-relaxed">
					Danh sách 10 sản phẩm công nghệ nổi bật nhất, được lựa chọn kỹ lưỡng<br className="hidden md:block" />
					dựa trên xu hướng và đánh giá từ cộng đồng người dùng.
				</p>
			</div> */}

      <div className="flex flex-col items-center space-y-3 text-center">
        <h2 className="text-foreground text-2xl font-black tracking-tight md:text-3xl">
          Top 10 Sản Phẩm <span className="text-primary">Nổi Bật</span>
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Danh sách 10 sản phẩm công nghệ nổi bật nhất, được lựa chọn kỹ lưỡng
          <br className="hidden md:block" />
          dựa trên xu hướng và đánh giá từ cộng đồng người dùng.
        </p>
        <div className="from-primary mt-2 h-1 w-14 rounded-full bg-linear-to-r to-transparent" />
      </div>

      {/* Carousel Component */}
      <div className="relative px-12">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {products.slice(0, 10).map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-full pl-4 sm:basis-1/2 md:basis-1/3 md:pl-6 lg:basis-1/5"
              >
                <TopProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden lg:block">
            <CarouselPrevious className="-left-4 lg:-left-12" />
            <CarouselNext className="-right-4 lg:-right-12" />
          </div>
        </Carousel>
      </div>
    </div>
  )
}

"use client"

import SectionHeader from "@/components/shared/SectionHeader"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/category"
import { generateCategorySlug } from "@/types/category"

import Autoplay from "embla-carousel-autoplay"
import {
  CircuitBoard,
  Cpu,
  Gamepad2,
  HardDrive,
  Laptop,
  MemoryStick,
  Monitor,
  MonitorDot,
} from "lucide-react"
import Link from "next/link"

// Map icon name strings to Lucide components
const ICON_MAP: Record<string, React.ElementType> = {
  Cpu,
  Monitor,
  MemoryStick,
  HardDrive,
  CircuitBoard,
  Gamepad2,
  Laptop,
  MonitorDot,
}

interface CategoryGridProps {
  categories?: Category[]
}

// Map pastel colors to categories for a soft, premium look
const COLORS = [
  {
    bg: "bg-blue-50",
    border: "border-blue-100 hover:border-blue-200",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
  },
  {
    bg: "bg-emerald-50",
    border: "border-emerald-100 hover:border-emerald-200",
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
  },
  {
    bg: "bg-purple-50",
    border: "border-purple-100 hover:border-purple-200",
    iconBg: "bg-purple-100",
    iconText: "text-purple-600",
  },
  {
    bg: "bg-orange-50",
    border: "border-orange-100 hover:border-orange-200",
    iconBg: "bg-orange-100",
    iconText: "text-orange-600",
  },
  {
    bg: "bg-rose-50",
    border: "border-rose-100 hover:border-rose-200",
    iconBg: "bg-rose-100",
    iconText: "text-rose-600",
  },
  {
    bg: "bg-amber-50",
    border: "border-amber-100 hover:border-amber-200",
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
  },
  {
    bg: "bg-indigo-50",
    border: "border-indigo-100 hover:border-indigo-200",
    iconBg: "bg-indigo-100",
    iconText: "text-indigo-600",
  },
  {
    bg: "bg-cyan-50",
    border: "border-cyan-100 hover:border-cyan-200",
    iconBg: "bg-cyan-100",
    iconText: "text-cyan-600",
  },
]

export default function CategoryGrid({ categories = [] }: CategoryGridProps) {
  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-16">
        <SectionHeader
          title="Danh Mục Sản Phẩm"
          subtitle="Tìm kiếm linh kiện và thiết bị phù hợp với nhu cầu của bạn"
        />

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
          className="relative w-full"
        >
          <CarouselContent className="my-1 -ml-2 md:-ml-3">
            {categories.map((category, index) => {
              // Extract icon name from description or fallback to array index based icons since BE doesn't store icon name.
              const iconKeys = Object.keys(ICON_MAP)
              const Icon = ICON_MAP[iconKeys[index % iconKeys.length]] ?? Cpu
              const color = COLORS[index % COLORS.length]
              // const href = `/danh-muc/${generateCategorySlug(category.name)}`;
              const href = `/danh-muc/${generateCategorySlug(category.name)}`

              return (
                <CarouselItem
                  key={category.id}
                  className="basis-1/2 pl-2 sm:basis-1/3 md:basis-1/4 md:pl-3 lg:basis-1/6 xl:basis-1/7"
                >
                  <Link
                    href={href}
                    className={cn(
                      "group flex h-40 flex-col items-center gap-3 rounded-lg border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md",
                      color.bg,
                      color.border,
                    )}
                  >
                    <div
                      className={cn(
                        "flex size-12 items-center justify-center rounded-lg transition-colors",
                        color.iconBg,
                        color.iconText,
                      )}
                    >
                      <Icon className="size-6" />
                    </div>
                    <div className="text-center">
                      <p className="text-foreground line-clamp-2 text-sm font-semibold">
                        {category.name}
                      </p>
                      {category.description && (
                        <p className="text-muted-foreground mt-0.5 line-clamp-1 hidden text-xs lg:block">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          <div className="hidden sm:block">
            <CarouselPrevious className="-left-4 lg:-left-12" />
            <CarouselNext className="-right-4 lg:-right-12" />
          </div>
        </Carousel>
      </div>
    </section>
  )
}

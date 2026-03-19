"use client"

import { Button } from "@/components/ui/button"
import { cn, formatPrice } from "@/lib/utils"
import type { Product } from "@/types/product"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const SLIDE_INTERVAL_MS = 5500
const SWIPE_THRESHOLD_PX = 50

interface HeroSliderProps {
  products?: Product[]
}

// Static fallback slides nếu chưa có sản phẩm
const FALLBACK_SLIDES = [
  {
    id: "fallback-1",
    image: "/hero/slide-setup.png",
    title: "Hi-end PC",
    titleAccent: "& Gaming Gear",
    subtitle:
      "Linh kiện chính hãng, giá tốt nhất thị trường. Xây dựng dàn máy trong mơ cùng Smart PC.",
    href: "/san-pham",
    ctaLabel: "Khám phá ngay",
    badge: "New Arrivals",
    price: null,
  },
  {
    id: "fallback-2",
    image: "/hero/slide-pc-gaming.png",
    title: "Gaming Setups",
    titleAccent: "Đỉnh Cao",
    subtitle:
      "Từ GPU cao cấp đến màn hình 4K – mọi thứ bạn cần cho trải nghiệm chơi game hoàn hảo.",
    href: "/danh-muc",
    ctaLabel: "Xem tất cả",
    badge: "Best Sellers",
    price: null,
  },
]

export default function HeroSlider({ products = [] }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const dragStartX = useRef<number | null>(null)
  const isDragging = useRef(false)

  const slides = useMemo(() => {
    if (products.length > 0) {
      return products.slice(0, 5).map((p) => ({
        id: p.id,
        image: p.image,
        title: p.name.split(" ").slice(0, 2).join(" "),
        titleAccent: p.name.split(" ").slice(2).join(" ") || "",
        subtitle: `Sản phẩm hi-end với mức giá cực kỳ cạnh tranh. Chỉ có tại Smart PC Store.`,
        href: `/san-pham/${p.slug}`,
        ctaLabel: "Xem ngay",
        badge: p.badge ?? "Hot Deal",
        price: p.price,
      }))
    }
    return FALLBACK_SLIDES
  }, [products])

  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    autoPlayRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, SLIDE_INTERVAL_MS)
  }, [slides.length])

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return
      setIsAnimating(true)
      setCurrentSlide(index)
      resetAutoPlay()
      setTimeout(() => setIsAnimating(false), 600)
    },
    [isAnimating, resetAutoPlay],
  )

  const goNext = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length)
  }, [currentSlide, goToSlide, slides.length])

  const goPrev = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length)
  }, [currentSlide, goToSlide, slides.length])

  useEffect(() => {
    resetAutoPlay()
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [resetAutoPlay])

  const getClientX = (e: React.TouchEvent | React.MouseEvent) => {
    if ("touches" in e) return e.touches[0].clientX
    return e.clientX
  }
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    dragStartX.current = getClientX(e)
    isDragging.current = true
  }
  const handleDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current || dragStartX.current === null) return
    isDragging.current = false
    const endX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX
    const delta = endX - dragStartX.current
    dragStartX.current = null
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return
    if (delta < 0) goNext()
    else goPrev()
  }
  const handleDragCancel = () => {
    isDragging.current = false
    dragStartX.current = null
  }

  if (!slides || slides.length === 0) return null
  const slide = slides[currentSlide]

  return (
    <section
      className="relative h-[88vh] max-h-200 min-h-140 cursor-grab overflow-hidden select-none active:cursor-grabbing"
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragCancel}
      onTouchStart={handleDragStart}
      onTouchEnd={handleDragEnd}
      onTouchCancel={handleDragCancel}
    >
      {/* ── Background layer ──────────────────────────────────────── */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            i === currentSlide ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            sizes="100vw"
            className="pointer-events-none object-cover object-center"
            style={{
              transform: i === currentSlide ? "scale(1)" : "scale(1.05)",
              transition: "transform 7s ease-out",
            }}
            priority={i === 0}
            draggable={false}
          />
          {/* Dark gradient overlay — heavier bottom for text */}
          <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/50 to-black/10" />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/20" />
        </div>
      ))}

      {/* ── Mesh accent glow ──────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-primary/20 absolute top-1/4 left-0 h-96 w-96 rounded-full blur-[120px]" />
        <div className="bg-primary/10 absolute right-1/4 bottom-0 h-64 w-64 rounded-full blur-[80px]" />
      </div>

      {/* ── Content — split layout ────────────────────────────────── */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 lg:px-8">
        <div className="w-full max-w-2xl">
          {/* Badge */}
          <div
            key={`badge-${slide.id}`}
            className="border-primary/30 bg-primary/10 animate-in fade-in slide-in-from-left-4 mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 backdrop-blur-sm duration-500"
          >
            <span className="relative flex h-2 w-2">
              <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
              <span className="bg-primary relative inline-flex h-2 w-2 rounded-full" />
            </span>
            <span className="text-primary text-xs font-semibold tracking-widest uppercase">
              {slide.badge}
            </span>
          </div>

          {/* Heading — sole h1 on page; content panel renders only currentSlide */}
          <h1
            key={`title-${slide.id}`}
            className="animate-in fade-in slide-in-from-left-6 delay-75 duration-600"
          >
            <span className="block text-4xl leading-none font-black tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {slide.title}
            </span>
            {slide.titleAccent && (
              <span className="text-gradient mt-1 block text-4xl leading-none font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                {slide.titleAccent}
              </span>
            )}
          </h1>

          {/* Description */}
          <p
            key={`desc-${slide.id}`}
            className="animate-in fade-in slide-in-from-left-4 mt-5 max-w-md text-base leading-relaxed text-white/70 delay-150 duration-500"
          >
            {slide.subtitle}
          </p>

          {/* Price if available */}
          {slide.price && (
            <div className="animate-in fade-in mt-4 delay-200 duration-500">
              <span className="text-gradient font-mono text-2xl font-bold">
                {formatPrice(slide.price)}
              </span>
            </div>
          )}

          {/* CTAs */}
          <div
            key={`cta-${slide.id}`}
            className="animate-in fade-in slide-in-from-bottom-4 mt-8 flex flex-wrap gap-3 delay-200 duration-500"
          >
            <Button
              size="lg"
              asChild
              className="group shadow-primary/25 hover:shadow-primary/40 gap-2 rounded-full px-7 font-semibold shadow-lg transition-all hover:scale-105"
            >
              <Link href={slide.href}>
                <ShoppingBag className="size-4" />
                {slide.ctaLabel}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-full border-white/20 bg-white/5 px-7 font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/15"
            >
              <Link href="/san-pham">Xem tất cả</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Slide counter (top right) ─────────────────────────────── */}
      <div className="absolute top-8 right-8 z-10 hidden items-center gap-3 md:flex">
        <span className="font-mono text-xs text-white/50">
          {String(currentSlide + 1).padStart(2, "0")}
          <span className="mx-1 text-white/25">/</span>
          {String(slides.length).padStart(2, "0")}
        </span>
      </div>

      {/* ── Arrow navigation ─────────────────────────────────────── */}
      <div className="absolute right-8 bottom-10 z-10 hidden items-center gap-2 md:flex">
        <button
          onClick={(e) => {
            e.stopPropagation()
            goPrev()
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all hover:scale-110 hover:border-white/40 hover:bg-white/15"
          aria-label="Slide trước"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            goNext()
          }}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all hover:scale-110 hover:border-white/40 hover:bg-white/15"
          aria-label="Slide tiếp"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* ── Dot indicators ───────────────────────────────────────── */}
      <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 md:left-8 md:translate-x-0">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={(e) => {
              e.stopPropagation()
              goToSlide(i)
            }}
            aria-label={`Chuyển đến slide ${i + 1}`}
            className={cn(
              "rounded-full transition-all duration-300 ease-out",
              i === currentSlide
                ? "bg-primary shadow-primary/50 h-2 w-8 shadow-lg"
                : "h-2 w-2 bg-white/30 hover:bg-white/60",
            )}
          />
        ))}
      </div>

      {/* ── Bottom gradient fade ──────────────────────────────────── */}
      <div className="from-background pointer-events-none absolute right-0 bottom-0 left-0 h-24 bg-linear-to-t to-transparent" />
    </section>
  )
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HERO_SLIDES } from "@/configs/mock-data";
import { cn } from "@/lib/utils";

const SLIDE_INTERVAL_MS = 5000;
const SWIPE_THRESHOLD_PX = 50;

export default function HeroSlider() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const dragStartX = useRef<number | null>(null);
	const isDragging = useRef(false);

	// ─── Navigation helpers ──────────────────────────────────────────────

	const resetAutoPlay = useCallback(() => {
		if (autoPlayRef.current) clearInterval(autoPlayRef.current);
		autoPlayRef.current = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
		}, SLIDE_INTERVAL_MS);
	}, []);

	const goToSlide = useCallback(
		(index: number) => {
			setCurrentSlide(index);
			resetAutoPlay();
		},
		[resetAutoPlay]
	);

	const goNext = useCallback(() => {
		setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
		resetAutoPlay();
	}, [resetAutoPlay]);

	const goPrev = useCallback(() => {
		setCurrentSlide(
			(prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
		);
		resetAutoPlay();
	}, [resetAutoPlay]);

	// ─── Auto-play ───────────────────────────────────────────────────────

	useEffect(() => {
		resetAutoPlay();
		return () => {
			if (autoPlayRef.current) clearInterval(autoPlayRef.current);
		};
	}, [resetAutoPlay]);

	// ─── Drag / Swipe handlers ───────────────────────────────────────────

	const getClientX = (
		e: React.TouchEvent | React.MouseEvent
	): number => {
		if ("touches" in e) return e.touches[0].clientX;
		return e.clientX;
	};

	const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
		dragStartX.current = getClientX(e);
		isDragging.current = true;
	};

	const handleDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
		if (!isDragging.current || dragStartX.current === null) return;
		isDragging.current = false;

		const endX =
			"changedTouches" in e
				? e.changedTouches[0].clientX
				: e.clientX;
		const delta = endX - dragStartX.current;
		dragStartX.current = null;

		if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;

		if (delta < 0) goNext(); // swipe left → next
		else goPrev(); // swipe right → prev
	};

	const handleDragCancel = () => {
		isDragging.current = false;
		dragStartX.current = null;
	};

	// ─── Render ──────────────────────────────────────────────────────────

	const slide = HERO_SLIDES[currentSlide];

	return (
		<section
			className="relative h-[60vh] min-h-210 cursor-grab overflow-hidden bg-foreground select-none active:cursor-grabbing"
			onMouseDown={handleDragStart}
			onMouseUp={handleDragEnd}
			onMouseLeave={handleDragCancel}
			onTouchStart={handleDragStart}
			onTouchEnd={handleDragEnd}
			onTouchCancel={handleDragCancel}
		>
			{/* Slides */}
			{HERO_SLIDES.map((s, index) => (
				<div
					key={s.id}
					className={cn(
						"absolute inset-0 transition-opacity duration-700",
						index === currentSlide
							? "opacity-100"
							: "opacity-0 pointer-events-none"
					)}
				>
					<Image
						src={s.image}
						alt={s.title}
						fill
						sizes="100vw"
						className="pointer-events-none object-cover"
						priority={index === 0}
						draggable={false}
					/>
					<div className="absolute inset-0 bg-foreground/40" />
				</div>
			))}

			{/* Content */}
			<div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
				<h1
					key={slide.id}
					className="animate-in fade-in slide-in-from-bottom-4 text-4xl font-bold tracking-wider text-background duration-500 md:text-6xl lg:text-7xl"
				>
					{slide.title}
				</h1>

				<p className="mt-4 max-w-lg text-lg text-background/80">
					{slide.subtitle}
				</p>

				<Button
					size="lg"
					asChild
					className="mt-8"
				>
					<Link href={slide.href}>{slide.ctaLabel}</Link>
				</Button>
			</div>

			{/* Dot Indicators */}
			<div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
				{HERO_SLIDES.map((s, index) => (
					<button
						key={s.id}
						onClick={() => goToSlide(index)}
						aria-label={`Go to slide ${index + 1}`}
						className={cn(
							"h-2.5 rounded-full transition-all",
							index === currentSlide
								? "w-8 bg-primary"
								: "w-2.5 bg-background/50 hover:bg-background/80"
						)}
					/>
				))}
			</div>
		</section>
	);
}

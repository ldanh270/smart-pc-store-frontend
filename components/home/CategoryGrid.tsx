"use client";

import Link from "next/link";
import {
	Cpu,
	Monitor,
	MemoryStick,
	HardDrive,
	CircuitBoard,
	Gamepad2,
	Laptop,
	MonitorDot,
} from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import type { Category } from "@/types/category";
import { generateCategorySlug } from "@/types/category";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

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
};

interface CategoryGridProps {
	categories?: Category[];
}

export default function CategoryGrid({ categories = [] }: CategoryGridProps) {
	return (
		<section className="bg-background py-16">
			<div className="mx-auto max-w-7xl px-4 lg:px-8">
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
					className="w-full relative"
				>
					<CarouselContent className="-ml-2 md:-ml-4">
					{categories.map((category, index) => {
						// Extract icon name from description or fallback to array index based icons since BE doesn't store icon name.
						const iconKeys = Object.keys(ICON_MAP);
						const Icon = ICON_MAP[iconKeys[index % iconKeys.length]] ?? Cpu;
						const href = `/danh-muc/${generateCategorySlug(category.name)}`;

						return (
							<CarouselItem key={category.id} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/4 lg:basis-1/8">
								<Link
									href={href}
									className="group flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 h-40"
								>
								<div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
									<Icon className="size-6" />
								</div>
								<div className="text-center">
									<p className="text-sm font-semibold text-foreground line-clamp-2">
										{category.name}
									</p>
									{category.description && (
										<p className="mt-0.5 hidden text-xs text-muted-foreground lg:block line-clamp-1">
											{category.description}
										</p>
									)}
								</div>
								</Link>
							</CarouselItem>
						);
					})}
					</CarouselContent>
					<div className="hidden sm:block">
						<CarouselPrevious className="-left-4 lg:-left-12" />
						<CarouselNext className="-right-4 lg:-right-12" />
					</div>
				</Carousel>
			</div>
		</section>
	);
}

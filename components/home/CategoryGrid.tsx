"use client";

import Link from "next/link";
import {
	Cpu, Monitor, MemoryStick, HardDrive,
	CircuitBoard, Gamepad2, Laptop, MonitorDot,
	Wind, Speaker, Mouse, Keyboard,
} from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import type { Category } from "@/types/category";
import { generateCategorySlug } from "@/types/category";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
	Cpu, Monitor, MemoryStick, HardDrive,
	CircuitBoard, Gamepad2, Laptop, MonitorDot,
	Wind, Speaker, Mouse, Keyboard,
};

// Colors from global.css
const CATEGORY_COLORS = [
	{ bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20", hover: "hover:bg-blue-500/20" },
	{ bg: "bg-indigo-500/10", text: "text-indigo-500", border: "border-indigo-500/20", hover: "hover:bg-indigo-500/20" },
	{ bg: "bg-violet-500/10", text: "text-violet-500", border: "border-violet-500/20", hover: "hover:bg-violet-500/20" },
	{ bg: "bg-cyan-500/10", text: "text-cyan-500", border: "border-cyan-500/20", hover: "hover:bg-cyan-500/20" },
	{ bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20", hover: "hover:bg-emerald-500/20" },
	{ bg: "bg-rose-500/10", text: "text-rose-500", border: "border-rose-500/20", hover: "hover:bg-rose-500/20" },
	{ bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20", hover: "hover:bg-amber-500/20" },
	{ bg: "bg-sky-500/10", text: "text-sky-500", border: "border-sky-500/20", hover: "hover:bg-sky-500/20" },
];

interface CategoryGridProps {
	categories?: Category[];
}

export default function CategoryGrid({ categories = [] }: CategoryGridProps) {
	const iconKeys = Object.keys(ICON_MAP);

	return (
		<section className="py-16">
			<div className="mx-auto max-w-7xl px-4 lg:px-8">
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
					<div className="space-y-2">
						<h3 className="text-sm font-bold uppercase tracking-widest text-primary">Explore Our World</h3>
						<h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">Danh Mục Sản Phẩm</h2>
						<p className="text-muted-foreground text-lg max-w-2xl">
							Tìm kiếm linh kiện và thiết bị phù hợp với nhu cầu của bạn từ hệ thống danh mục đa dạng.
						</p>
					</div>
					<Link 
						href="/san-pham" 
						className="text-primary font-bold hover:underline underline-offset-4 decoration-2"
					>
						Xem tất cả →
					</Link>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
					{categories.slice(0, 12).map((category, index) => {
						const Icon = ICON_MAP[iconKeys[index % iconKeys.length]] ?? Cpu;
						const href = `/danh-muc/${generateCategorySlug(category.name)}`;
						const colors = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

						return (
							<Link
								key={category.id}
								href={href}
								className={cn(
									"group flex flex-col items-center justify-center p-8 rounded-3xl border-2 transition-all duration-300",
									"hover:shadow-2xl hover:-translate-y-2",
									colors.bg, colors.border, colors.hover
								)}
							>
								<div className={cn(
									"mb-4 p-4 rounded-2xl bg-white dark:bg-black/20 shadow-sm transition-transform group-hover:scale-110",
									colors.text
								)}>
									<Icon size={32} strokeWidth={2} />
								</div>
								<span className="text-sm font-black text-center text-foreground leading-tight group-hover:text-primary transition-colors">
									{category.name}
								</span>
								<span className="mt-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
									Shop Now
								</span>
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
}

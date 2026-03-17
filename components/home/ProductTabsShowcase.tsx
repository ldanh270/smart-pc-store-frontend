"use client";

import { useState } from "react";
import { type Product } from "@/types/product";
import ProductCard from "@/components/shared/ProductCard";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProductTabsShowcaseProps {
	bestDeals: Product[];
	forYou: Product[];
	editorsPick: Product[];
}

export default function ProductTabsShowcase({
	bestDeals,
	forYou,
	editorsPick,
}: ProductTabsShowcaseProps) {
	const [activeTab, setActiveTab] = useState<"bestDeals" | "forYou" | "editorsPick">("bestDeals");

	const TABS = [
		{ id: "bestDeals", label: "Best Deals" },
		{ id: "forYou", label: "Recommended" },
		{ id: "editorsPick", label: "Editor's Pick" },
	] as const;

	const products = 
		activeTab === "bestDeals" ? bestDeals :
		activeTab === "forYou" ? forYou :
		editorsPick;

	return (
		<div className="space-y-12 py-10">
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/40 pb-8">
				<div className="space-y-3">
					<h3 className="text-sm font-bold uppercase tracking-widest text-primary">Limited Offers</h3>
					<h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">Best Deals</h2>
				</div>
				
				<div className="flex items-center gap-8 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
					{TABS.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={cn(
								"whitespace-nowrap text-lg font-black transition-all relative py-2",
								activeTab === tab.id 
									? "text-primary scale-110" 
									: "text-muted-foreground hover:text-foreground"
							)}
						>
							{tab.label}
							{activeTab === tab.id && (
								<span className="absolute -bottom-8 md:-bottom-[2.125rem] left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-4px_12px_rgba(14,165,233,0.4)]" />
							)}
						</button>
					))}
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
				{products.slice(0, 8).map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			<div className="flex justify-center pt-8">
				<Link 
					href="/san-pham"
					className="group flex items-center gap-2 px-10 py-5 rounded-full bg-foreground text-background font-black text-sm uppercase tracking-widest hover:bg-primary transition-all duration-300 hover:shadow-2xl"
				>
					Xem Thêm Sản Phẩm
					<span className="transition-transform group-hover:translate-x-2">→</span>
				</Link>
			</div>
		</div>
	);
}

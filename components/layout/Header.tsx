"use client";

import { useEffect, useState } from "react";
import TopBar from "@/components/header/TopBar";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";

interface HeaderProps {
	initialCategories?: Category[];
}

export default function Header({ initialCategories = [] }: HeaderProps) {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handler = () => setScrolled(window.scrollY > 12);
		window.addEventListener("scroll", handler, { passive: true });
		handler();
		return () => window.removeEventListener("scroll", handler);
	}, []);

	return (
		<header
			className={cn(
				"sticky top-0 z-40 w-full transition-all duration-300",
				scrolled
					? "border-b border-border/60 bg-background/85 shadow-lg shadow-black/5 backdrop-blur-xl"
					: "border-b border-transparent bg-background/60 backdrop-blur-md"
			)}
		>
			<TopBar scrolled={scrolled} initialCategories={initialCategories} />
		</header>
	);
}

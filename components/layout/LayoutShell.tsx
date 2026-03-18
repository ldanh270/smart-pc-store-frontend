"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AIChatBox from "@/components/chat/AIChatBox";
import type { Category } from "@/types/category";

interface LayoutShellProps {
	children: React.ReactNode;
	initialCategories?: Category[];
}

export default function LayoutShell({ children, initialCategories = [] }: LayoutShellProps) {
	const pathname = usePathname();
	const isAdmin = pathname.startsWith("/admin");

	if (isAdmin) {
		return <>{children}</>;
	}

	return (
		<div className="flex min-h-screen flex-col">
			<Header initialCategories={initialCategories} />
			<div className="flex flex-1 flex-col">
				{children}
			</div>
			<Footer />
			<AIChatBox />
		</div>
	);
}

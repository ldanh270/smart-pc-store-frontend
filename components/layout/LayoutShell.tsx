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
		<>
			<Header initialCategories={initialCategories} />
			{children}
			<Footer />
			<AIChatBox />
		</>
	);
}

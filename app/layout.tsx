import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import LayoutShell from "@/components/layout/LayoutShell";
import AuthInitializer from "@/components/AuthInitializer";
import { Toaster } from "sonner";
import { fetchAllCategories } from "@/lib/api/categories";
import { mapBackendCategory, type Category } from "@/types/category";
import "./globals.css";

// Main font (Inter) - Used for UI, Title, Description
const inter = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
	display: "swap",
});

// Font Mono (JetBrains Mono) - Used for Price, Technical Specifications
const jetbrainsMono = JetBrains_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
	display: "swap",
});

// SEO metadata
export const metadata: Metadata = {
	title: "Smart PC Store | Hi-end PC & Gaming Gear",
	description: "Smart PC Store is a high-end PC and gaming gear store.",
	icons: { icon: "/logo.svg" },
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// Fetch categories server-side so nav links are in the SSR HTML (SEO fix #1)
	let initialCategories: Category[] = [];
	try {
		const backend = await fetchAllCategories();
		initialCategories = backend.map(mapBackendCategory);
	} catch {
		// Graceful degradation — nav still renders with static links
	}

	return (
		<html
			lang="en"
			suppressHydrationWarning
		>
			<body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
				<AuthInitializer />
				<LayoutShell>{children}</LayoutShell>
				<Toaster richColors position="bottom-right" />
			</body>
		</html>
	);
}

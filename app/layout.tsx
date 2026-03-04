import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import LayoutShell from "@/components/layout/LayoutShell";
import { Toaster } from "sonner";
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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
		>
			<body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
				<AuthProvider>
					<LayoutShell>{children}</LayoutShell>
				</AuthProvider>
				<Toaster richColors position="top-right" />
			</body>
		</html>
	);
}

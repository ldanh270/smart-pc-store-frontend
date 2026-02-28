import type { Metadata } from "next";
import Link from "next/link";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import LoginForm from "./_components/LoginForm";

export const metadata: Metadata = {
	title: "Đăng nhập | Smart PC Store",
	description:
		"Đăng nhập vào tài khoản Smart PC Store để mua sắm PC và gaming gear cao cấp.",
};

export default function LoginPage() {
	return (
		<main className="relative flex min-h-svh items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
			{/* Subtle background pattern */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.03]"
				style={{
					backgroundImage:
						"radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
					backgroundSize: "32px 32px",
				}}
				aria-hidden="true"
			/>

			<Card className="relative z-10 w-full max-w-md border-border/60 shadow-lg backdrop-blur-sm">
				<CardHeader className="items-center text-center">
					<CardTitle className="font-sans text-2xl font-bold tracking-tight text-foreground">
						Đăng nhập
					</CardTitle>
					<CardDescription className="font-sans text-muted-foreground">
						Đăng nhập để tiếp tục mua sắm
					</CardDescription>
				</CardHeader>

				<CardContent>
					<LoginForm />
				</CardContent>

				<CardFooter className="flex-col gap-2 text-center">
					<p className="text-sm font-sans text-muted-foreground">
						Chưa có tài khoản?{" "}
						<Link
							href="/signup"
							className="font-semibold text-primary hover:text-primary/80 transition-colors"
							id="signup-link"
						>
							Đăng ký
						</Link>
					</p>
				</CardFooter>
			</Card>
		</main>
	);
}

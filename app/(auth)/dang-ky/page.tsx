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
import SignupForm from "./_components/SignupForm";

export const metadata: Metadata = {
	title: "Đăng ký | Smart PC Store",
	description:
		"Tạo tài khoản Smart PC Store để mua sắm PC và gaming gear cao cấp.",
};

export default function SignupPage() {
	return (
		<main className="relative flex min-h-svh items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
			<Card className="relative z-10 w-full max-w-md border-border/60 shadow-lg backdrop-blur-sm">
				<CardHeader className="items-center text-center">
					<CardTitle className="font-sans text-2xl font-bold tracking-tight text-foreground">
						Tạo tài khoản
					</CardTitle>
					<CardDescription className="font-sans text-muted-foreground">
						Đăng ký để bắt đầu mua sắm
					</CardDescription>
				</CardHeader>

				<CardContent>
					<SignupForm />
				</CardContent>

				<CardFooter className="flex-col gap-2 text-center">
					<p className="text-sm font-sans text-muted-foreground">
						Đã có tài khoản?{" "}
						<Link
							href="/dang-nhap"
							className="font-semibold text-primary hover:text-primary/80 transition-colors"
							id="login-link"
						>
							Đăng nhập
						</Link>
					</p>
				</CardFooter>
			</Card>
		</main>
	);
}

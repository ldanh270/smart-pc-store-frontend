"use client";

import Link from "next/link";
import { Zap } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import AuthButtons from "./AuthButtons";
import UserMenu from "./UserMenu";
import CartButton from "./CartButton";
import SearchDialog from "./SearchDialog";
import { cn } from "@/lib/utils";

interface TopBarProps {
	scrolled?: boolean;
	initialCategories?: any[];
}

export default function TopBar({ scrolled, initialCategories = [] }: TopBarProps) {
	const accessToken = useAuthStore((state) => state.accessToken);
	const isLoggedIn = !!accessToken;

	return (
		<div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 lg:gap-6 lg:px-8">
			{/* Logo */}
			<Link
				href="/"
				className="group flex shrink-0 items-center gap-2.5"
			>
				<div className={cn(
					"flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300",
					"bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110",
				)}>
					<Zap className="size-4.5 text-primary" fill="currentColor" />
				</div>
				<span className="text-xl font-bold tracking-tight">
					<span className="text-foreground">Smart</span>
					<span className="text-foreground"> PC</span>
				</span>
			</Link>

			{/* Search — grows to fill space */}
			<div className="min-w-0 flex-1">
				<SearchDialog triggerMode="bar" initialCategories={initialCategories} />
			</div>

			{/* Actions */}
			<div className="flex shrink-0 items-center gap-1.5 lg:gap-2">
				<CartButton />
				{isLoggedIn ? <UserMenu /> : <AuthButtons />}
			</div>
		</div>
	);
}

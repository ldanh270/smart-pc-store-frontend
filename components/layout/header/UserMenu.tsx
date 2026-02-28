"use client";

import Link from "next/link";
import { User, Package, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

export default function UserMenu() {
	const { user, logout } = useAuth();

	return (
		<div className="group relative">
			<Button
				variant="ghost"
				size="icon"
				aria-label="Tài khoản"
			>
				<User className="size-5" />
			</Button>

			{/* Hover Popup */}
			<div className="invisible absolute right-0 top-full z-50 min-w-52 rounded-md border border-border bg-popover p-1 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
				{/* User Info */}
				<div className="px-3 py-2">
					<p className="text-sm font-semibold text-foreground">
						{user?.name}
					</p>
					<p className="text-xs text-muted-foreground">
						{user?.email}
					</p>
				</div>

				<Separator className="my-1" />

				{/* Menu Items */}
				<Link
					href="/tai-khoan"
					className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
				>
					<User className="size-4" />
					Tài Khoản
				</Link>

				<Link
					href="/don-hang"
					className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
				>
					<Package className="size-4" />
					Đơn Hàng
				</Link>

				<Separator className="my-1" />

				<button
					onClick={logout}
					className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
				>
					<LogOut className="size-4" />
					Đăng Xuất
				</button>
			</div>
		</div>
	);
}

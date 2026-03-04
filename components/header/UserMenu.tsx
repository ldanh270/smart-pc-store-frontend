"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { useAuthStore } from "@/stores/useAuthStore";
import { getRoleFromJwt } from "@/lib/jwt";

export default function UserMenu() {
	const { user, accessToken, logout } = useAuthStore();

	const isAdmin = getRoleFromJwt(accessToken) === "ADMIN";

	return (
		<div className="group relative py-4">
			<Link
				href={user ? "/tai-khoan" : "/login"}
				className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
			>
				TÀI KHOẢN
			</Link>

			{/* Hover Popup */}
			<div className="invisible absolute left-1/2 top-full z-50 mt-1 min-w-48 -translate-x-1/2 rounded-md border border-border bg-popover p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
				{/* Pointer arrow */}
				<div className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t border-border bg-popover" />

				<div className="relative z-10 bg-popover">
					{/* Menu Items */}
					<Link
						href="/tai-khoan"
						className="block rounded-sm px-3 py-2 text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground uppercase"
					>
						XIN CHÀO, {user?.name?.toUpperCase() || "BẠN"}
					</Link>

					{isAdmin && (
						<Link
							href="/admin"
							className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground uppercase"
						>
							<ShieldCheck className="size-3.5" />
							QUẢN LÍ
						</Link>
					)}

					<button
						onClick={logout}
						className="block w-full rounded-sm px-3 py-2 text-left text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground uppercase"
					>
						ĐĂNG XUẤT
					</button>
				</div>
			</div>
		</div>
	);
}

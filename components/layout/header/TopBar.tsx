"use client";

import Link from "next/link";
import { Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACTS } from "@/configs/Contacts";
import { useAuth } from "@/contexts/AuthContext";
import AuthButtons from "./AuthButtons";
import UserMenu from "./UserMenu";
import CartButton from "./CartButton";

export default function TopBar() {
	const { isLoggedIn } = useAuth();

	return (
		<div className="bg-background">
			<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-8">
				{/* Hotline */}
				<Link
					href={`tel:${CONTACTS.phone}`}
					className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
				>
					<Phone className="size-4" />
					<span className="hidden sm:inline">Hotline tư vấn:</span>
					<span className="font-semibold text-foreground">
						{CONTACTS.phone}
					</span>
				</Link>

				{/* Logo + Brand */}
				<Link
					href="/"
					className="flex items-center gap-2"
				>
					<span className="text-xl font-bold tracking-wider text-primary">
						SMART PC STORE
					</span>
				</Link>

				{/* Actions — conditional on auth state */}
				<div className="flex items-center gap-1">
					{isLoggedIn ? (
						<>
							<UserMenu />
							<CartButton />
						</>
					) : (
						<AuthButtons />
					)}

					<Button
						variant="ghost"
						size="icon"
						aria-label="Tìm kiếm"
					>
						<Search className="size-5" />
					</Button>
				</div>
			</div>
		</div>
	);
}

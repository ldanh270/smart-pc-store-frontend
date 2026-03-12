"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { CONTACTS } from "@/configs/Contacts";
import { useAuthStore } from "@/stores/useAuthStore";
import AuthButtons from "./AuthButtons";
import UserMenu from "./UserMenu";
import CartButton from "./CartButton";
import SearchDialog from "./SearchDialog";

export default function TopBar() {
	const user = useAuthStore((state) => state.user);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const isLoggedIn = mounted && !!user;

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

					<SearchDialog />
				</div>
			</div>
		</div>
	);
}

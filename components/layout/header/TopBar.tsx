import Image from "next/image";
import Link from "next/link";
import { Phone, User, ShoppingCart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACTS } from "@/configs/Contacts";


export function TopBar() {
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
					<span className="font-semibold text-foreground">{CONTACTS.phone}</span>
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

				{/* Action Icons */}
				<div className="flex items-center gap-1">
					<Button
						variant="ghost"
						size="icon"
						asChild
					>
						<Link
							href="/tai-khoan"
							aria-label="Tài khoản"
						>
							<User className="size-5" />
						</Link>
					</Button>

					<Button
						variant="ghost"
						size="icon"
						asChild
						className="relative"
					>
						<Link
							href="/gio-hang"
							aria-label="Giỏ hàng"
						>
							<ShoppingCart className="size-5" />
							<span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
								0
							</span>
						</Link>
					</Button>

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

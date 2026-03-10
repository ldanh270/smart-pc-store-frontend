import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CONTACTS } from "@/configs/Contacts";

const QUICK_LINKS = [
	{ label: "Trang Chủ", href: "/" },
	{ label: "Về Chúng Tôi", href: "/ve-chung-toi" },
	{ label: "Linh Kiện PC", href: "/linh-kien" },
	{ label: "PC & Laptop", href: "/pc-laptop" },
	{ label: "Phụ Kiện", href: "/phu-kien" },
	{ label: "Tin Tức", href: "/tin-tuc" },
];

const SUPPORT_LINKS = [
	{ label: "Chính sách bảo hành", href: "/chinh-sach-bao-hanh" },
	{ label: "Chính sách đổi trả", href: "/chinh-sach-doi-tra" },
	{ label: "Hướng dẫn mua hàng", href: "/huong-dan-mua-hang" },
	{ label: "Hướng dẫn thanh toán", href: "/huong-dan-thanh-toan" },
	{ label: "Liên hệ", href: "/lien-he" },
];

export default function Footer() {
	return (
		<footer className="border-t border-border bg-foreground text-background">
			<div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
					{/* Brand */}
					<div className="space-y-4">
						<Link
							href="/"
							className="text-xl font-bold tracking-wider text-primary"
						>
							SMART PC STORE
						</Link>
						<p className="text-sm text-background/60">
							Cửa hàng PC và linh kiện máy tính uy tín tại Việt
							Nam. Cam kết hàng chính hãng, giá tốt nhất.
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-background/80">
							Liên Kết Nhanh
						</h3>
						<ul className="space-y-2">
							{QUICK_LINKS.map((link) => (
								<li key={link.href}>
									<Link
										href={"#"}
										className="text-sm text-background/60 transition-colors hover:text-primary"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Support */}
					<div>
						<h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-background/80">
							Hỗ Trợ Khách Hàng
						</h3>
						<ul className="space-y-2">
							{SUPPORT_LINKS.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-background/60 transition-colors hover:text-primary"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-background/80">
							Liên Hệ
						</h3>
						<ul className="space-y-3">
							<li>
								<a
									href={`tel:${CONTACTS.phone}`}
									className="flex items-center gap-2 text-sm text-background/60 transition-colors hover:text-primary"
								>
									<Phone className="size-4 shrink-0" />
									{CONTACTS.phone}
								</a>
							</li>
							<li>
								<a
									href={`mailto:${CONTACTS.email}`}
									className="flex items-center gap-2 text-sm text-background/60 transition-colors hover:text-primary"
								>
									<Mail className="size-4 shrink-0" />
									{CONTACTS.email}
								</a>
							</li>
							<li className="flex items-start gap-2 text-sm text-background/60">
								<MapPin className="mt-0.5 size-4 shrink-0" />
								Đà Nẵng, Việt Nam
							</li>
						</ul>
					</div>
				</div>

				<Separator className="my-8 bg-background/10" />

				{/* Copyright */}
				<p className="text-center text-xs text-background/40">
					© {new Date().getFullYear()} Smart PC Store. All rights
					reserved.
				</p>
			</div>
		</footer>
	);
}

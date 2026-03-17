import Link from "next/link";
import { Mail, Phone, MapPin, Zap, Github, Facebook, Youtube, ArrowRight, Instagram, Linkedin, Twitter } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faGooglePlay } from "@fortawesome/free-brands-svg-icons";
import { CONTACTS } from "@/configs/Contacts";

const QUICK_LINKS = [
	{ label: "Trang Chủ", href: "/" },
	{ label: "Tất cả sản phẩm", href: "/san-pham" },
	{ label: "Danh mục", href: "/danh-muc" },
	{ label: "Về Chúng Tôi", href: "/ve-chung-toi" },
];

const SUPPORT_LINKS = [
	{ label: "Chính sách bảo hành", href: "/chinh-sach-bao-hanh" },
	{ label: "Chính sách đổi trả", href: "/chinh-sach-doi-tra" },
	{ label: "Hướng dẫn mua hàng", href: "/huong-dan-mua-hang" },
	{ label: "Hướng dẫn thanh toán", href: "/huong-dan-thanh-toan" },
	{ label: "Liên hệ hỗ trợ", href: "/lien-he" },
];



export default function Footer() {
	return (
		<footer className="relative overflow-hidden border-t border-border/40 bg-foreground text-background">
			{/* Grid lines */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.04]"
				style={{
					backgroundImage: `linear-gradient(var(--background) 1px, transparent 1px), linear-gradient(90deg, var(--background) 1px, transparent 1px)`,
					backgroundSize: "80px 80px",
				}}
			/>

			<div className="relative z-10 mx-auto max-w-8xl px-4 lg:px-8">
				{/* ── Main grid ── */}
				<div className="grid gap-10 py-3 pt-10 md:grid-cols-2 lg:grid-cols-12">

					{/* Brand — 4 cols */}
					<div className="space-y-5 lg:col-span-4 xl:col-span-4 lg:pr-8">
						<Link href="/" className="group inline-flex items-center gap-2.5">
							<div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 transition-colors group-hover:bg-primary/25">
								<Zap className="size-5 text-primary" fill="currentColor" />
							</div>
							<span className="text-xl font-black tracking-tight text-background">
								Smart <span className="text-primary">PC</span> Store
							</span>
						</Link>

						<p className="text-sm leading-relaxed text-background/60 max-w-xs">
							Cửa hàng linh kiện máy tính & PC gaming uy tín tại Việt Nam.
							Cam kết hàng chính hãng, giá tốt, giao hàng nhanh.
						</p>



						{/* Contact quick */}
						<div className="space-y-2">
							<a href={`tel:${CONTACTS.phone}`} className="flex items-center gap-2 text-sm text-background/60 transition-colors hover:text-primary">
								<Phone className="size-3.5 text-primary/70" />
								{CONTACTS.phone}
							</a>
							<a href={`mailto:${CONTACTS.email}`} className="flex items-center gap-2 text-sm text-background/60 transition-colors hover:text-primary">
								<Mail className="size-3.5 text-primary/70" />
								{CONTACTS.email}
							</a>
							<div className="flex items-center gap-2 text-sm text-background/60">
								<MapPin className="size-3.5 text-primary/70 shrink-0" />
								Đà Nẵng, Việt Nam
							</div>
						</div>
					</div>

					{/* Quick Links — 2 cols */}
					<div className="lg:col-span-2">
						<h3 className="mb-5 text-xs font-bold uppercase tracking-[0.15em] text-background/50">
							Điều Hướng
						</h3>
						<ul className="space-y-3">
							{QUICK_LINKS.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="group flex items-center gap-1.5 text-sm text-background/70 transition-colors hover:text-primary"
									>
										<ArrowRight className="size-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Support — 2 cols */}
					<div className="lg:col-span-2 xl:col-span-2">
						<h3 className="mb-5 text-xs font-bold uppercase tracking-[0.15em] text-background/50">
							Hỗ Trợ
						</h3>
						<ul className="space-y-3">
							{SUPPORT_LINKS.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="group flex items-center gap-1.5 text-sm text-background/70 transition-colors hover:text-primary"
									>
										<ArrowRight className="size-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* App & Social */}
					<div className="lg:col-span-4 xl:col-span-4 space-y-6">
						<div>
							<h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-background/50">
								FOLLOW US
							</h3>
							<div className="flex items-center gap-2">
								<a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffeadd] text-[#ff5722] transition-transform hover:scale-105">
									<Youtube className="size-5" />
								</a>
								<a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/5 text-background/60 transition-all hover:bg-background/10 hover:text-background hover:scale-105">
									<Linkedin className="size-5" />
								</a>
								<a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/5 text-background/60 transition-all hover:bg-background/10 hover:text-background hover:scale-105">
									<Twitter className="size-5" />
								</a>
								<a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/5 text-background/60 transition-all hover:bg-background/10 hover:text-background hover:scale-105">
									<Facebook className="size-5" />
								</a>
								<a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/5 text-background/60 transition-all hover:bg-background/10 hover:text-background hover:scale-105">
									<Instagram className="size-5" />
								</a>
							</div>
						</div>

						<div>
							<h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-background/50">
								DOWNLOAD APP
							</h3>
							<div className="flex flex-col gap-2 xl:flex-row">
								<a href="#" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#222222] px-3 py-2 text-white transition hover:bg-black xl:justify-start whitespace-nowrap">
									<FontAwesomeIcon icon={faApple} className="text-2xl" />
									<div className="flex flex-col text-left">
										<span className="text-[10px] leading-tight text-gray-400">Download on the</span>
										<span className="text-sm font-semibold leading-tight">App Store</span>
									</div>
								</a>
								<a href="#" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#222222] px-3 py-2 text-white transition hover:bg-black xl:justify-start whitespace-nowrap">
									<FontAwesomeIcon icon={faGooglePlay} className="text-xl" />
									<div className="flex flex-col text-left">
										<span className="text-[10px] leading-tight text-gray-400">GET IT ON</span>
										<span className="text-sm font-semibold leading-tight">Google Play</span>
									</div>
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* ── Bottom bar ── */}
				<div className="flex items-center justify-center border-t border-background/10 mt-6 py-4 text-xs text-background/40">
					<p>© {new Date().getFullYear()} Smart PC Store. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}

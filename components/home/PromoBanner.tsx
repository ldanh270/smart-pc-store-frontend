import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Truck, Headset } from "lucide-react";

const STATS = [
	{ icon: Zap,     value: "10,000+", label: "Khách hàng tin dùng" },
	{ icon: Shield,  value: "100%",    label: "Hàng chính hãng" },
	{ icon: Truck,   value: "24h",     label: "Giao hàng nhanh" },
	{ icon: Headset, value: "24/7",    label: "Hỗ trợ kỹ thuật" },
];

export default function PromoBanner() {
	return (
		<section className="relative overflow-hidden py-20 md:py-28">
			{/* ── Deep dark background with mesh gradient ── */}
			<div className="absolute inset-0 bg-mesh-blue" />

			{/* Noise texture */}
			<div
				className="absolute inset-0 opacity-[0.04]"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
				}}
			/>

			{/* Grid pattern */}
			<div
				className="absolute inset-0 opacity-[0.06]"
				style={{
					backgroundImage: `linear-gradient(oklch(1 0 0 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.5) 1px, transparent 1px)`,
					backgroundSize: "60px 60px",
				}}
			/>

			{/* Glow orbs */}
			<div className="pointer-events-none absolute left-1/4 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 blur-[100px]" />
			<div className="pointer-events-none absolute right-1/4 bottom-0 h-56 w-56 translate-x-1/2 translate-y-1/2 rounded-full bg-primary/20 blur-[80px]" />

			{/* ── Content ── */}
			<div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-8">
				<div className="flex flex-col items-center text-center">
					{/* Badge */}
					<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 backdrop-blur-sm">
						<Zap className="h-3.5 w-3.5 text-primary fill-primary" />
						<span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/80">
							Flash Sale đang diễn ra
						</span>
					</div>

					{/* Heading */}
					<h2 className="max-w-3xl text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
						Ưu Đãi Tháng 3 —
						<br />
						<span className="text-gradient">Giảm Đến 20%</span>
					</h2>

					<p className="mt-5 max-w-xl text-lg text-white/60 leading-relaxed">
						Chương trình khuyến mãi đặc biệt cho tất cả PC Gaming build sẵn
						và combo linh kiện cao cấp. Số lượng có hạn!
					</p>

					{/* CTA */}
					<div className="mt-8 flex flex-wrap justify-center gap-3">
						<Button
							size="lg"
							asChild
							className="group gap-2 rounded-full px-8 font-semibold shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all"
						>
							<Link href="/san-pham">
								Mua Sắm Ngay
								<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
							</Link>
						</Button>
						<Button
							size="lg"
							variant="outline"
							asChild
							className="rounded-full px-8 font-semibold border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/15 hover:border-white/30 transition-all"
						>
							<Link href="/ve-chung-toi">Về chúng tôi</Link>
						</Button>
					</div>
				</div>

				{/* ── Stats row ── */}
				<div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
					{STATS.map(({ icon: Icon, value, label }) => (
						<div
							key={label}
							className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/8"
						>
							<Icon className="h-5 w-5 text-primary" />
							<span className="text-2xl font-black text-white md:text-3xl">{value}</span>
							<span className="text-center text-xs text-white/50 font-medium">{label}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

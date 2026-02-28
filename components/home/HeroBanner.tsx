import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Cpu, Zap } from "lucide-react";

export default function HeroBanner() {
	return (
		<section className="relative overflow-hidden bg-foreground">
			{/* Background Pattern */}
			<div className="absolute inset-0 opacity-5">
				<div className="absolute left-1/4 top-1/4 size-96 rounded-full bg-primary blur-3xl" />
				<div className="absolute bottom-1/4 right-1/4 size-64 rounded-full bg-primary blur-3xl" />
			</div>

			<div className="relative mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center gap-8 px-4 py-20 text-center lg:px-8">
				{/* Badge */}
				<div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
					<Zap className="size-4 text-primary" />
					<span className="text-sm font-medium text-primary">
						Hiệu năng không giới hạn
					</span>
				</div>

				{/* Headline */}
				<h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-background md:text-5xl lg:text-6xl">
					Build PC Gaming
					<span className="text-primary"> Trong Mơ </span>
					Của Bạn
				</h1>

				{/* Tagline */}
				<p className="max-w-xl text-lg text-background/70">
					Linh kiện chính hãng, PC build sẵn hiệu năng cao, và phụ
					kiện gaming premium. Tư vấn miễn phí từ đội ngũ chuyên gia.
				</p>

				{/* CTAs */}
				<div className="flex flex-wrap items-center justify-center gap-4">
					<Button
						size="lg"
						asChild
					>
						<Link href="/pc-laptop/pc-gaming">
							<Cpu className="size-5" />
							Xem PC Gaming
						</Link>
					</Button>
					<Button
						variant="outline"
						size="lg"
						asChild
						className="border-background/20 bg-transparent text-background hover:bg-background/10 hover:text-background"
					>
						<Link href="/linh-kien">
							Mua Linh Kiện
							<ArrowRight className="size-4" />
						</Link>
					</Button>
				</div>

				{/* Stats */}
				<div className="mt-4 flex flex-wrap items-center justify-center gap-8 text-background/50">
					<div className="text-center">
						<p className="font-mono text-2xl font-bold text-background">
							1,000+
						</p>
						<p className="text-xs">Sản phẩm</p>
					</div>
					<div className="h-8 w-px bg-background/20" />
					<div className="text-center">
						<p className="font-mono text-2xl font-bold text-background">
							5,000+
						</p>
						<p className="text-xs">Khách hàng</p>
					</div>
					<div className="h-8 w-px bg-background/20" />
					<div className="text-center">
						<p className="font-mono text-2xl font-bold text-background">
							100%
						</p>
						<p className="text-xs">Chính hãng</p>
					</div>
				</div>
			</div>
		</section>
	);
}

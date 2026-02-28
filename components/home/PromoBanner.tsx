import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Percent, ArrowRight } from "lucide-react";

export default function PromoBanner() {
	return (
		<section className="bg-primary py-16">
			<div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center lg:px-8">
				{/* Icon Badge */}
				<div className="flex size-14 items-center justify-center rounded-full bg-primary-foreground/20">
					<Percent className="size-7 text-primary-foreground" />
				</div>

				{/* Headline */}
				<h2 className="max-w-2xl text-3xl font-bold text-primary-foreground md:text-4xl">
					Ưu Đãi Tháng 3 — Giảm Đến 20%
				</h2>

				<p className="max-w-lg text-primary-foreground/80">
					Chương trình khuyến mãi đặc biệt cho tất cả PC Gaming build
					sẵn và combo linh kiện. Số lượng có hạn!
				</p>

				<Button
					size="lg"
					variant="secondary"
					asChild
				>
					<Link href="/khuyen-mai">
						Xem Khuyến Mãi
						<ArrowRight className="size-4" />
					</Link>
				</Button>
			</div>
		</section>
	);
}

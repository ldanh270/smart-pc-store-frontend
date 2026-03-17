import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function FigmaHero() {
	return (
		<div className="space-y-6">
			{/* Main Banner */}
			<div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 min-h-[400px] flex items-center p-8 md:p-12">
				<div className="relative z-10 w-full md:w-1/2 space-y-6">
					<h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight tracking-tight">
						Find devices that's <br /> right for you
					</h1>
					<p className="text-muted-foreground max-w-sm">
						Khám phá các thiết bị điện tử, linh kiện máy tính chất lượng cao với giá thành tốt nhất.
					</p>
					<div className="flex items-center gap-6">
						<div className="flex flex-col">
							<span className="text-xs text-muted-foreground font-semibold uppercase">Start From</span>
							<span className="text-3xl font-bold text-primary">$45.00</span>
						</div>
						<Button size="lg" className="rounded-full px-8 uppercase font-bold tracking-widest text-xs" asChild>
							<Link href="/san-pham">Learn More</Link>
						</Button>
					</div>
				</div>
				<div className="absolute right-0 top-1/2 -translate-y-1/2 w-2/3 h-full hidden md:block">
					<Image
						src="/hero/slide-pc-gaming.png" // Fallback to existing image since I don't have the exact smartwatch image
						alt="Hero Watch"
						fill
						className="object-contain object-right drop-shadow-2xl scale-125"
						priority
					/>
				</div>
			</div>

			{/* Sub Banners */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Banner 1 */}
				<Link href="/san-pham?category=camera" className="group relative overflow-hidden rounded-3xl bg-black aspect-[2/1] md:aspect-[4/3] lg:aspect-[16/9] flex flex-col justify-end p-6">
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10" />
					<div className="relative z-20 space-y-1 transition-transform duration-300 group-hover:-translate-y-2">
						<h3 className="text-white font-bold text-lg md:text-xl">Camera Lens</h3>
						<p className="text-white/70 text-xs">High quality lenses</p>
						<div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
							<span className="text-white font-bold">$50</span>
							<ArrowRight className="text-white size-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
						</div>
					</div>
				</Link>

				{/* Banner 2 */}
				<Link href="/san-pham?category=vr" className="group relative overflow-hidden rounded-3xl bg-black aspect-[2/1] md:aspect-[4/3] lg:aspect-[16/9] flex flex-col justify-end p-6">
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10" />
					<div className="relative z-20 space-y-1 transition-transform duration-300 group-hover:-translate-y-2">
						<h3 className="text-white font-bold text-lg md:text-xl">Virtual Reality Equipments</h3>
						<p className="text-white/70 text-xs">Immersive experience</p>
						<div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
							<span className="text-white font-bold">$450</span>
							<ArrowRight className="text-white size-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
						</div>
					</div>
				</Link>

				{/* Banner 3 */}
				<Link href="/san-pham?category=headphones" className="group relative overflow-hidden rounded-3xl bg-black aspect-[2/1] md:aspect-[4/3] lg:aspect-[16/9] flex flex-col justify-end p-6">
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10" />
					<div className="relative z-20 space-y-1 transition-transform duration-300 group-hover:-translate-y-2">
						<h3 className="text-white font-bold text-lg md:text-xl">Headphones</h3>
						<p className="text-white/70 text-xs">Premium sound quality</p>
						<div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
							<span className="text-white font-bold">$67</span>
							<ArrowRight className="text-white size-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
						</div>
					</div>
				</Link>
			</div>
		</div>
	);
}

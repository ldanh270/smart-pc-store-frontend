import { cn } from "@/lib/utils";

const BRANDS = [
	{ name: "AMD", logo: "/brands/amd.svg" },
	{ name: "NVIDIA", logo: "/brands/nvidia.svg" },
	{ name: "ASUS", logo: "/brands/asus.svg" },
	{ name: "MSI", logo: "/brands/msi.svg" },
  { name: "Gigabyte", logo: "/brands/gigabyte.svg" },
	{ name: "Samsung", logo: "/brands/samsung.svg" },
	{ name: "Intel", logo: "/brands/intel.svg" },
];

export default function BrandsList() {
	return (
		<div className="flex flex-col gap-10">
			<div className="flex flex-col items-center text-center space-y-3">
				<h3 className="text-xs font-bold uppercase tracking-[0.3em] text-primary/80">Đối tác hàng đầu</h3>
				<h2 className="text-2xl font-black text-foreground tracking-tight md:text-3xl">
					Thương Hiệu <span className="text-primary">Đồng Hành</span>
				</h2>
				<div className="h-1 w-14 rounded-full bg-linear-to-r from-primary to-transparent mt-2" />
			</div>

			<div className="flex flex-col gap-6 md:gap-10">
				{/* Row 1: 4 Brands */}
				<div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
					{BRANDS.slice(0, 4).map((brand) => (
						<div 
							key={brand.name} 
							className={cn(
								"group relative flex items-center justify-center py-4 px-6 min-w-30in-w-[160px]",
								"transition-all duration-500 hover:opacity-100 hover:scale-110 cursor-default"
							)}
						>
							<span className="text-xl md:text-3xl font-black tracking-tighter text-foreground transition-colors group-hover:text-primary">
								{brand.name}
							</span>
							<div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
						</div>
					))}
				</div>

				{/* Row 2: 3 Brands */}
				<div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
					{BRANDS.slice(4, 7).map((brand) => (
						<div 
							key={brand.name} 
							className={cn(
								"group relative flex items-center justify-center py-4 px-6 min-w-30 md:min-w-40",
								"transition-all duration-500 hover:opacity-100 hover:scale-110 cursor-default"
							)}
						>
							<span className="text-xl md:text-3xl font-black tracking-tighter text-foreground transition-colors group-hover:text-primary">
								{brand.name}
							</span>
							<div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

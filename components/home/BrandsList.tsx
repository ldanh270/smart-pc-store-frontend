import { cn } from "@/lib/utils";

const BRANDS = [
	{ name: "Intel", logo: "/brands/intel.svg" },
	{ name: "AMD", logo: "/brands/amd.svg" },
	{ name: "NVIDIA", logo: "/brands/nvidia.svg" },
	{ name: "ASUS", logo: "/brands/asus.svg" },
	{ name: "MSI", logo: "/brands/msi.svg" },
	{ name: "Gigabyte", logo: "/brands/gigabyte.svg" },
	{ name: "Samsung", logo: "/brands/samsung.svg" },
	{ name: "Corsair", logo: "/brands/corsair.svg" },
	{ name: "Dell", logo: "/brands/dell.svg" },
	{ name: "HP", logo: "/brands/hp.svg" },
	{ name: "Lenovo", logo: "/brands/lenovo.svg" },
	{ name: "Apple", logo: "/brands/apple.svg" },
];

export default function BrandsList() {
	return (
		<div className="flex flex-col gap-16 py-10">
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div className="space-y-3">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
						</span>
						<span className="text-[10px] font-bold uppercase tracking-widest text-primary">Our Partners</span>
					</div>
					<h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
						Thương Hiệu <span className="text-primary">Hàng Đầu</span>
					</h2>
					<p className="text-muted-foreground max-w-xl text-lg">
						Chúng tôi tự hào là đối tác chiến lược của những tên tuổi lớn nhất trong ngành công nghệ, mang đến cho bạn những sản phẩm chính hãng với chất lượng đảm bảo.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-0 border-t border-l border-border/40">
				{BRANDS.map((brand) => (
					<div 
						key={brand.name} 
						className={cn(
							"group relative flex items-center justify-center p-12 aspect-square md:aspect-video",
							"border-r border-b border-border/40 bg-background transition-all duration-500",
							"hover:bg-muted/30 hover:z-10"
						)}
					>
						{/* Placeholder text for logo */}
						<div className="flex flex-col items-center gap-2 transition-all duration-300 group-hover:scale-110">
							<span className="text-2xl md:text-3xl font-black tracking-tighter text-foreground/30 transition-colors group-hover:text-primary">
								{brand.name}
							</span>
						</div>
						
						{/* Hover glow effect */}
						<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
							<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

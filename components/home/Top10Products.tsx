import { type Product } from "@/types/product";
import ProductCard from "@/components/shared/ProductCard";
import { cn } from "@/lib/utils";

interface Top10ProductsProps {
	products: Product[];
}

export default function Top10Products({ products }: Top10ProductsProps) {
	return (
		<div className="space-y-16 py-12">
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div className="space-y-4">
					<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20">
						<span className="text-[10px] font-bold uppercase tracking-widest text-accent">Hot Selection</span>
					</div>
					<h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
						Top 10 <span className="text-primary">Sản Phẩm</span> Nổi Bật
					</h2>
					<p className="text-muted-foreground text-lg max-w-2xl">
						Khám phá danh sách các sản phẩm được người dùng săn đón và đánh giá cao nhất trong tuần qua.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
				{products.slice(0, 10).map((product, index) => (
					<div key={product.id} className="relative group">
						{/* Rank Badge */}
						<div className={cn(
							"absolute -top-6 -left-4 z-20 size-12 flex items-center justify-center rounded-2xl",
							"bg-white dark:bg-black border-4 border-muted shadow-xl transition-all duration-300",
							"group-hover:scale-110 group-hover:border-primary",
							"text-xl font-black italic",
							index < 3 ? "text-primary scale-110" : "text-muted-foreground"
						)}>
							#{index + 1}
						</div>
						
						<ProductCard product={product} />
						
						{/* Progress bar style decoration for top 3 */}
						{index < 3 && (
							<div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
								<div 
									className="h-full bg-primary animate-pulse" 
									style={{ width: `${100 - index * 20}%` }}
								/>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

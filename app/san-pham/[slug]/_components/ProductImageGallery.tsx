import Image from "next/image";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
	imageUrl: string | null;
	productName: string;
}

export default function ProductImageGallery({
	imageUrl,
	productName,
}: ProductImageGalleryProps) {
	const [isLoading, setIsLoading] = useState(true);
	const hasImage = !!imageUrl;
	const src = imageUrl || "/products/placeholder.svg";

	return (
		<div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border/50 bg-muted/30 shadow-sm">
			{/* Loading state for images */}
			{isLoading && hasImage && (
				<Skeleton className="absolute inset-0 z-10 h-full w-full rounded-none" />
			)}

			{/* Placeholder when NO image exists at all */}
			{!hasImage && (
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted/20 text-muted-foreground/40">
					<ImageIcon className="h-16 w-16 stroke-[1.25]" />
					<p className="text-xs font-medium uppercase tracking-widest">
						Hình ảnh đang cập nhật
					</p>
				</div>
			)}

			{/* Actual Image */}
			{hasImage && (
				<Image
					src={src}
					alt={productName}
					fill
					sizes="(max-width: 768px) 100vw, 50vw"
					className={cn(
						"object-contain p-4 transition-all duration-500",
						isLoading ? "scale-105 blur-sm grayscale" : "scale-100 blur-0 grayscale-0"
					)}
					onLoad={() => setIsLoading(false)}
					priority
				/>
			)}
			
			{/* Decorative overlay for consistent look */}
			<div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5" />
		</div>
	);
}

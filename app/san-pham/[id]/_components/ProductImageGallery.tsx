import Image from "next/image";

interface ProductImageGalleryProps {
	imageUrl: string | null;
	productName: string;
}

export default function ProductImageGallery({
	imageUrl,
	productName,
}: ProductImageGalleryProps) {
	const src = imageUrl || "/products/placeholder.svg";

	return (
		<div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-secondary">
			<Image
				src={src}
				alt={productName}
				fill
				sizes="(max-width: 768px) 100vw, 50vw"
				className="object-cover"
				priority
			/>
		</div>
	);
}

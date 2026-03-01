import { formatPrice } from "@/lib/utils";
import { BackendProduct } from "@/types/product";
import { Package, CheckCircle, XCircle } from "lucide-react";

interface ProductInfoProps {
	product: BackendProduct;
}

export default function ProductInfo({ product }: ProductInfoProps) {
	const isInStock = product.quantity > 0 && product.status;

	return (
		<div className="flex flex-col gap-4">
			{/* Category badge */}
			<span className="w-fit rounded-md bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
				Category {product.categoryId}
			</span>

			{/* Product Name */}
			<h1 className="font-sans text-2xl font-bold leading-tight text-foreground lg:text-3xl">
				{product.productName}
			</h1>

			{/* Price */}
			<div className="flex items-baseline gap-3">
				<span className="font-mono text-3xl font-bold text-primary">
					{formatPrice(product.currentPrice)}
				</span>
			</div>

			{/* Stock Status */}
			<div className="flex items-center gap-2">
				{isInStock ? (
					<>
						<CheckCircle className="h-4 w-4 text-green-600" />
						<span className="text-sm font-medium text-green-600">
							Còn hàng ({product.quantity} sản phẩm)
						</span>
					</>
				) : (
					<>
						<XCircle className="h-4 w-4 text-destructive" />
						<span className="text-sm font-medium text-destructive">
							Hết hàng
						</span>
					</>
				)}
			</div>

			{/* Divider */}
			<div className="h-px bg-border" />

			{/* Description */}
			{product.description && (
				<div className="flex flex-col gap-2">
					<h2 className="font-sans text-sm font-semibold uppercase tracking-wide text-muted-foreground">
						Mô tả sản phẩm
					</h2>
					<p className="text-sm leading-relaxed text-foreground">
						{product.description}
					</p>
				</div>
			)}

			{/* Product Details */}
			<div className="flex flex-col gap-2">
				<h2 className="font-sans text-sm font-semibold uppercase tracking-wide text-muted-foreground">
					Thông tin
				</h2>
				<div className="flex items-center gap-2 text-sm text-foreground">
					<Package className="h-4 w-4 text-muted-foreground" />
					<span>
						Mã sản phẩm:{" "}
						<span className="font-mono font-medium">
							SP-{String(product.id).padStart(4, "0")}
						</span>
					</span>
				</div>
			</div>
		</div>
	);
}

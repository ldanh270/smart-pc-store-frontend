import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { BackendProduct } from "@/types/product";
import { Package, CheckCircle, XCircle, Tag, Store, ShieldCheck, Truck } from "lucide-react";
import { generateCategorySlug } from "@/types/category";

interface ProductInfoProps {
	product: BackendProduct;
}

export default function ProductInfo({ product }: ProductInfoProps) {
	const isInStock = product.quantity > 0 && product.status;

	return (
		<div className="flex flex-col gap-4">
			{/* Category badge */}
			{product.categoryName && (
				<Link
					href={`/danh-muc/${generateCategorySlug(product.categoryName)}`}
					className="inline-flex w-fit items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
				>
					<Tag className="h-3 w-3" />
					{product.categoryName}
				</Link>
			)}

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

			{/* Trust badges */}
			<div className="flex flex-wrap gap-3">
				<span className="flex items-center gap-1.5 text-xs text-muted-foreground">
					<ShieldCheck className="h-3.5 w-3.5 text-green-500" />
					Hàng chính hãng
				</span>
				<span className="flex items-center gap-1.5 text-xs text-muted-foreground">
					<Truck className="h-3.5 w-3.5 text-blue-500" />
					Miễn phí vận chuyển
				</span>
			</div>

			{/* Divider */}
			<div className="h-px bg-border" />

			{/* Description */}
			{product.description && (
				<div className="flex flex-col gap-2">
					<h2 className="font-sans text-sm font-semibold uppercase tracking-wide text-muted-foreground">
						Mô tả sản phẩm
					</h2>
					<p className="text-sm leading-relaxed text-foreground/80">
						{product.description}
					</p>
				</div>
			)}

			{/* Product Details */}
			<div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3">
				<h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					Thông tin sản phẩm
				</h2>
				<div className="space-y-1.5 text-sm">
					<div className="flex items-center gap-2 text-foreground">
						<Package className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
						<span className="text-muted-foreground">Mã sản phẩm:</span>
						<span className="font-mono font-medium">
							SP-{String(product.id).slice(-6).toUpperCase()}
						</span>
					</div>
					{product.supplierName && (
						<div className="flex items-center gap-2 text-foreground">
							<Store className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
							<span className="text-muted-foreground">Nhà cung cấp:</span>
							<span className="font-medium">{product.supplierName}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}


import { Suspense } from "react";
import { type Metadata } from "next";
import { AlertCircle, PackageX } from "lucide-react";

import { productService } from "@/services/productService";
import { mapBackendProduct } from "@/types/product";
import ProductCard from "@/components/shared/ProductCard";
import ProductFilters from "./_components/ProductFilters";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
	title: "Tìm kiếm sản phẩm | Smart PC Store",
	description: "Tìm kiếm các sản phẩm PC, linh kiện chất lượng cao",
};

interface SearchPageProps {
	searchParams: {
		name?: string;
		categoryId?: string;
		status?: string;
		minPrice?: string;
		maxPrice?: string;
		page?: string;
	};
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
	// Need to wait for searchParams in Next.js 15+ async components
	const params = await searchParams;

	const { name } = params;

	// Render the main search grid
	return (
		<div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
			{/* Page Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight">
					{name ? `Kết quả tìm kiếm cho "${name}"` : "Tất cả sản phẩm"}
				</h1>
				<p className="mt-2 text-muted-foreground">
					Khám phá các sản phẩm chất lượng cao với giá tốt nhất
				</p>
			</div>

			<div className="flex flex-col gap-8 lg:flex-row lg:items-start">
				{/* Sidebar Filters */}
				<Suspense fallback={<FiltersSkeleton />}>
					<ProductFilters />
				</Suspense>

				{/* Product Grid Area */}
				<div className="flex-1">
					<Suspense
						fallback={<ProductGridSkeleton />}
						key={JSON.stringify(params)}
					>
						<ProductGrid params={params} />
					</Suspense>
				</div>
			</div>
		</div>
	);
}

async function ProductGrid({ params }: { params: SearchPageProps["searchParams"] }) {
	const p = await params;
	// Prepare query params
	const queryParams = {
		name: p.name || undefined,
		categoryId: p.categoryId || undefined,
		status: p.status === "true" ? true : p.status === "false" ? false : undefined,
		minPrice: p.minPrice ? Number(p.minPrice) : undefined,
		maxPrice: p.maxPrice ? Number(p.maxPrice) : undefined,
		page: p.page ? Number(p.page) : 0,
		size: 20, // Default 20 items for grid
	};

	let backendProducts: Awaited<ReturnType<typeof productService.getProducts>> = [];
	let hasError = false;

	try {
		// CHIẾN LƯỢC TÌM KIẾM:
		// 1. Nếu gõ ngắn (1-2 chữ): Thường backend không xử lý tốt -> Fetch tập rộng rồi filter client-side.
		// 2. Nếu gõ dài hoặc filter theo category/giá: Dùng backend filter.
		
		const q = queryParams.name?.toLowerCase().trim() || "";
		
		if (q.length > 0 && q.length < 3) {
			// Xử lý từ khóa ngắn (1-2 ký tự)
			const allProducts = await productService.getProducts({ size: 100 });
			backendProducts = allProducts.filter(p => 
				p.productName.toLowerCase().includes(q) ||
				(p.description && p.description.toLowerCase().includes(q))
			);
		} else {
			// Gọi backend cho trường hợp bình thường
			backendProducts = await productService.getProducts(queryParams);

			// Fallback nếu backend trả về [] cho keyword dài (vì lý do đồng bộ hoặc index)
			if (backendProducts.length === 0 && q.length >= 3) {
				const allProducts = await productService.getProducts({ size: 100 });
				backendProducts = allProducts.filter(p => 
					p.productName.toLowerCase().includes(q)
				);
			}
		}
	} catch (error) {
		console.error("Failed to load products, trying fallback:", error);
		// FALLBACK ON ERROR
		try {
			const allProducts = await productService.getProducts({ size: 100 });
			const q = queryParams.name?.toLowerCase().trim() || "";
			if (q) {
				backendProducts = allProducts.filter(p => 
					p.productName.toLowerCase().includes(q)
				);
			} else {
				backendProducts = allProducts;
			}
		} catch (fallbackError) {
			console.error("Complete data failure:", fallbackError);
			hasError = true;
		}
	}

	if (hasError) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="size-4" />
				<AlertTitle>Lỗi tải dữ liệu</AlertTitle>
				<AlertDescription>
					Đã xảy ra lỗi khi tải danh sách sản phẩm. Vui lòng thử lại sau.
				</AlertDescription>
			</Alert>
		);
	}

	// Transform to UI format
	const products = backendProducts.map(mapBackendProduct);

	if (products.length === 0) {
		return (
			<div className="flex min-h-100 flex-col items-center justify-center rounded-lg border border-dashed text-center p-8">
				<div className="mb-4 rounded-full bg-muted p-4">
					<PackageX className="size-8 text-muted-foreground" />
				</div>
				<h3 className="mb-2 text-lg font-semibold">Chưa tìm thấy sản phẩm</h3>
				<p className="text-sm text-muted-foreground max-w-md">
					Chúng tôi không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.
					Vui lòng thử tìm kiếm bằng từ khóa khác hoặc xóa bớt bộ lọc.
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
			{products.map((product) => (
				<ProductCard
					key={product.id}
					product={product}
				/>
			))}
		</div>
	);
}

// ─── Skeletons ──────────────────────────────────────────────────────────────

function FiltersSkeleton() {
	return (
		<div className="hidden w-64 lg:block">
			<div className="space-y-4 rounded-lg border p-6">
				<Skeleton className="h-6 w-24" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-8 w-full mt-4" />
			</div>
		</div>
	);
}

function ProductGridSkeleton() {
	return (
		<div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
			{Array.from({ length: 8 }).map((_, i) => (
				<div
					key={i}
					className="space-y-3 rounded-lg border p-4 shadow-xs"
				>
					<Skeleton className="aspect-square w-full rounded-md" />
					<Skeleton className="h-4 w-2/3" />
					<Skeleton className="h-4 w-1/2" />
					<Skeleton className="h-8 w-full mt-4" />
				</div>
			))}
		</div>
	);
}

"use client";

import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import type { BackendCategory } from "@/types/category";
import { generateCategorySlug } from "@/types/category";

interface CategorySidebarProps {
	allCategories: BackendCategory[];
	availableBrands: string[];
	currentCategorySlug: string;
	inStockOnly: boolean;
	setInStockOnly: (val: boolean) => void;
	selectedBrands: string[];
	setSelectedBrands: (val: string[] | ((prev: string[]) => string[])) => void;
	selectedPrices: string[];
	setSelectedPrices: (val: string[] | ((prev: string[]) => string[])) => void;
}

export default function CategorySidebar({
	allCategories,
	availableBrands,
	currentCategorySlug,
	inStockOnly,
	setInStockOnly,
	selectedBrands,
	setSelectedBrands,
	selectedPrices,
	setSelectedPrices,
}: CategorySidebarProps) {
	const handleBrandChange = (brand: string, checked: boolean) => {
		setSelectedBrands((prev) =>
			checked ? [...prev, brand] : prev.filter((b) => b !== brand)
		);
	};

	const handlePriceChange = (priceId: string, checked: boolean) => {
		setSelectedPrices((prev) =>
			checked ? [...prev, priceId] : prev.filter((p) => p !== priceId)
		);
	};

	const PRICE_RANGES = [
		{ id: "<100k", label: "Giá dưới 100.000đ" },
		{ id: "100k-200k", label: "100.000đ - 200.000đ" },
		{ id: "200k-300k", label: "200.000đ - 300.000đ" },
		{ id: "300k-500k", label: "300.000đ - 500.000đ" },
		{ id: "500k-1m", label: "500.000đ - 1.000.000đ" },
		{ id: ">1m", label: "Giá trên 1.000.000đ" },
	];

	return (
		<aside className="w-full shrink-0 flex flex-col gap-8 md:w-62.5">
      {/* Tìm theo */}
			<section className="pt-5">
				<h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">
					Tìm theo
				</h3>

				<div className="flex flex-col gap-6">
					{/* Trạng thái tồn kho */}
					<div>
						<h4 className="mb-3 text-sm font-semibold text-foreground">
							Trạng thái tồn kho
						</h4>
						<label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground">
							<Checkbox
								id="in-stock"
								checked={inStockOnly}
								onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
							/>
							Hàng có sẵn
						</label>
					</div>

					{/* Thương hiệu */}
					{availableBrands.length > 0 && (
						<div>
							<h4 className="mb-3 text-sm font-semibold text-foreground">
								Thương hiệu
							</h4>
							<div className="flex flex-col gap-2.5">
								{availableBrands.map((brand) => (
									<label
										key={brand}
										className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground line-clamp-1"
										title={brand}
									>
										<Checkbox
											id={`brand-${brand}`}
											checked={selectedBrands.includes(brand)}
											onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
										/>
										{brand}
									</label>
								))}
							</div>
						</div>
					)}

					{/* Giá sản phẩm */}
					<div>
						<h4 className="mb-3 text-sm font-semibold text-foreground">
							Giá sản phẩm
						</h4>
						<div className="flex flex-col gap-2.5">
							{PRICE_RANGES.map((price) => (
								<label
									key={price.id}
									className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground"
								>
									<Checkbox
										id={`price-${price.id}`}
										checked={selectedPrices.includes(price.id)}
										onCheckedChange={(checked) => handlePriceChange(price.id, checked as boolean)}
									/>
									{price.label}
								</label>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Danh mục */}
			<section>
				<h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">
					Danh mục
				</h3>
				<ul className="flex flex-col gap-3 text-sm text-muted-foreground">
					<li>
						<Link href="/" className="hover:text-primary transition-colors">
							Trang chủ
						</Link>
					</li>
					{allCategories.map((cat) => {
						const slug = generateCategorySlug(cat.categoryName);
						const isActive = slug === currentCategorySlug;
						return (
							<li key={cat.id}>
								<Link
									href={`/danh-muc/${slug}`}
									className={`hover:text-primary transition-colors block ${
										isActive ? "font-medium text-primary" : ""
									}`}
								>
									{cat.categoryName}
								</Link>
							</li>
						);
					})}
					<li>
						<Link
							href="/bai-viet"
							className="hover:text-primary transition-colors block mt-2 pt-2 border-t border-border"
						>
							Bài viết
						</Link>
					</li>
				</ul>
			</section>
		</aside>
	);
}

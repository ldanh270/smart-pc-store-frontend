"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { BackendCategory } from "@/types/category";
import { generateCategorySlug } from "@/types/category";
import { Search } from "lucide-react";

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
	selectedCategories: string[];
	setSelectedCategories: (val: string[] | ((prev: string[]) => string[])) => void;
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
	selectedCategories,
	setSelectedCategories,
}: CategorySidebarProps) {
	const [brandSearch, setBrandSearch] = useState("");
	const [categorySearch, setCategorySearch] = useState("");

	const handleBrandChange = (brand: string, checked: boolean) => {
		setSelectedBrands((prev) =>
			checked ? [...prev, brand] : prev.filter((b) => b !== brand)
		);
	};

	const handleCategoryChange = (categoryId: string, checked: boolean) => {
		setSelectedCategories((prev) =>
			checked ? [...prev, categoryId] : prev.filter((id) => id !== categoryId)
		);
	};

	const handlePriceChange = (priceId: string, checked: boolean) => {
		setSelectedPrices((prev) =>
			checked ? [...prev, priceId] : prev.filter((p) => p !== priceId)
		);
	};

	const filteredBrands = useMemo(() => {
		return availableBrands.filter((brand) =>
			brand?.toLowerCase().includes(brandSearch.toLowerCase())
		);
	}, [availableBrands, brandSearch]);

	const filteredCategories = useMemo(() => {
		return allCategories.filter((cat) =>
			cat.categoryName?.toLowerCase().includes(categorySearch.toLowerCase())
		);
	}, [allCategories, categorySearch]);

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

					{/* Danh mục sản phẩm */}
					<div className="flex flex-col gap-3">
						<h4 className="text-sm font-semibold text-foreground">
							Danh mục sản phẩm
						</h4>
						
						{/* Category Search Input */}
						{allCategories.length > 8 && (
							<div className="relative mb-1">
								<Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
								<Input
									placeholder="Tìm danh mục..."
									className="h-8 pl-8 text-xs focus-visible:ring-primary/30"
									value={categorySearch}
									onChange={(e) => setCategorySearch(e.target.value)}
								/>
							</div>
						)}

						<ScrollArea className={`${allCategories.length > 8 ? "h-48" : "h-auto max-h-48"} pr-3`}>
							<div className="flex flex-col gap-2.5">
								{filteredCategories.length > 0 ? (
									filteredCategories.map((cat) => (
										<label
											key={cat.id}
											className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:text-foreground line-clamp-1"
											title={cat.categoryName}
										>
											<Checkbox
												id={`cat-${cat.id}`}
												checked={selectedCategories.includes(cat.id)}
												onCheckedChange={(checked) => handleCategoryChange(cat.id, checked as boolean)}
											/>
											{cat.categoryName}
										</label>
									))
								) : (
									<span className="text-xs text-muted-foreground italic">Không tìm thấy</span>
								)}
							</div>
						</ScrollArea>
					</div>

					{/* Thương hiệu */}
					{availableBrands.length > 0 && (
						<div className="flex flex-col gap-3">
							<h4 className="text-sm font-semibold text-foreground">
								Thương hiệu
							</h4>
							
							{/* Brand Search Input - only show if many brands */}
							{availableBrands.length > 8 && (
								<div className="relative mb-1">
									<Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
									<Input
										placeholder="Tìm hãng..."
										className="h-8 pl-8 text-xs focus-visible:ring-primary/30"
										value={brandSearch}
										onChange={(e) => setBrandSearch(e.target.value)}
									/>
								</div>
							)}

							<ScrollArea className={`${availableBrands.length > 8 ? "h-48" : "h-auto max-h-48"} pr-3`}>
								<div className="flex flex-col gap-2.5">
									{filteredBrands.length > 0 ? (
										filteredBrands.map((brand) => (
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
										))
									) : (
										<span className="text-xs text-muted-foreground italic">Không tìm thấy</span>
									)}
								</div>
							</ScrollArea>
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

			{/* Links */}
			<section>
				<h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">
					Liên kết
				</h3>
				<ul className="flex flex-col gap-3 text-sm text-muted-foreground">
					<li>
						<Link href="/" className="hover:text-primary transition-colors">
							Trang chủ
						</Link>
					</li>
					<li>
						<Link
							href="/ve-chung-toi"
							className="hover:text-primary transition-colors block"
						>
							Về chúng tôi
						</Link>
					</li>
					<li>
						<Link
							href="/san-pham"
							className="hover:text-primary transition-colors block"
						>
							Tất cả sản phẩm
						</Link>
					</li>
				</ul>
			</section>
		</aside>
	);
}

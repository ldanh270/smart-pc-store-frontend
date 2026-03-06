"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Category } from "@/types/category";
import { categoryService } from "@/services/categoryService";
import { cn } from "@/lib/utils";

interface FilterState {
	categoryId?: string;
	status?: string;
	minPrice?: string;
	maxPrice?: string;
}

export default function ProductFilters() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [categories, setCategories] = useState<Category[]>([]);
	const [filters, setFilters] = useState<FilterState>({});
	const [isOpen, setIsOpen] = useState(false);

	// Load categories
	useEffect(() => {
		categoryService
			.getCategories()
			.then((data) => setCategories(data.filter((c) => c.status)))
			.catch(console.error);
	}, []);

	// Sync local state with URL
	useEffect(() => {
		setFilters({
			categoryId: searchParams.get("categoryId") || undefined,
			status: searchParams.get("status") || undefined,
			minPrice: searchParams.get("minPrice") || undefined,
			maxPrice: searchParams.get("maxPrice") || undefined,
		});
	}, [searchParams]);

	// Push filters to URL
	const applyFilters = useCallback(
		(newFilters: FilterState) => {
			const params = new URLSearchParams(searchParams.toString());

			// Update params
			Object.entries(newFilters).forEach(([key, value]) => {
				if (value) {
					params.set(key, value);
				} else {
					params.delete(key);
				}
			});

			// Reset to page 1 on filter change
			params.delete("page");

			router.push(`/products?${params.toString()}`);
		},
		[router, searchParams],
	);

	const handleFilterChange = (key: keyof FilterState, value: string | undefined) => {
		const newFilters = { ...filters, [key]: value };
		setFilters(newFilters);
		applyFilters(newFilters);
	};

	const clearFilters = () => {
		const q = searchParams.get("q");
		if (q) {
			router.push(`/products?q=${encodeURIComponent(q)}`);
		} else {
			router.push(`/products`);
		}
		setIsOpen(false);
	};

	const FilterContent = (
		<div className="space-y-6">
			{/* Categories */}
			<div className="space-y-4">
				<h3 className="font-medium">Danh mục</h3>
				<RadioGroup
					value={filters.categoryId || ""}
					onValueChange={(val) =>
						handleFilterChange("categoryId", val === "all" ? undefined : val)
					}
					className="flex flex-col gap-2.5"
				>
					<div className="flex items-center space-x-2">
						<RadioGroupItem
							value="all"
							id="cat-all"
						/>
						<Label
							htmlFor="cat-all"
							className="text-sm font-normal"
						>
							Tất cả sản phẩm
						</Label>
					</div>
					{categories.map((category) => (
						<div
							key={category.id}
							className="flex items-center space-x-2"
						>
							<RadioGroupItem
								value={category.id.toString()}
								id={`cat-${category.id}`}
							/>
							<Label
								htmlFor={`cat-${category.id}`}
								className="text-sm font-normal"
							>
								{category.name}
							</Label>
						</div>
					))}
				</RadioGroup>
			</div>

			<Separator />

			{/* Price Range */}
			<div className="space-y-4">
				<h3 className="font-medium">Khoảng giá</h3>
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label
							htmlFor="minPrice"
							className="text-xs text-muted-foreground"
						>
							Từ (VNĐ)
						</Label>
						<Input
							id="minPrice"
							type="number"
							min={0}
							placeholder="Tối thiểu"
							value={filters.minPrice || ""}
							onChange={(e) =>
								setFilters((prev) => ({ ...prev, minPrice: e.target.value }))
							}
							onBlur={(e) => handleFilterChange("minPrice", e.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label
							htmlFor="maxPrice"
							className="text-xs text-muted-foreground"
						>
							Đến (VNĐ)
						</Label>
						<Input
							id="maxPrice"
							type="number"
							min={0}
							placeholder="Tối đa"
							value={filters.maxPrice || ""}
							onChange={(e) =>
								setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))
							}
							onBlur={(e) => handleFilterChange("maxPrice", e.target.value)}
						/>
					</div>
				</div>
			</div>

			<Separator />

			{/* Status */}
			<div className="space-y-4">
				<h3 className="font-medium">Trạng thái</h3>
				<div className="flex items-center space-x-2">
					<Checkbox
						id="in-stock"
						checked={filters.status === "true"}
						onCheckedChange={(checked) =>
							handleFilterChange("status", checked ? "true" : undefined)
						}
					/>
					<Label
						htmlFor="in-stock"
						className="text-sm font-normal"
					>
						Chỉ hiện hàng còn sẵn
					</Label>
				</div>
			</div>

			{Object.keys(filters).some((k) => filters[k as keyof FilterState] !== undefined) && (
				<Button
					variant="ghost"
					className="w-full text-muted-foreground"
					onClick={clearFilters}
				>
					<X className="mr-2 size-4" />
					Xóa bộ lọc
				</Button>
			)}
		</div>
	);

	return (
		<>
			{/* Mobile Filter Trigger */}
			<div className="mb-4 flex items-center justify-between lg:hidden">
				<Sheet
					open={isOpen}
					onOpenChange={setIsOpen}
				>
					<SheetTrigger asChild>
						<Button
							variant="outline"
							className="w-full sm:w-auto"
						>
							<SlidersHorizontal className="mr-2 size-4" />
							Bộ lọc
						</Button>
					</SheetTrigger>
					<SheetContent side="left">
						<SheetHeader className="mb-6 text-left">
							<SheetTitle>Bộ lọc sản phẩm</SheetTitle>
						</SheetHeader>
						<ScrollArea className="h-[calc(100vh-8rem)] pr-4">
							{FilterContent}
						</ScrollArea>
					</SheetContent>
				</Sheet>
			</div>

			{/* Desktop Sidebar Filter */}
			<aside className="hidden w-64 shrink-0 lg:block">
				<div className="sticky top-24 rounded-lg border bg-card p-6 shadow-xs">
					<div className="mb-6 flex items-center border-b pb-4">
						<SlidersHorizontal className="mr-2 size-5" />
						<h2 className="text-lg font-semibold">Bộ lọc</h2>
					</div>
					{FilterContent}
				</div>
			</aside>
		</>
	);
}

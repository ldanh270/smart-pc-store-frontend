"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Loader2, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { productService } from "@/services/productService";
import { mapBackendProduct, type Product } from "@/types/product";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { cn, formatPrice } from "@/lib/utils";

type SearchDialogProps = {
	triggerMode?: "icon" | "bar";
	className?: string;
	initialCategories?: any[];
};

export default function SearchDialog({
	triggerMode = "icon",
	className,
	initialCategories = [],
}: SearchDialogProps) {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const [results, setResults] = useState<Product[]>([]);
	const { categories, fetchCategories } = useCategoryStore();
	const [selectedCategory, setSelectedCategory] = useState<string>("all");

	// Fetch Categories on mount
	useEffect(() => {
		// Nếu initialCategories có dữ liệu, ta có thể sync vào store hoặc dùng local
		if (categories.length === 0) {
			fetchCategories();
		}
	}, [categories.length, fetchCategories]);

	// Ưu tiên dùng categories từ store, nếu trống thì dùng initialCategories làm fallback nhanh
	// Chỉ hiển thị các danh mục con (có parentId)
	const displayCategories = (categories.length > 0 ? categories : initialCategories).filter(
		(cat) => !!cat.parentId
	);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(searchQuery);
		}, 300);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	useEffect(() => {
		async function fetchResults() {
			const q = debouncedQuery.trim().toLowerCase();
			// Nếu không có cả từ khóa lẫn danh mục cụ thể thì ẩn kết quả
			if (!q && selectedCategory === "all") {
				setResults([]);
				setIsSearching(false);
				return;
			}

			setIsSearching(true);
			try {
				// CHIẾN LƯỢC TÌM KIẾM: 
				// 1. Nếu gõ ngắn (1-2 chữ): Backend thường bỏ qua hoặc trả về [] -> Ta fetch 100 cái rồi filter client-side ngay.
				// 2. Nếu gõ từ 3 chữ: Gọi backend như bình thường.
				
				let backendProducts: any[] = [];
				
				if (q.length > 0 && q.length < 3) {
					// Fetch tập rộng để filter client-side cho từ khóa ngắn
					const allProducts = await productService.getProducts({ size: 100 });
					backendProducts = allProducts.filter(p => 
						p.productName.toLowerCase().includes(q) || 
						(p.description && p.description.toLowerCase().includes(q))
					);
				} else {
					// Gõ đủ dài (> 2 chữ) hoặc chỉ chọn category -> Gọi backend filter
					const params: any = {};
					if (q) params.q = q;
					if (selectedCategory !== "all") {
						params.categoryId = selectedCategory; 
					}
					backendProducts = await productService.getProducts(params);
					
					// Fallback nếu backend trả về [] cho từ khóa dài (có thể do sai lệch index)
					if (backendProducts.length === 0 && q.length >= 3) {
						const allProducts = await productService.getProducts({ size: 100 });
						backendProducts = allProducts.filter(p => 
							p.productName.toLowerCase().includes(q)
						);
					}
				}

				setResults(backendProducts.map(mapBackendProduct));
			} catch (error) {
				console.error("Failed to fetch search results:", error);
				setResults([]);
			} finally {
				setIsSearching(false);
			}
		}

		fetchResults();
	}, [debouncedQuery, selectedCategory]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const q = searchQuery.trim();
		if (q || selectedCategory !== "all") {
			setIsOpen(false);
			const url = new URL("/san-pham", window.location.origin);
			if (q) url.searchParams.set("q", q);
			if (selectedCategory !== "all") url.searchParams.set("categoryId", selectedCategory);
			router.push(url.pathname + url.search);
		}
	};

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (!open) {
			setTimeout(() => {
				setSearchQuery("");
				setDebouncedQuery("");
				setResults([]);
			}, 300);
		}
	};

	return (
		<div className={cn("relative z-50", triggerMode === "bar" && "mx-auto max-w-[600px]", className)}>
			{triggerMode === "bar" ? (
				<form
					onSubmit={handleSubmit}
					className={cn(
						"group flex h-9 w-full items-center overflow-visible rounded-lg border border-border/60 bg-muted/30 transition-all hover:border-primary/40 focus-within:bg-background focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20",
						isOpen ? "border-primary/60 bg-background" : ""
					)}
				>
					{/* Category Select */}
					<div className="hidden h-full items-center md:flex shrink-0">
						<Select value={selectedCategory} onValueChange={setSelectedCategory}>
							<SelectTrigger className="h-full border-0 bg-transparent shadow-none focus:ring-0 text-sm font-medium w-[160px] px-3 border-r border-border/60 rounded-none focus-visible:ring-0">
								<SelectValue placeholder="Tất cả danh mục" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all" className="font-semibold">Tất cả danh mục</SelectItem>
								{displayCategories.map((cat) => (
									<SelectItem key={cat.id} value={cat.id.toString()}>
										{cat.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Search Input */}
					<div className="relative flex-1 h-full min-w-0 flex items-center">
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								setIsOpen(true);
							}}
							onFocus={() => setIsOpen(true)}
							placeholder="Tìm kiếm sản phẩm..."
							className="h-full w-full bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground/60 min-w-0"
						/>
						{searchQuery && (
							<button
								type="button"
								onClick={() => {
									setSearchQuery("");
									setIsOpen(false);
								}}
								className="absolute right-2 p-1 text-muted-foreground hover:text-foreground"
							>
								<X className="size-3.5" />
							</button>
						)}
					</div>

					<button
						type="submit"
						aria-label="Tìm kiếm"
						className="flex h-full w-10 shrink-0 items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors rounded-r-lg border-l border-border/60"
					>
						<Search className="size-4" />
					</button>
				</form>
			) : (
				/* Mobile Icon trigger can keep a simpler popout or just expand */
				<button
					type="button"
					aria-label="Tìm kiếm"
					onClick={() => setIsOpen((prev) => !prev)}
					className={cn(
						"flex h-9 w-9 items-center justify-center rounded-lg",
						"border border-border/60 bg-muted/40 text-muted-foreground",
						"transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary",
						isOpen && "bg-primary/10 text-primary border-primary/40"
					)}
				>
					{isOpen ? <X className="size-4" /> : <Search className="size-4" />}
				</button>
			)}

			{/* Inline Dropdown for Results */}
			{isOpen && (
				<>
					{/* Overlay click to close */}
					<div
						className="fixed inset-0 z-40 bg-transparent"
						onClick={() => setIsOpen(false)}
						aria-hidden="true"
					/>

					<div
						className={cn(
							"absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-xl shadow-black/5 animate-in fade-in zoom-in-95",
							triggerMode === "icon" ? "right-0 w-[calc(100vw-32px)] max-w-[360px]" : "left-0 min-w-full"
						)}
					>
						{/* Mobile Search Input (shows only when triggerMode is icon) */}
						{triggerMode === "icon" && (
							<div className="flex items-center gap-2 border-b p-3">
								<Search className="size-4 text-muted-foreground shrink-0 ml-1" />
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Tìm kiếm..."
									className="flex-1 bg-transparent text-sm outline-none"
									autoFocus
								/>
							</div>
						)}

						<ScrollArea className="h-full overflow-y-auto max-h-[60vh] md:max-h-[400px]">
							{isSearching ? (
								<div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
									<Loader2 className="mb-3 size-5 animate-spin" />
									<p className="text-xs">Đang tìm kiếm...</p>
								</div>
							) : results.length > 0 ? (
								<div className="p-2">
									<div className="mb-1.5 px-3 py-1 text-xs font-semibold uppercase text-muted-foreground">
										Sản phẩm ({results.length})
									</div>
									<div className="flex flex-col gap-0.5">
										{results.map((product) => (
											<button
												key={product.id}
												type="button"
												className="flex items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted/60"
												onClick={() => {
													setIsOpen(false);
													router.push(`/san-pham/${product.slug}`);
												}}
											>
												<div className="relative size-10 shrink-0 overflow-hidden rounded border bg-background">
													<Image
														src={product.image || "/placeholder.png"}
														alt={product.name}
														fill
														sizes="40px"
														className="object-cover"
													/>
												</div>
												<div className="flex-1 min-w-0 pr-2">
													<h4 className="truncate text-sm font-medium leading-tight">
														{product.name}
													</h4>
													<p className="mt-0.5 font-mono text-xs font-semibold text-primary">
														{formatPrice(product.price)}
													</p>
												</div>
											</button>
										))}
									</div>

									<div className="mt-2 border-t p-2 text-center pb-1">
										<Button
											variant="ghost"
											className="w-full text-xs h-8 text-primary hover:text-primary hover:bg-primary/5"
											onClick={(e) => handleSubmit(e as any)}
										>
											Xem tất cả kết quả
										</Button>
									</div>
								</div>
							) : debouncedQuery.trim() || selectedCategory !== "all" ? (
								<div className="flex flex-col items-center justify-center py-10 text-center px-4">
									<Search className="mx-auto mb-3 size-10 text-muted-foreground/20" />
									<p className="text-sm font-medium">Không tìm thấy sản phẩm nào</p>
									<p className="mt-1 text-xs text-muted-foreground max-w-[200px]">
										{selectedCategory !== "all" ? "Thử bỏ lọc danh mục hoặc đổi từ khóa." : "Thử một từ khóa khác hoặc kiểm tra lại lỗi chính tả."}
									</p>
								</div>
							) : (
								<div className="hidden md:flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
									<p className="text-xs">Gõ phím để tìm kiếm...</p>
								</div>
							)}
						</ScrollArea>
					</div>
				</>
			)}
		</div>
	);
}

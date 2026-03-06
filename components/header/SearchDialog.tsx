"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogTitle,
} from "@/components/ui/dialog";
import { productService } from "@/services/productService";
import { mapBackendProduct, type Product } from "@/types/product";

export default function SearchDialog() {
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const [results, setResults] = useState<Product[]>([]);

	// Handle 300ms Debounce
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedQuery(searchQuery);
		}, 300);

		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Fetch Products when Debounced Query Changes
	useEffect(() => {
		async function fetchResults() {
			const q = debouncedQuery.trim();
			if (!q) {
				setResults([]);
				setIsSearching(false);
				return;
			}

			setIsSearching(true);
			try {
				const backendProducts = await productService.getProducts({ q });
				setResults(backendProducts.map(mapBackendProduct));
			} catch (error) {
				console.error("Failed to fetch search results:", error);
				setResults([]);
			} finally {
				setIsSearching(false);
			}
		}

		fetchResults();
	}, [debouncedQuery]);

	// Handle Search Form Submit
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const q = searchQuery.trim();
		if (q) {
			setIsOpen(false);
			router.push(`/products?q=${encodeURIComponent(q)}`);
		}
	};

	// Reset state on close
	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (!open) {
			// Clear results slightly after closing so it doesn't snap suddenly
			setTimeout(() => {
				setSearchQuery("");
				setDebouncedQuery("");
				setResults([]);
			}, 300);
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={handleOpenChange}
		>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					aria-label="Tìm kiếm"
				>
					<Search className="size-5" />
				</Button>
			</DialogTrigger>
			<DialogContent className="top-[5%] translate-y-0 sm:max-w-150 p-0 gap-0 overflow-hidden" showCloseButton={false}>
				<DialogTitle className="sr-only">Tìm kiếm sản phẩm</DialogTitle>
				{/* Header / Input Area */}
				<form onSubmit={handleSubmit} className="relative flex items-center p-4 border-b">
					<Search className="absolute left-6 size-5 text-muted-foreground mr-2" />
					<Input
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Nhập tên sản phẩm để tìm kiếm..."
						className="pl-10 pr-10 border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
						autoFocus
					/>
					{searchQuery && (
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="absolute right-12 size-8 rounded-full"
							onClick={() => setSearchQuery("")}
						>
							<X className="size-4" />
						</Button>
					)}
				</form>

				{/* Results Area */}
				<ScrollArea className="max-h-[60vh]">
					{isSearching ? (
						<div className="flex flex-col items-center justify-center py-14 text-muted-foreground">
							<Loader2 className="size-6 animate-spin mb-4" />
							<p className="text-sm">Đang tìm kiếm...</p>
						</div>
					) : results.length > 0 ? (
						<div className="p-2">
							<div className="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
								Sản phẩm ({results.length})
							</div>
							<div className="flex flex-col gap-1">
								{results.map((product) => (
									<button
										key={product.id}
										type="button"
										className="flex items-center gap-4 rounded-md p-3 text-left transition-colors hover:bg-muted/50"
										onClick={() => {
											setIsOpen(false);
											router.push(`/san-pham/${product.slug}`);
										}}
									>
										<div className="relative size-12 shrink-0 overflow-hidden rounded border bg-background">
											<Image
												src={product.image}
												alt={product.name}
												fill
												sizes="48px"
												className="object-cover"
											/>
										</div>
										<div className="flex-1 overflow-hidden">
											<h4 className="truncate text-sm font-medium">
												{product.name}
											</h4>
											<p className="text-sm font-semibold text-primary mt-1">
												{product.price.toLocaleString("vi-VN")} ₫
											</p>
										</div>
									</button>
								))}
							</div>
							
							<div className="mt-4 p-2 border-t text-center">
								<Button 
									variant="link" 
									className="text-primary w-full"
									onClick={() => {
										setIsOpen(false);
										router.push(`/san-pham?q=${encodeURIComponent(debouncedQuery.trim())}`);
									}}
								>
									Xem tất cả kết quả cho &quot;{debouncedQuery}&quot; →
								</Button>
							</div>
						</div>
					) : debouncedQuery.trim() ? (
						<div className="flex flex-col items-center justify-center p-14 text-center">
							<Search className="mx-auto size-12 text-muted-foreground/30 mb-4" />
							<p className="text-sm font-medium">Không tìm thấy sản phẩm nào</p>
							<p className="text-sm text-muted-foreground mt-1">
								Thử một từ khóa khác hoặc kiểm tra lại lỗi chính tả.
							</p>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-10 px-6 text-center text-muted-foreground">
							<p className="text-sm">Nhập thông tin sản phẩm bạn muốn tìm vào ô trên</p>
						</div>
					)}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
}

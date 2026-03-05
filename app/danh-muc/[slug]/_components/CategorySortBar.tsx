"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CategorySortBarProps {
	sortBy: string;
	setSortBy: (val: string) => void;
}

export default function CategorySortBar({ sortBy, setSortBy }: CategorySortBarProps) {
	return (
		<div className="flex flex-col sm:flex-row sm:items-center gap-4 py-4 border-b border-border mb-6">
			<span className="text-sm font-semibold text-foreground whitespace-nowrap">
				Xếp theo:
			</span>
			<RadioGroup
				value={sortBy}
				onValueChange={setSortBy}
				className="flex flex-wrap items-center gap-4 sm:gap-6"
			>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="name-asc" id="name-asc" />
					<label
						htmlFor="name-asc"
						className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
					>
						Tên A-Z
					</label>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="name-desc" id="name-desc" />
					<label
						htmlFor="name-desc"
						className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
					>
						Tên Z-A
					</label>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="newest" id="newest" />
					<label
						htmlFor="newest"
						className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
					>
						Hàng mới
					</label>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="price-asc" id="price-asc" />
					<label
						htmlFor="price-asc"
						className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
					>
						Giá thấp đến cao
					</label>
				</div>
				<div className="flex items-center space-x-2">
					<RadioGroupItem value="price-desc" id="price-desc" />
					<label
						htmlFor="price-desc"
						className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
					>
						Giá cao xuống thấp
					</label>
				</div>
			</RadioGroup>
		</div>
	);
}

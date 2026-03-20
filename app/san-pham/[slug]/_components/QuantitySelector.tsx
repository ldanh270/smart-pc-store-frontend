"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
	value: number;
	maxQuantity: number;
	onChange: (quantity: number) => void;
}

export default function QuantitySelector({
	value,
	maxQuantity,
	onChange,
}: QuantitySelectorProps) {
	const handleDecrement = () => {
		if (value > 1) onChange(value - 1);
	};

	const handleIncrement = () => {
		if (value < maxQuantity) onChange(value + 1);
	};

	return (
		<div className="flex flex-col gap-2">
			<span className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
				Số lượng
			</span>
			<div className="flex items-center gap-0">
				<Button
					variant="outline"
					size="icon"
					className="h-10 w-10 rounded-r-none"
					onClick={handleDecrement}
					disabled={value <= 1}
					aria-label="Giảm số lượng"
				>
					<Minus className="h-4 w-4" />
				</Button>

				<div className="flex h-10 w-14 items-center justify-center border-y border-border bg-background font-mono text-sm font-medium">
					{value}
				</div>

				<Button
					variant="outline"
					size="icon"
					className="h-10 w-10 rounded-l-none"
					onClick={handleIncrement}
					disabled={value >= maxQuantity}
					aria-label="Tăng số lượng"
				>
					<Plus className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}

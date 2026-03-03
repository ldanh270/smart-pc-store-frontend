"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteCategoryDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	categoryName: string;
	onConfirm: () => void;
}

export default function DeleteCategoryDialog({
	open,
	onOpenChange,
	categoryName,
	onConfirm,
}: DeleteCategoryDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-106.25">
				<DialogHeader>
					<DialogTitle>Xóa danh mục?</DialogTitle>
					<DialogDescription>
						Bạn có chắc chắn muốn xóa danh mục{" "}
						<span className="font-semibold text-foreground">
							{categoryName}
						</span>
						? Hành động này không thể hoàn tác và có thể ảnh hưởng đến
						các sản phẩm thuộc danh mục này.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Hủy
					</Button>
					<Button variant="destructive" onClick={onConfirm}>
						Tiếp tục xóa
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

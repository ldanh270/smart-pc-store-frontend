import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

// ─── Props ──────────────────────────────────────────────────────────────────

interface DeleteUserDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	userName: string;
	onConfirm: () => void;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function DeleteUserDialog({
	open,
	onOpenChange,
	userName,
	onConfirm,
}: DeleteUserDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10">
						<AlertTriangle className="size-6 text-destructive" />
					</div>
					<DialogTitle className="text-center">
						Xác Nhận Xóa
					</DialogTitle>
					<DialogDescription className="text-center">
						Bạn có chắc chắn muốn xóa người dùng{" "}
						<span className="font-semibold text-foreground">
							{userName}
						</span>
						? Hành động này không thể hoàn tác.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:justify-center">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
					>
						Hủy
					</Button>
					<Button variant="destructive" onClick={onConfirm}>
						Xóa Người Dùng
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

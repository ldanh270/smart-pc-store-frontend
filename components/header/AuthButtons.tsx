import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthButtons() {
	return (
		<div className="flex items-center gap-1.5">
			<Button
				variant="ghost"
				size="sm"
				asChild
				className="h-9 px-4 text-xs font-semibold text-muted-foreground hover:text-foreground"
			>
				<Link href="/dang-nhap">Đăng nhập</Link>
			</Button>

			<Button
				variant="default"
				size="sm"
				asChild
				className="h-9 rounded-lg px-4 text-xs font-semibold shadow-md shadow-primary/20"
			>
				<Link href="/dang-ky">Đăng ký</Link>
			</Button>
		</div>
	);
}

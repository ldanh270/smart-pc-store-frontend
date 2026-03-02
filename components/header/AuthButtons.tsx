import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";

export default function AuthButtons() {
	return (
		<div className="flex items-center gap-1">
			<Button
				variant="ghost"
				size="sm"
				asChild
			>
				<Link href="/dang-nhap">
					<LogIn className="size-4" />
					Đăng Nhập
				</Link>
			</Button>

			<Button
				variant="default"
				size="sm"
				asChild
			>
				<Link href="/dang-ky">
					<UserPlus className="size-4" />
					Đăng Ký
				</Link>
			</Button>
		</div>
	);
}

import { Button } from "@/components/ui/button"

import Link from "next/link"

export default function AuthButtons() {
  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="text-muted-foreground hover:text-foreground h-9 px-4 text-xs font-semibold"
      >
        <Link href="/dang-nhap">Đăng nhập</Link>
      </Button>

      <Button
        variant="default"
        size="sm"
        asChild
        className="shadow-primary/20 h-9 rounded-lg px-4 text-xs font-semibold shadow-md"
      >
        <Link href="/dang-ky">Đăng ký</Link>
      </Button>
    </div>
  )
}

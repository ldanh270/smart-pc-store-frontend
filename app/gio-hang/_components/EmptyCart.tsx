import { Button } from "@/components/ui/button"

import { ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="bg-muted mb-6 flex size-24 items-center justify-center rounded-full">
        <ShoppingCart className="text-muted-foreground size-10" />
      </div>
      <h2 className="text-foreground mb-2 font-sans text-xl font-semibold">Giỏ hàng trống</h2>
      <p className="text-muted-foreground mb-6 max-w-sm text-center text-sm">
        Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá các sản phẩm của chúng tôi!
      </p>
      <Button size="lg" asChild>
        <Link href="/" className="font-sans font-semibold tracking-wider uppercase">
          Tiếp Tục Mua Hàng
        </Link>
      </Button>
    </div>
  )
}

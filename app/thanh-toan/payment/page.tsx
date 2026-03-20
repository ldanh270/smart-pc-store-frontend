import { Suspense } from "react"

import { Loader2 } from "lucide-react"
import type { Metadata } from "next"

import PaymentClient from "./_components/PaymentClient"

export const metadata: Metadata = {
  title: "Quét Mã Thanh Toán | Smart PC Store",
  description: "Hoàn tất thanh toán đơn hàng của bạn tại Smart PC Store.",
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <p className="text-muted-foreground text-sm">Đang tải...</p>
          </div>
        </main>
      }
    >
      <PaymentClient />
    </Suspense>
  )
}

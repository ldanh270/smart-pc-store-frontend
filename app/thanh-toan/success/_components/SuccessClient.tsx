"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function SuccessClient() {
  const searchParams = useSearchParams()
  const txnCode = searchParams.get("txnCode")

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="animate-in fade-in zoom-in w-full max-w-md duration-500">
        <div className="border-border bg-card rounded-2xl border p-8 text-center shadow-sm">
          {/* Icon */}
          <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-14 w-14 text-emerald-600" />
          </div>

          {/* Title */}
          <h1 className="text-foreground font-sans text-2xl font-bold">Thanh Toán Thành Công!</h1>
          <p className="text-muted-foreground mt-2">
            Đơn hàng của bạn đã được xác nhận và đang được xử lý.
          </p>

          {/* Transaction code */}
          {txnCode && (
            <>
              <Separator className="my-5" />
              <div className="border-border bg-muted/30 rounded-xl border px-4 py-3">
                <p className="text-muted-foreground mb-1 text-xs">Mã giao dịch</p>
                <p className="text-foreground font-mono text-base font-semibold tracking-wider">
                  {txnCode}
                </p>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-2">
            <Button
              asChild
              size="lg"
              className="w-full font-sans font-bold tracking-wider uppercase"
            >
              <Link href="/">Tiếp tục mua hàng</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

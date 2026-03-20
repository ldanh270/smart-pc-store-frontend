import { Skeleton } from "@/components/ui/skeleton"

import { Suspense } from "react"

import type { Metadata } from "next"

import OrderHistoryClient from "./_components/OrderHistoryClient"

export const metadata: Metadata = {
  title: "Đơn hàng của tôi | Smart PC Store",
  description: "Xem lịch sử và theo dõi trạng thái đơn hàng của bạn",
}

export default function OrderHistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-8 lg:px-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      }
    >
      <OrderHistoryClient />
    </Suspense>
  )
}

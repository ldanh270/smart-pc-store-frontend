import type { Metadata } from "next"

import CartPageClient from "./_components/CartPageClient"

export const metadata: Metadata = {
  title: "Giỏ Hàng | Smart PC Store",
  description: "Xem và quản lý giỏ hàng của bạn tại Smart PC Store.",
}

export default function CartPage() {
  return <CartPageClient />
}

import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutClient from "./_components/CheckoutClient";

export const metadata: Metadata = {
  title: "Thanh Toán | Smart PC Store",
  description: "Xác nhận đơn hàng và thanh toán tại Smart PC Store.",
};

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutClient />
    </Suspense>
  );
}

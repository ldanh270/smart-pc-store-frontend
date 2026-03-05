import type { Metadata } from "next";
import { Suspense } from "react";
import PaymentClient from "./_components/PaymentClient";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Quét Mã Thanh Toán | Smart PC Store",
  description: "Hoàn tất thanh toán đơn hàng của bạn tại Smart PC Store.",
};

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Đang tải...</p>
          </div>
        </main>
      }
    >
      <PaymentClient />
    </Suspense>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import SuccessClient from "./_components/SuccessClient";

export const metadata: Metadata = {
  title: "Đặt Hàng Thành Công | Smart PC Store",
  description: "Cảm ơn bạn đã mua hàng tại Smart PC Store.",
};

export default function SuccessPage() {
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
      <SuccessClient />
    </Suspense>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const txnCode = searchParams.get("txnCode");

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
          {/* Icon */}
          <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-14 w-14 text-emerald-600" />
          </div>

          {/* Title */}
          <h1 className="font-sans text-2xl font-bold text-foreground">
            Thanh Toán Thành Công!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Đơn hàng của bạn đã được xác nhận và đang được xử lý.
          </p>

          {/* Transaction code */}
          {txnCode && (
            <>
              <Separator className="my-5" />
              <div className="rounded-xl border border-border bg-muted/30 px-4 py-3">
                <p className="mb-1 text-xs text-muted-foreground">Mã giao dịch</p>
                <p className="font-mono text-base font-semibold tracking-wider text-foreground">
                  {txnCode}
                </p>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-2">
            <Button asChild size="lg" className="w-full font-sans font-bold uppercase tracking-wider">
              <Link href="/">Tiếp tục mua hàng</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

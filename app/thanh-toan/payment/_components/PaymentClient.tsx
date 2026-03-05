"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Clock, Loader2, RefreshCw, XCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { orderService } from "@/services/orderService";
import { cartService } from "@/services/cartService";
import { useCartStore } from "@/stores/useCartStore";
import { PaymentQRInfo } from "@/types/order";

const TIMEOUT_SECONDS = 5 * 60; // 5 minutes
const POLL_INTERVAL_MS = 3000; // 3 seconds

type PaymentStatus = "loading" | "waiting" | "success" | "timeout";

export default function PaymentClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [qrInfo, setQrInfo] = useState<PaymentQRInfo | null>(null);
  const [status, setStatus] = useState<PaymentStatus>("loading");
  const [timeLeft, setTimeLeft] = useState(TIMEOUT_SECONDS);
  const [statusMessage, setStatusMessage] = useState("");

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    pollRef.current = null;
    countdownRef.current = null;
  }, []);

  const handleSuccess = useCallback(async () => {
    clearTimers();
    setStatus("success");
    try {
      await cartService.clearCart();
    } catch {
      // best-effort — don't block success flow
    }
    useCartStore.setState({ items: [], totalItems: 0, totalPrice: 0 });
    setTimeout(() => router.push("/"), 3000);
  }, [clearTimers, router]);

  const handleTimeout = useCallback(async (id: number) => {
    clearTimers();
    setStatus("timeout");
    try {
      await orderService.cancelOrder(id);
    } catch {
      // best-effort — order may already be cancelled server-side
    }
  }, [clearTimers]);

  useEffect(() => {
    const parsedOrderId = orderId ? parseInt(orderId, 10) : null;

    if (!parsedOrderId || isNaN(parsedOrderId)) {
      router.push("/gio-hang");
      return;
    }

    let cancelled = false;

    const init = async () => {
      try {
        const info = await orderService.getPaymentQR(parsedOrderId);
        if (cancelled) return;

        setQrInfo(info);
        setStatus("waiting");

        // Countdown: tick every second
        countdownRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              handleTimeout(parsedOrderId);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // Polling: check transaction every 3s
        pollRef.current = setInterval(async () => {
          try {
            const result = await orderService.checkTransaction(info.transactionCode);
            if (cancelled) return;
            setStatusMessage(result.message);
            if (result.found) {
              handleSuccess();
            }
          } catch {
            // network hiccup — keep polling
          }
        }, POLL_INTERVAL_MS);
      } catch {
        if (!cancelled) {
          toast.error("Không thể lấy thông tin thanh toán. Vui lòng thử lại.");
          router.push("/gio-hang");
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [orderId, router, handleSuccess, handleTimeout, clearTimers]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const progress = ((TIMEOUT_SECONDS - timeLeft) / TIMEOUT_SECONDS) * 100;
  const isUrgent = timeLeft < 60 && timeLeft > 0;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Đang tải thông tin thanh toán...</p>
        </div>
      </main>
    );
  }

  // ── Success ────────────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in duration-500">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-14 w-14 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-sans text-2xl font-bold text-foreground">
              Thanh Toán Thành Công!
            </h2>
            <p className="mt-1 text-muted-foreground">
              Đơn hàng của bạn đã được xác nhận.
            </p>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              Đang chuyển về trang chủ...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ── Timeout ────────────────────────────────────────────────────────────────
  if (status === "timeout") {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center animate-in fade-in duration-300">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-14 w-14 text-red-500" />
          </div>
          <div>
            <h2 className="font-sans text-2xl font-bold text-foreground">
              Giao Dịch Hết Hạn
            </h2>
            <p className="mt-1 text-muted-foreground">
              Phiên thanh toán đã hết 5 phút. Đơn hàng của bạn đã bị hủy.
            </p>
          </div>
          <Button asChild size="lg" className="mt-2">
            <Link href="/gio-hang">Quay lại giỏ hàng</Link>
          </Button>
        </div>
      </main>
    );
  }

  // ── Waiting (main QR UI) ───────────────────────────────────────────────────
  return (
    <main className="mx-auto max-w-lg px-4 py-8 lg:px-0">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="font-sans text-2xl font-bold text-foreground">
          Quét Mã Thanh Toán
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mở ứng dụng ngân hàng và quét mã QR bên dưới để hoàn tất
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Progress bar */}
        <div className="h-1.5 bg-muted">
          <div
            className={cn(
              "h-full transition-all duration-1000 ease-linear",
              isUrgent ? "bg-red-500" : "bg-primary"
            )}
            style={{ width: `${100 - progress}%` }}
          />
        </div>

        <div className="p-6">
          {/* Amount + transaction code */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-muted/30 p-3">
              <p className="mb-1 text-xs text-muted-foreground">Số tiền</p>
              <p className="font-mono text-lg font-bold text-primary">
                {qrInfo?.amount.toLocaleString("vi-VN")}đ
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-3">
              <p className="mb-1 text-xs text-muted-foreground">Nội dung CK</p>
              <p className="break-all font-mono text-sm font-semibold tracking-wider text-foreground">
                {qrInfo?.transactionCode}
              </p>
            </div>
          </div>

          {/* QR code */}
          <div className="flex justify-center mb-5">
            <div className="rounded-2xl border-2 border-border bg-white p-3 shadow-inner">
              {qrInfo?.qrUrl && (
                <Image
                  src={qrInfo.qrUrl}
                  alt="Mã QR thanh toán"
                  width={224}
                  height={224}
                  className="rounded-lg"
                  unoptimized
                  priority
                />
              )}
            </div>
          </div>

          {/* Countdown */}
          <div
            className={cn(
              "mb-4 flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 transition-colors",
              isUrgent
                ? "border-red-200 bg-red-50 text-red-500"
                : "border-border bg-muted/40 text-foreground"
            )}
          >
            <Clock className="h-4 w-4 shrink-0" />
            <span className="font-mono text-xl font-bold">
              {formatTime(timeLeft)}
            </span>
            <span
              className={cn(
                "text-sm",
                isUrgent ? "text-red-400" : "text-muted-foreground"
              )}
            >
              còn lại
            </span>
          </div>

          {/* Polling status */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            <span className="truncate">
              {statusMessage || "Đang chờ xác nhận thanh toán..."}
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Hướng dẫn
        </p>
        <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
          <li>Mở ứng dụng ngân hàng hoặc ví điện tử của bạn</li>
          <li>Chọn tính năng &quot;Quét mã QR&quot;</li>
          <li>Quét mã QR bên trên và xác nhận thanh toán</li>
          <li>Hệ thống tự động xác nhận sau khi nhận được tiền</li>
        </ol>
      </div>

      {/* Cancel fallback */}
      <div className="mt-3 text-center">
        <button
          onClick={() => handleTimeout(parseInt(orderId!, 10))}
          className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Hủy giao dịch
        </button>
      </div>
    </main>
  );
}

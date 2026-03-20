"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { cartService } from "@/services/cartService"
import { orderService } from "@/services/orderService"
import { useCartStore } from "@/stores/useCartStore"
import { PaymentQRInfo } from "@/types/order"

import { useCallback, useEffect, useRef, useState } from "react"

import { Clock, Loader2, RefreshCw, XCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const TIMEOUT_SECONDS = 5 * 60 // 5 minutes
const POLL_INTERVAL_MS = 3000 // 3 seconds

type PaymentStatus = "loading" | "waiting" | "timeout"

export default function PaymentClient() {
  const router = useRouter()

  const [qrInfo, setQrInfo] = useState<PaymentQRInfo | null>(null)
  const [status, setStatus] = useState<PaymentStatus>("loading")
  const [timeLeft, setTimeLeft] = useState(TIMEOUT_SECONDS)
  const [statusMessage, setStatusMessage] = useState("")

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimers = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
    pollRef.current = null
    countdownRef.current = null
  }, [])

  const handleSuccess = useCallback(
    async (transactionCode: string) => {
      clearTimers()
      try {
        await cartService.clearCart()
      } catch {
        // best-effort — don't block success flow
      }
      useCartStore.setState({ items: [], totalItems: 0, totalPrice: 0 })
      sessionStorage.removeItem("pendingPayment")
      router.push(`/thanh-toan/success?txnCode=${transactionCode}`)
    },
    [clearTimers, router],
  )

  const handleTimeout = useCallback(() => {
    clearTimers()
    setStatus("timeout")
  }, [clearTimers])

  useEffect(() => {
    const raw = sessionStorage.getItem("pendingPayment")
    if (!raw) {
      toast.error("Không tìm thấy thông tin thanh toán.")
      router.push("/gio-hang")
      return
    }

    let info: PaymentQRInfo
    try {
      info = JSON.parse(raw) as PaymentQRInfo
    } catch {
      toast.error("Thông tin thanh toán không hợp lệ.")
      router.push("/gio-hang")
      return
    }

    let cancelled = false

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQrInfo(info)
    setStatus("waiting")

    // Countdown: tick every second
    countdownRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Polling: check transaction every 3s
    pollRef.current = setInterval(async () => {
      try {
        const result = await orderService.checkTransaction(info.transactionCode)
        if (cancelled) return
        setStatusMessage(result.message)
        if (result.completed) {
          handleSuccess(info.transactionCode)
        }
      } catch {
        // network hiccup — keep polling
      }
    }, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      clearTimers()
    }
  }, [router, handleSuccess, handleTimeout, clearTimers])

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const s = (seconds % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  const progress = ((TIMEOUT_SECONDS - timeLeft) / TIMEOUT_SECONDS) * 100
  const isUrgent = timeLeft < 60 && timeLeft > 0

  // ── Loading ────────────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-primary h-10 w-10 animate-spin" />
          <p className="text-muted-foreground text-sm">Đang tải thông tin thanh toán...</p>
        </div>
      </main>
    )
  }

  // ── Timeout ────────────────────────────────────────────────────────────────
  if (status === "timeout") {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="animate-in fade-in flex flex-col items-center gap-4 text-center duration-300">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-14 w-14 text-red-500" />
          </div>
          <div>
            <h2 className="text-foreground font-sans text-2xl font-bold">Giao Dịch Hết Hạn</h2>
            <p className="text-muted-foreground mt-1">
              Phiên thanh toán đã hết 5 phút. Vui lòng thử lại.
            </p>
          </div>
          <Button asChild size="lg" className="mt-2">
            <Link href="/gio-hang">Quay lại giỏ hàng</Link>
          </Button>
        </div>
      </main>
    )
  }

  // ── Waiting (main QR UI) ───────────────────────────────────────────────────
  return (
    <main className="mx-auto max-w-lg px-4 py-8 lg:px-0">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-foreground font-sans text-2xl font-bold">Quét Mã Thanh Toán</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Mở ứng dụng ngân hàng và quét mã QR bên dưới để hoàn tất
        </p>
      </div>

      <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
        {/* Progress bar */}
        <div className="bg-muted h-1.5">
          <div
            className={cn(
              "h-full transition-all duration-1000 ease-linear",
              isUrgent ? "bg-red-500" : "bg-primary",
            )}
            style={{ width: `${100 - progress}%` }}
          />
        </div>

        <div className="p-6">
          {/* Amount + transaction code */}
          <div className="mb-5 grid grid-cols-2 gap-3">
            <div className="border-border bg-muted/30 rounded-xl border p-3">
              <p className="text-muted-foreground mb-1 text-xs">Số tiền</p>
              <p className="text-primary font-mono text-lg font-bold">
                {qrInfo?.amount.toLocaleString("vi-VN")}đ
              </p>
            </div>
            <div className="border-border bg-muted/30 rounded-xl border p-3">
              <p className="text-muted-foreground mb-1 text-xs">Nội dung CK</p>
              <p className="text-foreground font-mono text-sm font-semibold tracking-wider break-all">
                {qrInfo?.transactionCode}
              </p>
            </div>
          </div>

          {/* QR code */}
          <div className="mb-5 flex justify-center">
            <div className="border-border rounded-2xl border-2 bg-white p-3 shadow-inner">
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
                : "border-border bg-muted/40 text-foreground",
            )}
          >
            <Clock className="h-4 w-4 shrink-0" />
            <span className="font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
            <span className={cn("text-sm", isUrgent ? "text-red-400" : "text-muted-foreground")}>
              còn lại
            </span>
          </div>

          {/* Polling status */}
          <div className="text-muted-foreground flex items-center justify-center gap-2 text-sm">
            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            <span className="truncate">{statusMessage || "Đang chờ xác nhận thanh toán..."}</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="border-border bg-muted/30 mt-4 rounded-xl border p-4">
        <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
          Hướng dẫn
        </p>
        <ol className="text-muted-foreground list-inside list-decimal space-y-1 text-sm">
          <li>Mở ứng dụng ngân hàng hoặc ví điện tử của bạn</li>
          <li>Chọn tính năng &quot;Quét mã QR&quot;</li>
          <li>Quét mã QR bên trên và xác nhận thanh toán</li>
          <li>Hệ thống tự động xác nhận sau khi nhận được tiền</li>
        </ol>
      </div>

      {/* Cancel fallback */}
      <div className="mt-3 text-center">
        <button
          onClick={handleTimeout}
          className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 transition-colors hover:underline"
        >
          Hủy giao dịch
        </button>
      </div>
    </main>
  )
}

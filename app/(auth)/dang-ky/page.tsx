import { Shield, UserPlus, Zap } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import FloatingGlassBlock from "../dang-nhap/_components/FloatingGlassBlock"
import SignupForm from "./_components/SignupForm"

export const metadata: Metadata = {
  title: "Đăng ký | Smart PC Store",
  description: "Tạo tài khoản Smart PC Store để mua sắm PC và gaming gear cao cấp.",
}

export default function SignupPage() {
  return (
    <main className="bg-mesh-blue relative flex min-h-svh items-center justify-center overflow-hidden p-4 md:p-6 lg:p-8">
      {/* Subtle background decoration */}
      <div className="bg-primary/10 pointer-events-none absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full blur-[120px]" />
      <div className="bg-secondary/10 pointer-events-none absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full blur-[120px]" />

      <div className="bg-card border-border/40 relative z-10 flex w-full max-w-350 gap-4 overflow-hidden rounded-[2.5rem] border p-2 shadow-2xl md:gap-6">
        {/* Left Side: Signup Form */}
        <div className="flex min-h-187.5 w-full flex-col justify-center overflow-y-auto rounded-[2.5rem] p-8 md:w-1/2 md:p-10 lg:min-h-212.5 lg:px-20 lg:py-14">
          {/* Form Section */}
          <div className="animate-in fade-in slide-in-from-left-8 mx-auto w-full max-w-105 space-y-10 duration-700">
            <div className="space-y-4 text-center">
              <h1 className="text-foreground font-serif text-4xl font-medium tracking-tight md:text-5xl">
                Tạo tài khoản
              </h1>
              <p className="text-muted-foreground text-[15px] font-medium">
                Bắt đầu hành trình giải trí đỉnh cao cùng Smart PC
              </p>
            </div>

            <SignupForm />

            {/* Footer Link */}
            <div className="pt-2 text-center">
              <p className="text-muted-foreground group text-sm font-medium">
                Đã có tài khoản?{" "}
                <Link
                  href="/dang-nhap"
                  className="text-primary hover:text-primary/80 after:bg-primary relative inline-block font-bold transition-all after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-300 after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-100"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Marketing with Background Image & 3D Blocks */}
        <div className="relative hidden min-h-187.5 w-1/2 flex-col justify-end gap-10 overflow-hidden rounded-[2rem] p-10 perspective-distant md:flex lg:min-h-212.5">
          {/* Background Image for the Right Panel */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero/slide-pc-gaming.png"
              alt="Gaming Hardware"
              fill
              className="object-cover brightness-[0.6] contrast-[1.1] transition-transform duration-2000 hover:scale-105"
              priority
            />
            <div className="from-foreground/90 via-foreground/30 absolute inset-0 bg-linear-to-t to-transparent" />
            <div className="bg-mesh-subtle absolute inset-0 opacity-40 mix-blend-overlay" />
          </div>

          {/* 3D Floating Glass Blocks (Mirrored positioning) */}
          <FloatingGlassBlock
            className="top-20 right-20 opacity-70"
            size="lg"
            delay={0.5}
            rotate={-10}
            moveRange={30}
          >
            <Shield className="h-12 w-12 text-white/80 drop-shadow-lg" strokeWidth={1.5} />
          </FloatingGlassBlock>

          <FloatingGlassBlock
            className="top-1/3 left-15 opacity-50"
            size="md"
            delay={1}
            duration={7}
            rotate={-15}
            moveRange={25}
          >
            <Zap className="h-8 w-8 text-white/80 drop-shadow-lg" strokeWidth={1.5} />
          </FloatingGlassBlock>

          <FloatingGlassBlock
            className="right-1/4 bottom-20 z-50 opacity-40"
            size="md"
            delay={0}
            duration={8}
            rotate={15}
            moveRange={20}
          >
            <UserPlus className="h-10 w-10 text-white/80 drop-shadow-lg" strokeWidth={1.5} />
          </FloatingGlassBlock>

          {/* Top Content */}
          <div className="relative z-20 flex items-center gap-4 pl-4">
            <div className="bg-primary h-px w-10" />
            <span className="text-primary-foreground/70 text-[11px] font-bold tracking-[0.4em] uppercase">
              EST 2026 • SMART PC
            </span>
          </div>

          {/* Bottom Content */}
          <div className="relative z-20 flex-col space-y-4 pb-12 pl-4">
            <h2 className="font-serif text-4xl leading-tight font-medium text-white lg:text-6xl">
              Xây dựng <br />
              <span className="text-gradient italic">Góc máy trong mơ</span>
            </h2>
            <p className="max-w-sm text-sm leading-relaxed font-medium text-slate-300/80">
              Gaming gear, linh kiện hàng đầu và dịch vụ chuyên nghiệp cho chiến thắng tiếp theo.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

import { Cpu, Gamepad2, Monitor } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import FloatingGlassBlock from "./_components/FloatingGlassBlock"
import LoginForm from "./_components/LoginForm"

export const metadata: Metadata = {
  title: "Đăng nhập | Smart PC Store",
  description: "Đăng nhập vào tài khoản Smart PC Store để mua sắm PC và gaming gear cao cấp.",
}

export default function LoginPage() {
  return (
    <main className="bg-mesh-blue relative flex min-h-svh items-center justify-center overflow-hidden p-4 md:p-6 lg:p-8">
      {/* Subtle background decoration */}
      <div className="bg-primary/10 pointer-events-none absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full blur-[120px]" />
      <div className="bg-secondary/10 pointer-events-none absolute right-[-10%] bottom-[-10%] h-[40%] w-[40%] rounded-full blur-[120px]" />

      <div className="bg-card border-border/40 relative z-10 flex w-full max-w-350 gap-4 overflow-hidden rounded-[2.5rem] border p-2 shadow-2xl md:gap-6">
        {/* Left Side: Marketing with Background Image & 3D Blocks */}
        <div className="relative hidden min-h-187.5 w-1/2 flex-col justify-end gap-10 overflow-hidden rounded-[2rem] p-10 perspective-distant md:flex lg:min-h-212.5">
          {/* Background Image for the Left Panel */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/hero/slide-setup.png"
              alt="Gaming Setup"
              fill
              className="object-cover brightness-[0.7] contrast-[1.1] transition-transform duration-2000 hover:scale-105"
              priority
            />
            <div className="bg-linear-to-trom-foreground/90 via-foreground/30 absolute inset-0 to-transparent" />
            <div className="bg-mesh-subtle absolute inset-0 opacity-40 mix-blend-overlay" />
          </div>

          {/* 3D Floating Glass Blocks (UI UX Pro Max Style) */}
          {/* 1. MONITOR (Top Left): 
    - Vì ở góc trên bên trái, nên cho nó hơi cúi xuống và nghiêng mặt về bên phải.
    - Khi hover: Ngửa nhẹ lên đón mắt người dùng (-5), xoay ngang (15).
*/}
          <FloatingGlassBlock
            className="top-20 left-20 opacity-70"
            size="lg"
            delay={0}
            rotate={8} // Nghiêng nhẹ ban đầu
            moveRange={20}
            hoverRotateX={-5}
            hoverRotateY={15}
            hoverRotateZ={-2}
          >
            <Monitor className="h-12 w-12 text-white/80 drop-shadow-lg" strokeWidth={1.5} />
          </FloatingGlassBlock>

          {/* 2. CPU (Middle Right): 
    - Nằm ở bên phải, cần xoay mặt về bên trái (hướng vào form).
    - Khi hover: Xoay lật nhẹ sang trái (-10), gần như đứng thẳng.
*/}
          <FloatingGlassBlock
            className="top-1/5 right-20 opacity-50"
            size="md"
            delay={1.5}
            duration={7}
            rotate={-6} // Trục âm để tạo sự đối lập nhẹ với khối Monitor
            moveRange={25}
            hoverRotateX={-10}
            hoverRotateY={-10}
            hoverRotateZ={4}
          >
            <Cpu className="h-8 w-8 text-white/80 drop-shadow-lg" strokeWidth={1.5} />
          </FloatingGlassBlock>

          {/* 3. GAMEPAD (Bottom Right/Center): 
    - Nằm ở dưới cùng, nên hơi ngửa lên trên một chút.
    - Khi hover: Ngửa mặt kính trực diện lên (X âm) và xoay ngang cực kỳ nhẹ nhàng.
*/}
          <FloatingGlassBlock
            className="right-1/6 bottom-20 z-50 opacity-40"
            size="md"
            delay={2}
            duration={8}
            rotate={5}
            moveRange={20}
            hoverRotateX={10} // Ngửa lên
            hoverRotateY={-15} // Xoay nhẹ sang trái
            hoverRotateZ={0}
          >
            <Gamepad2 className="h-10 w-10 text-white/80 drop-shadow-lg" strokeWidth={1.5} />
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

        {/* Right Side: Login Form */}
        <div className="flex min-h-187.5 w-full flex-col justify-center overflow-y-auto rounded-[2.5rem] p-8 md:w-1/2 md:p-10 lg:min-h-212.5 lg:px-20 lg:py-14">
          {/* Form Section */}
          <div className="animate-in fade-in slide-in-from-right-8 mx-auto w-full max-w-105 space-y-10 duration-700">
            <div className="space-y-4 text-center">
              <div className="mb-2 inline-flex items-center justify-center p-3"></div>
              <h1 className="text-foreground font-serif text-4xl font-medium tracking-tight md:text-5xl">
                Chào mừng quay lại
              </h1>
              <p className="text-muted-foreground text-[15px] font-medium">
                Nhập thông tin của bạn để truy cập tài khoản
              </p>
            </div>

            <LoginForm />
            {/* Footer Link */}
            <div className="pt-2 text-center">
              <p className="text-muted-foreground group text-sm font-medium">
                Chưa có tài khoản?{" "}
                <Link
                  href="/dang-ky"
                  className="text-primary hover:text-primary/80 after:bg-primary relative inline-block font-bold transition-all after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:transition-transform after:duration-300 after:content-[''] hover:after:origin-bottom-left hover:after:scale-x-100"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SignupForm from "./_components/SignupForm";
import FloatingGlassBlock from "../dang-nhap/_components/FloatingGlassBlock";
import { Shield, Zap, UserPlus } from "lucide-react";

export const metadata: Metadata = {
	title: "Đăng ký | Smart PC Store",
	description: "Tạo tài khoản Smart PC Store để mua sắm PC và gaming gear cao cấp.",
};

export default function SignupPage() {
	return (
		<main className="flex min-h-svh items-center justify-center bg-mesh-blue p-4 md:p-6 lg:p-8 relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />

			<div className="relative z-10 flex w-full max-w-[1400px] gap-4 md:gap-6 shadow-2xl rounded-[2.5rem] bg-card p-2 border border-border/40 overflow-hidden">
				
                {/* Left Side: Signup Form */}
				<div className="flex w-full flex-col justify-center rounded-[2.5rem] md:w-1/2 p-8 md:p-10 lg:px-20 lg:py-14 overflow-y-auto min-h-[750px] lg:min-h-[850px]">
					{/* Form Section */}
					<div className="mx-auto w-full max-w-[420px] space-y-10 animate-in fade-in slide-in-from-left-8 duration-700">
						<div className="space-y-4 text-center">
							<h1 className="font-serif text-4xl md:text-5xl font-medium tracking-tight text-foreground">
								Tạo tài khoản
							</h1>
							<p className="text-[15px] font-medium text-muted-foreground">
								Bắt đầu hành trình giải trí đỉnh cao cùng Smart PC
							</p>
						</div>

						<SignupForm />

                        {/* Footer Link */}
                        <div className="text-center pt-2">
                            <p className="text-sm font-medium text-muted-foreground group">
                                Đã có tài khoản? <Link href="/dang-nhap" className="font-bold text-primary transition-all hover:text-primary/80 relative inline-block after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">Đăng nhập ngay</Link>
                            </p>
                        </div>
					</div>
				</div>

				{/* Right Side: Marketing with Background Image & 3D Blocks */}
				<div className="relative hidden w-1/2 flex-col justify-end gap-10 rounded-[2rem] overflow-hidden p-10 md:flex min-h-[750px] lg:min-h-[850px] [perspective:1200px]">
					{/* Background Image for the Right Panel */}
					<div className="absolute inset-0 z-0">
						<Image
							src="/hero/slide-pc-gaming.png"
							alt="Gaming Hardware"
							fill
							className="object-cover brightness-[0.6] contrast-[1.1] transition-transform duration-[2000ms] hover:scale-105"
							priority
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-transparent" />
                        <div className="absolute inset-0 bg-mesh-subtle opacity-40 mix-blend-overlay" />
					</div>

					{/* 3D Floating Glass Blocks (Mirrored positioning) */}
					<FloatingGlassBlock className="top-20 right-20 opacity-70" size="lg" delay={0.5} rotate={-10} moveRange={30}>
                        <Shield className="w-12 h-12 text-white/80 drop-shadow-lg" strokeWidth={1.5} />
                    </FloatingGlassBlock>

					<FloatingGlassBlock className="top-1/3 left-15 opacity-50" size="md" delay={1} duration={7} rotate={-15} moveRange={25}>
                        <Zap className="w-8 h-8 text-white/80 drop-shadow-lg" strokeWidth={1.5} />
                    </FloatingGlassBlock>
                    
					<FloatingGlassBlock className="bottom-40 left-1/4 opacity-40" size="md" delay={2.5} duration={8} rotate={15} moveRange={20}>
                        <UserPlus className="w-10 h-10 text-white/80 drop-shadow-lg" strokeWidth={1.5} />
                    </FloatingGlassBlock>

					{/* Top Content */}
					<div className="relative z-20 flex items-center gap-4 pl-4">
						<div className="h-px w-10 bg-primary" />
						<span className="text-[11px] font-bold uppercase tracking-[0.4em] text-primary-foreground/70">
							EST 2026 • SMART PC
						</span>
					</div>

					{/* Bottom Content */}
					<div className="relative z-20 space-y-4 flex-col pl-4 pb-12">
						<h2 className="font-serif text-4xl font-medium leading-tight text-white lg:text-6xl">
							Xây dựng <br />
							<span className="italic text-gradient">Góc máy trong mơ</span>
						</h2>
						<p className="max-w-sm text-sm font-medium leading-relaxed text-slate-300/80">
							Gaming gear, linh kiện hàng đầu và dịch vụ chuyên nghiệp cho chiến thắng tiếp theo.
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}

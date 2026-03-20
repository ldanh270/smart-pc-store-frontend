import { CONTACTS } from "@/configs/Contacts"

import { faApple, faGooglePlay } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
  Zap,
} from "lucide-react"
import Link from "next/link"

const QUICK_LINKS = [
  { label: "Trang Chủ", href: "/" },
  { label: "Tất cả sản phẩm", href: "/san-pham" },
  { label: "Danh mục", href: "/danh-muc" },
  { label: "Về Chúng Tôi", href: "/ve-chung-toi" },
]

const SUPPORT_LINKS = [
  { label: "Chính sách bảo hành", href: "/chinh-sach-bao-hanh" },
  { label: "Chính sách đổi trả", href: "/chinh-sach-doi-tra" },
  { label: "Hướng dẫn mua hàng", href: "/huong-dan-mua-hang" },
  { label: "Hướng dẫn thanh toán", href: "/huong-dan-thanh-toan" },
  { label: "Liên hệ hỗ trợ", href: "/lien-he" },
]

export default function Footer() {
  return (
    <footer className="border-border/40 bg-foreground text-background relative overflow-hidden border-t">
      {/* Grid lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(var(--background) 1px, transparent 1px), linear-gradient(90deg, var(--background) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative z-10 mx-auto px-4 lg:max-w-7xl lg:px-8">
        {/* ── Main grid ── */}
        <div className="grid gap-10 py-3 pt-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Brand — 4 cols */}
          <div className="space-y-5 lg:col-span-4 xl:col-span-4">
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <div className="bg-primary/15 group-hover:bg-primary/25 flex h-9 w-9 items-center justify-center rounded-xl transition-colors">
                <Zap className="text-primary size-5" fill="currentColor" />
              </div>
              <span className="text-background text-xl font-black tracking-tight">
                Smart <span className="text-primary">PC</span> Store
              </span>
            </Link>

            <p className="text-background/60 max-w-xs text-sm leading-relaxed">
              Cửa hàng linh kiện máy tính & PC gaming uy tín tại Việt Nam. Cam kết hàng chính hãng,
              giá tốt, giao hàng nhanh.
            </p>

            {/* Contact quick */}
            <div className="space-y-2">
              <a
                href={`tel:${CONTACTS.phone}`}
                className="text-background/60 hover:text-primary flex items-center gap-2 text-sm transition-colors"
              >
                <Phone className="text-primary/70 size-3.5" />
                {CONTACTS.phone}
              </a>
              <a
                href={`mailto:${CONTACTS.email}`}
                className="text-background/60 hover:text-primary flex items-center gap-2 text-sm transition-colors"
              >
                <Mail className="text-primary/70 size-3.5" />
                {CONTACTS.email}
              </a>
              <div className="text-background/60 flex items-center gap-2 text-sm">
                <MapPin className="text-primary/70 size-3.5 shrink-0" />
                Đà Nẵng, Việt Nam
              </div>
            </div>
          </div>

          {/* Quick Links — 2 cols */}
          <div className="lg:col-span-2">
            <h3 className="text-background/50 mb-5 text-xs font-bold tracking-[0.15em] uppercase">
              Điều Hướng
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group text-background/70 hover:text-primary -ml-5 flex items-center gap-1.5 text-sm transition-colors"
                  >
                    <ArrowRight className="size-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support — 2 cols */}
          <div className="lg:col-span-2 xl:col-span-2">
            <h3 className="text-background/50 mb-5 text-xs font-bold tracking-[0.15em] uppercase">
              Hỗ Trợ
            </h3>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group text-background/70 hover:text-primary -ml-5 flex items-center gap-1.5 text-sm transition-colors"
                  >
                    <ArrowRight className="size-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* App & Social */}
          <div className="space-y-6 lg:col-span-4 xl:col-span-4">
            <div>
              <h3 className="text-background/50 mb-4 text-xs font-bold tracking-[0.15em] uppercase">
                FOLLOW US
              </h3>
              <div className="flex items-center gap-2">
                <a
                  href="#"
                  className="bg-background/5 text-background/60 flex h-10 w-10 items-center justify-center rounded-xl transition hover:scale-105"
                >
                  <Youtube className="size-5" />
                </a>
                <a
                  href="#"
                  className="bg-background/5 text-background/60 hover:bg-background/10 hover:text-background flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:scale-105"
                >
                  <Linkedin className="size-5" />
                </a>
                <a
                  href="#"
                  className="bg-background/5 text-background/60 hover:bg-background/10 hover:text-background flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:scale-105"
                >
                  <Twitter className="size-5" />
                </a>
                <a
                  href="#"
                  className="bg-background/5 text-background/60 hover:bg-background/10 hover:text-background flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:scale-105"
                >
                  <Facebook className="size-5" />
                </a>
                <a
                  href="#"
                  className="bg-background/5 text-background/60 hover:bg-background/10 hover:text-background flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:scale-105"
                >
                  <Instagram className="size-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-background/50 mb-4 text-xs font-bold tracking-[0.15em] uppercase">
                DOWNLOAD APP
              </h3>
              <div className="flex flex-col gap-2 xl:flex-row">
                <a
                  href="#"
                  className="flex w-fit min-w-40 flex-1 items-center justify-center gap-2 rounded-xl bg-[#222222] px-3 py-2 whitespace-nowrap text-white transition hover:scale-105 hover:bg-black xl:justify-start"
                >
                  <FontAwesomeIcon icon={faApple} className="text-2xl" />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] leading-tight text-gray-400">Download on the</span>
                    <span className="text-sm leading-tight font-semibold">App Store</span>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex w-fit min-w-40 flex-1 items-center justify-center gap-2 rounded-xl bg-[#222222] px-3 py-2 whitespace-nowrap text-white transition hover:scale-105 hover:bg-black xl:justify-start"
                >
                  <FontAwesomeIcon icon={faGooglePlay} className="text-xl" />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] leading-tight text-gray-400">GET IT ON</span>
                    <span className="text-sm leading-tight font-semibold">Google Play</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-background/10 text-background/40 mt-6 flex items-center justify-center border-t py-4 text-xs">
          <p>© {new Date().getFullYear()} Smart PC Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

"use client"

import AIChatBox from "@/components/chat/AIChatBox"
import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import type { Category } from "@/types/category"

import { usePathname } from "next/navigation"

interface LayoutShellProps {
  children: React.ReactNode
  initialCategories?: Category[]
}

export default function LayoutShell({ children, initialCategories = [] }: LayoutShellProps) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith("/quan-ly")

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header initialCategories={initialCategories} />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
      <AIChatBox />
    </div>
  )
}

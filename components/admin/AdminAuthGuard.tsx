"use client"

import { useAuthStore } from "@/stores/useAuthStore"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

/**
 * Client-side guard for /admin routes.
 * Renders nothing (prevents flash) until user is confirmed ADMIN.
 * proxy.ts handles the server-side check; this is a defense-in-depth
 * layer for client-side navigations that bypass the proxy.
 */
export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsClient(true), 0)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isClient) return // Wait for hydration to avoid premature kicks

    if (user === null) {
      router.replace("/dang-nhap")
    } else if (user.role?.toUpperCase() !== "ADMIN") {
      router.replace("/")
    }
  }, [user, router, isClient])

  if (!isClient || !user || user.role?.toUpperCase() !== "ADMIN") {
    return null
  }

  return <>{children}</>
}

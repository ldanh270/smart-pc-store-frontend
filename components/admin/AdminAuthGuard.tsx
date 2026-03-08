"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

/**
 * Client-side guard for /admin routes.
 * Renders nothing (prevents flash) until user is confirmed ADMIN.
 * proxy.ts handles the server-side check; this is a defense-in-depth
 * layer for client-side navigations that bypass the proxy.
 */
export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user === null) {
      router.replace("/dang-nhap");
    } else if (user.role?.toUpperCase() !== "ADMIN") {
      router.replace("/");
    }
  }, [user, router]);

  if (!user || user.role?.toUpperCase() !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}

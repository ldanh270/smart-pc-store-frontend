import AdminAuthGuard from "@/components/admin/AdminAuthGuard"
import AdminHeader from "@/components/admin/AdminHeader"
import AdminSidebar from "@/components/admin/AdminSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider style={{ "--sidebar-width": "14rem" } as React.CSSProperties}>
      <AdminAuthGuard>
        <div className="bg-muted/40 flex min-h-screen w-full">
          <AdminSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <AdminHeader />
            <main className="w-full flex-1 overflow-auto p-4 lg:p-8">{children}</main>
          </div>
        </div>
      </AdminAuthGuard>
    </SidebarProvider>
  )
}

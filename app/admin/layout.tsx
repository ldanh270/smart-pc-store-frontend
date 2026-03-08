import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminAuthGuard>
        <div className="flex min-h-screen w-full bg-muted/40">
          <AdminSidebar />
          <div className="flex flex-1 flex-col min-w-0">
            <AdminHeader />
            <main className="flex-1 overflow-auto w-full p-4 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </AdminAuthGuard>
    </SidebarProvider>
  );
}

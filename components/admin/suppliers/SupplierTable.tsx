"use client";

import { useEffect, useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Supplier } from "@/types/supplier";
import { useSupplierStore } from "@/stores/useSupplierStore";
import SupplierFormDialog from "./SupplierFormDialog";
import DeleteSupplierDialog from "./DeleteSupplierDialog";

export default function SupplierTable() {
  const { suppliers, loading, fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } = useSupplierStore();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  async function handleCreateSupplier(data: Omit<Supplier, "id" | "createdAt" | "updatedAt">) {
    const success = await createSupplier(data);
    if (success) {
      setIsCreateOpen(false);
    }
  }

  async function handleEditSupplier(updated: Supplier) {
    const success = await updateSupplier(updated.id, {
      name: updated.name,
      contactName: updated.contactName,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      status: updated.status,
    });
    if (success) {
      setEditingSupplier(null);
    }
  }

  async function handleDeleteSupplier(id: number) {
    const success = await deleteSupplier(id);
    if (success) {
      setDeletingSupplier(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => fetchSuppliers()} disabled={loading}>
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 size-4" />
            Thêm Nhà Cung Cấp
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Tên Nhà Cung Cấp</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Điện thoại</TableHead>
              <TableHead className="text-center">Trạng Thái</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Đang tải hệ thống cung cấp...
                  </p>
                </TableCell>
              </TableRow>
            ) : suppliers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  Không tìm thấy nhà cung cấp nào.
                </TableCell>
              </TableRow>
            ) : (
              suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell className="font-mono text-sm">{supplier.id}</TableCell>
                  <TableCell>
                    <p className="font-medium">{supplier.name}</p>
                    {supplier.contactName && <p className="text-xs text-muted-foreground">{supplier.contactName}</p>}
                  </TableCell>
                  <TableCell>{supplier.email || "-"}</TableCell>
                  <TableCell className="hidden md:table-cell">{supplier.phone || "-"}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={supplier.status ? "outline" : "destructive"} className={supplier.status ? "border-emerald-500/50 text-emerald-600" : ""}>
                      {supplier.status ? "Hoạt động" : "Ngừng HĐ"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingSupplier(supplier)}>
                          <Pencil className="mr-2 size-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeletingSupplier(supplier)}>
                          <Trash2 className="mr-2 size-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <SupplierFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateSupplier}
      />

      <SupplierFormDialog
        open={!!editingSupplier}
        onOpenChange={(open) => {
          if (!open) setEditingSupplier(null);
        }}
        supplier={editingSupplier ?? undefined}
        onSubmit={(data) => {
          if (editingSupplier) {
            handleEditSupplier({ ...editingSupplier, ...data } as Supplier);
          }
        }}
      />

      <DeleteSupplierDialog
        open={!!deletingSupplier}
        onOpenChange={(open) => {
          if (!open) setDeletingSupplier(null);
        }}
        supplierName={deletingSupplier?.name ?? ""}
        onConfirm={() => {
          if (deletingSupplier) handleDeleteSupplier(deletingSupplier.id);
        }}
      />
    </div>
  );
}

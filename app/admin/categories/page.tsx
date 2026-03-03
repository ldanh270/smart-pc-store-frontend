"use client";

import CategoryTable from "@/components/admin/categories/CategoryTable";

export default function AdminCategoriesPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Danh Mục</h1>
					<p className="mt-1 text-muted-foreground">
						Quản lý danh mục sản phẩm cho Smart PC Store.
					</p>
				</div>
			</div>

			{/* Main Table */}
			<CategoryTable />
		</div>
	);
}

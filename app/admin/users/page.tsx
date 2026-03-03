"use client";

import UserTable from "@/components/admin/users/UserTable";

export default function AdminUsersPage() {
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						Người Dùng
					</h1>
					<p className="text-muted-foreground mt-1">
						Quản lý tài khoản, vai trò và trạng thái người dùng.
					</p>
				</div>
			</div>

			{/* Main Table */}
			<UserTable />
		</div>
	);
}

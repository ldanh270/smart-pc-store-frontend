"use client";

import { useState } from "react";
import { Search, MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/types/user";
import UserFormDialog from "./UserFormDialog";
import DeleteUserDialog from "./DeleteUserDialog";

// ─── Props ──────────────────────────────────────────────────────────────────

interface UserTableProps {
	initialUsers: User[];
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function UserTable({ initialUsers }: UserTableProps) {
	const [users, setUsers] = useState<User[]>(initialUsers);
	const [searchQuery, setSearchQuery] = useState("");
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [deletingUser, setDeletingUser] = useState<User | null>(null);

	// Filter users by search
	const filteredUsers = users.filter(
		(user) =>
			user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.displayName
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			user.email.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// Handlers
	function handleCreateUser(newUser: Omit<User, "id" | "createdAt">) {
		const created: User = {
			...newUser,
			id: Math.max(...users.map((u) => u.id), 0) + 1,
			createdAt: new Date().toISOString().split("T")[0],
		};
		setUsers((prev) => [created, ...prev]);
		setIsCreateOpen(false);
	}

	function handleEditUser(updated: User) {
		setUsers((prev) =>
			prev.map((u) => (u.id === updated.id ? updated : u)),
		);
		setEditingUser(null);
	}

	function handleDeleteUser(id: number) {
		setUsers((prev) => prev.filter((u) => u.id !== id));
		setDeletingUser(null);
	}

	return (
		<div className="space-y-4">
			{/* Toolbar */}
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="relative max-w-sm flex-1">
					<Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Tìm kiếm người dùng..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9"
					/>
				</div>
				<Button onClick={() => setIsCreateOpen(true)}>
					<Plus className="mr-2 size-4" />
					Thêm Người Dùng
				</Button>
			</div>

			{/* Table */}
			<div className="rounded-lg border border-border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-16">ID</TableHead>
							<TableHead>Username</TableHead>
							<TableHead>Tên Hiển Thị</TableHead>
							<TableHead className="hidden md:table-cell">
								Email
							</TableHead>
							<TableHead className="hidden lg:table-cell">
								SĐT
							</TableHead>
							<TableHead className="text-center">
								Vai Trò
							</TableHead>
							<TableHead className="text-center">
								Trạng Thái
							</TableHead>
							<TableHead className="w-16" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredUsers.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={8}
									className="py-12 text-center text-muted-foreground"
								>
									Không tìm thấy người dùng nào.
								</TableCell>
							</TableRow>
						) : (
							filteredUsers.map((user) => (
								<TableRow key={user.id}>
									<TableCell className="font-mono text-sm">
										{user.id}
									</TableCell>
									<TableCell className="font-medium">
										{user.username}
									</TableCell>
									<TableCell>
										{user.displayName}
									</TableCell>
									<TableCell className="hidden text-sm text-muted-foreground md:table-cell">
										{user.email}
									</TableCell>
									<TableCell className="hidden font-mono text-sm lg:table-cell">
										{user.phone ?? "—"}
									</TableCell>
									<TableCell className="text-center">
										<Badge
											variant={
												user.role === "admin"
													? "default"
													: "secondary"
											}
										>
											{user.role === "admin"
												? "Admin"
												: "User"}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<Badge
											variant={
												user.status === "active"
													? "outline"
													: "destructive"
											}
											className={
												user.status === "active"
													? "border-emerald-500/50 text-emerald-600"
													: ""
											}
										>
											{user.status === "active"
												? "Hoạt động"
												: "Vô hiệu"}
										</Badge>
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="size-8"
												>
													<MoreHorizontal className="size-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={() =>
														setEditingUser(user)
													}
												>
													<Pencil className="mr-2 size-4" />
													Chỉnh sửa
												</DropdownMenuItem>
												<DropdownMenuItem
													className="text-destructive"
													onClick={() =>
														setDeletingUser(user)
													}
												>
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
			<UserFormDialog
				open={isCreateOpen}
				onOpenChange={setIsCreateOpen}
				onSubmit={handleCreateUser}
			/>

			<UserFormDialog
				open={!!editingUser}
				onOpenChange={(open) => {
					if (!open) setEditingUser(null);
				}}
				user={editingUser ?? undefined}
				onSubmit={(data) => {
					if (editingUser) {
						handleEditUser({ ...editingUser, ...data });
					}
				}}
			/>

			<DeleteUserDialog
				open={!!deletingUser}
				onOpenChange={(open) => {
					if (!open) setDeletingUser(null);
				}}
				userName={deletingUser?.displayName ?? ""}
				onConfirm={() => {
					if (deletingUser) handleDeleteUser(deletingUser.id);
				}}
			/>
		</div>
	);
}

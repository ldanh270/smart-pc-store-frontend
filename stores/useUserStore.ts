import { userService } from "@/services/userService"
import type { User, UserCreateDto, UserUpdateDto } from "@/types/user"

import { toast } from "sonner"
import { create } from "zustand"

interface UserStore {
  users: User[]
  loading: boolean

  fetchUsers: () => Promise<void>
  createUser: (data: UserCreateDto) => Promise<boolean>
  updateUser: (id: number, data: UserUpdateDto) => Promise<boolean>
  deleteUser: (id: number) => Promise<boolean>
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  loading: false,

  fetchUsers: async () => {
    try {
      set({ loading: true })
      const data = await userService.getUsers()
      set({ users: data })
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      set({ loading: false })
    }
  },

  createUser: async (data) => {
    try {
      set({ loading: true })
      await userService.createUser(data)
      toast.success("Thêm người dùng thành công!")
      await get().fetchUsers()
      return true
    } catch {
      return false
    } finally {
      set({ loading: false })
    }
  },

  updateUser: async (id, data) => {
    try {
      set({ loading: true })
      await userService.updateUser(id, data)
      toast.success("Cập nhật người dùng thành công!")
      await get().fetchUsers()
      return true
    } catch {
      return false
    } finally {
      set({ loading: false })
    }
  },

  deleteUser: async (id) => {
    try {
      set({ loading: true })
      await userService.deleteUser(id)
      toast.success("Xóa người dùng thành công!")
      await get().fetchUsers()
      return true
    } catch {
      return false
    } finally {
      set({ loading: false })
    }
  },
}))

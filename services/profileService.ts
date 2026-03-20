import api from "@/lib/axios"
import type { User, UserUpdateDto } from "@/types/user"

export interface ChangePasswordDto {
  currentPassword: string
  newPassword: string
}

export const profileService = {
  /**
   * GET /profile — logged-in user's own profile
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get("/profile")
    return response.data?.data ?? response.data
  },

  /**
   * PUT /profile — update logged-in user's own profile
   */
  updateProfile: async (data: UserUpdateDto): Promise<User> => {
    const response = await api.put("/profile", data)
    return response.data?.data ?? response.data
  },

  /**
   * PUT /profile/change-password — change logged-in user's password
   */
  changePassword: async (data: ChangePasswordDto): Promise<void> => {
    await api.put("/profile/change-password", data)
  },
}

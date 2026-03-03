import api from "@/lib/axios";
import type { ApiResponse } from "@/types/product";
import type { User, UserCreateDto, UserUpdateDto } from "@/types/user";

export const userService = {
  /**
   * GET /users — list all users
   */
  getUsers: async (): Promise<User[]> => {
    const response = await api.get("/users");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  /**
   * GET /users/{id} — single user detail
   */
  getUser: async (id: number): Promise<User> => {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  },

  /**
   * POST /users — create new user
   */
  createUser: async (data: UserCreateDto): Promise<User> => {
    const response = await api.post<ApiResponse<User>>("/users", data);
    return response.data.data;
  },

  /**
   * PUT /users/{id} — update user information
   */
  updateUser: async (id: number, data: UserUpdateDto): Promise<User> => {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data;
  },

  /**
   * DELETE /users/{id} — delete user
   */
  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

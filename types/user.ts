export interface User {
  id: number;
  username: string;
  displayName: string;
  role: "user" | "admin";
  email: string;
  phone?: string;
  address?: string;
  status?: string;   // "Active" | "Blocked" etc.
  createdAt?: string;
}

export interface UserCreateDto {
  username: string;
  password: string;
  displayName: string;
  email: string;
  phone?: string;
  address?: string;
  status?: string;
  role?: string;
}

export interface UserUpdateDto {
  username?: string;
  password?: string;
  displayName?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: string;
  role?: string;
}
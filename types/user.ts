export interface User {
  id: number;
  username: string;
  displayName: string;
  role: "user" | "admin";
  email: string;
  phone?: string;
  address?: string;
  status?: string;
  createdAt?: string;
}
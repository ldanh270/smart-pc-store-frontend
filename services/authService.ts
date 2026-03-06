import api from "@/lib/axios";

export const authService = {
  signup: async (username: string, password: string, email: string, displayName: string) => {
    const response = await api.post("/auth/signup", {
      username,
      password,
      email,
      displayName,
    }, {withCredentials: true});
    
    return response.data;
  },

  login: async (username: string, password: string) => {
    const response = await api.post("/auth/login", {
      username,
      password,
    }, {withCredentials: true});
    
    return response.data;
  },

  logout: async () => {
    // Calling the backend to remove HttpOnly cookies
    const response = await api.post("/auth/logout", {}, { withCredentials: true });
    return response.data;
  }
};
import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  name: string | null;
  role: string | null;
  setAuth: (token: string, name: string, role: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem("accessToken"),
  name: localStorage.getItem("name"),
  role: localStorage.getItem("role"),
  setAuth: (token, name, role) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("name", name);
    localStorage.setItem("role", role);
    set({ accessToken: token, name, role });
  },
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    set({ accessToken: null, name: null, role: null });
  },
}));

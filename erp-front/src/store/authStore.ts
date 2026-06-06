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
  name: null,
  role: null,
  setAuth: (token, name, role) => {
    localStorage.setItem("accessToken", token);
    set({ accessToken: token, name, role });
  },
  logout: () => {
    localStorage.removeItem("accessToken");
    set({ accessToken: null, name: null, role: null });
  },
}));

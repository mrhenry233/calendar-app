import { create } from "zustand";
import { User } from "../common/types";

interface AuthState {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  resetUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  resetUser: () => set({ currentUser: null }),
}));

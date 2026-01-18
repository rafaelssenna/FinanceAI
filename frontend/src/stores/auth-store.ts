import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';
import { api } from '@/lib/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      login: async (email, password) => {
        const { user } = await api.login(email, password);
        set({ user, isAuthenticated: true });
      },

      register: async (email, password, name) => {
        const { user } = await api.register(email, password, name);
        set({ user, isAuthenticated: true });
      },

      logout: () => {
        api.logout();
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true });
          const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
          if (!token) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return;
          }
          const user = await api.getProfile();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch {
          api.logout();
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth as authApi, setToken, setRefresh, removeToken, getRefresh } from '@/lib/api';

interface User {
  id: string;
  email: string;
  role: 'client' | 'driver' | 'admin';
  status: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  email_verified: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  login:   (email: string, password: string) => Promise<void>;
  logout:  () => Promise<void>;
  fetchMe: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:    null,
      loading: false,

      login: async (email, password) => {
        set({ loading: true });
        try {
          const res = await authApi.login({ email, password });
          setToken(res.data.accessToken);
          setRefresh(res.data.refreshToken);
          set({ user: res.data.user, loading: false });
        } catch (err) {
          set({ loading: false });
          throw err;
        }
      },

      logout: async () => {
        const refresh = getRefresh();
        try { await authApi.logout(refresh); } catch {}
        removeToken();
        set({ user: null });
        window.location.href = '/';
      },

      fetchMe: async () => {
        try {
          const res = await authApi.me();
          set({ user: res.data });
        } catch {
          set({ user: null });
        }
      },

      setUser: (user) => set({ user }),
    }),
    {
      name:    'ad-auth',
      partialize: (s) => ({ user: s.user }),
    }
  )
);

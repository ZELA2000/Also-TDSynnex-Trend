import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
  login: (token: string, user: any) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

/**
 * Authentication store using Zustand
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      token: null,
      isAuthenticated: false,
      user: null,

      login: (token: string, user: any) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
        set({ token, user, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
        }
        set({ token: null, user: null, isAuthenticated: false });
      },

      setToken: (token: string) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth_token', token);
        }
        set({ token, isAuthenticated: true });
      },
    }),
    { name: 'auth-store' }
  )
);

// Initialize from localStorage on client
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('user');
  
  if (token && userStr) {
    try {
      const user = JSON.parse(userStr);
      useAuthStore.setState({ token, user, isAuthenticated: true });
    } catch (e) {
      // Invalid stored data, clear it
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }
}

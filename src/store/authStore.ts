import { create } from 'zustand';

const API_BASE_URL = 'http://localhost:3001';

interface User {
  id: string;
  username: string;
}

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  verifyToken: () => Promise<boolean>;
  setAuthenticated: (user: User, token: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: import.meta.env.DEV ? false : true,
  user: null,
  token: null,
  isLoading: false,
  error: null,

  setAuthenticated: (user, token) => {
    localStorage.setItem('auth_token', token);
    set({
      isAuthenticated: true,
      user,
      token,
      error: null
    });
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        set({
          isLoading: false,
          error: data.message || '登录失败'
        });
        return false;
      }

      // Store token in localStorage and update state
      get().setAuthenticated(data.user, data.token);

      set({ isLoading: false });
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '网络错误，请稍后重试';
      set({
        isLoading: false,
        error: errorMessage
      });
      return false;
    }
  },

  verifyToken: async () => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      set({
        isAuthenticated: false,
        user: null,
        token: null
      });
      return false;
    }

    set({ isLoading: true });

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        // Token is invalid or expired, clear it
        localStorage.removeItem('auth_token');
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false
        });
        return false;
      }

      // Token is valid, update state
      set({
        isAuthenticated: true,
        user: data.user,
        token,
        isLoading: false
      });
      return true;

    } catch (error) {
      // Silently fail if server is not running (expected after restart)
      // Only log in development mode
      if (import.meta.env.DEV) {
        console.warn('Token verification skipped: Backend server not available');
      }
      localStorage.removeItem('auth_token');
      set({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false
      });
      return false;
    }
  },

  logout: () => {
    // Clear token from localStorage
    localStorage.removeItem('auth_token');

    // Reset state
    set({
      isAuthenticated: false,
      user: null,
      token: null,
      error: null
    });

    // Optional: Call backend logout endpoint
    fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }).catch(err => console.error('Logout API error:', err));
  },

  clearError: () => {
    set({ error: null });
  }
}));

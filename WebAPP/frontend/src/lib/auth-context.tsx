'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, LoginCredentials, AuthState, LoginResponse } from '@/types';
import { apiClient } from './api-client';
import { setCookie, deleteCookie } from './cookies';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'auth_user';

// Token refresh interval: check every 5 minutes
const TOKEN_REFRESH_INTERVAL = 5 * 60 * 1000;

/**
 * Auth Provider Component
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  /**
   * Load auth state from localStorage on mount
   */
  useEffect(() => {
    const loadAuthState = () => {
      try {
        if (typeof window === 'undefined') {
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        const userStr = localStorage.getItem(USER_KEY);

        if (token && userStr) {
          const user = JSON.parse(userStr) as User;
          
          // Set token in API client
          apiClient.setAuthToken(token);

          setState({
            user,
            token,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadAuthState();
  }, []);

  /**
   * Refresh authentication (check if token is still valid)
   */
  const refreshAuth = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (!refreshToken) {
      return;
    }

    try {
      const response = await apiClient.post<{
        token: string;
        refreshToken?: string;
      }>('/auth/refresh', { refreshToken });

      if (response.data?.token) {
        const newToken = response.data.token;
        const newRefreshToken = response.data.refreshToken || refreshToken;

        localStorage.setItem(AUTH_TOKEN_KEY, newToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

        setCookie(AUTH_TOKEN_KEY, newToken, 7);
        setCookie(REFRESH_TOKEN_KEY, newRefreshToken, 7);

        apiClient.setAuthToken(newToken);

        setState(prev => ({
          ...prev,
          token: newToken,
          refreshToken: newRefreshToken,
        }));
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // Clear auth state on refresh failure
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      deleteCookie(AUTH_TOKEN_KEY);
      deleteCookie(REFRESH_TOKEN_KEY);
      apiClient.clearAuthToken();
      setState({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  /**
   * Auto-refresh token periodically
   */
  useEffect(() => {
    if (!state.isAuthenticated || !state.refreshToken) {
      return;
    }

    const interval = setInterval(() => {
      // Check if we should refresh the token
      refreshAuth();
    }, TOKEN_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [state.isAuthenticated, state.refreshToken, refreshAuth]);

  /**
   * Login function
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Call real backend API
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        username: credentials.username,
        password: credentials.password,
      });

      if (!response) {
        throw new Error('Invalid response from server');
      }

      // Backend returns { success, token, refreshToken, user, expiresIn }
      const loginData = response as LoginResponse;
      const { token, refreshToken, user } = loginData;

      if (!token || !user) {
        throw new Error('Invalid response format');
      }

      // Save to localStorage
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      // Save to cookies for middleware
      setCookie(AUTH_TOKEN_KEY, token, 7);
      if (refreshToken) {
        setCookie(REFRESH_TOKEN_KEY, refreshToken, 7);
      }

      // Set token in API client
      apiClient.setAuthToken(token);

      setState({
        user,
        token,
        refreshToken: refreshToken || null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      console.log('✅ Login successful:', user.username || user.name);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      
      setState({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });

      throw error;
    }
  }, []);

  /**
   * Logout function
   */
  const logout = useCallback(() => {
    // Clear localStorage
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    // Clear cookies
    deleteCookie(AUTH_TOKEN_KEY);
    deleteCookie(REFRESH_TOKEN_KEY);

    // Clear API client token
    apiClient.clearAuthToken();

    setState({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    console.log('✅ Logout successful');
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

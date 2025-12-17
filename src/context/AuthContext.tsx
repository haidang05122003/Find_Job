'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthState, LoginCredentials, RegisterData, UserRole } from '@/types/user';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  socialLogin: (data: { provider: 'google' | 'facebook' | 'github'; token: string }) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasRole: (role: UserRole) => boolean;
  canAccessRoute: (requiredRole: UserRole) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const fetchUser = useCallback(async () => {
    try {
      const response = await userService.getCurrentUser();
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          user: response.data,
          isAuthenticated: true,
          isLoading: false,
        }));
      } else {
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setState({ user: null, isAuthenticated: false, isLoading: false });
      localStorage.removeItem('auth_token');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setState(prev => ({ ...prev, token, isLoading: true }));
      fetchUser();
    } else {
      setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, [fetchUser]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        const { token } = response.data;
        localStorage.setItem('auth_token', token);

        // Fetch user details immediately after login
        await fetchUser();
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  }, [fetchUser]);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      if (!response.success) {
        throw new Error(response.message || 'Registration failed');
      }
      // Auto login or redirect to login
      router.push('/signin');
    } catch (error) {
      throw error;
    }
  }, [router]);

  const socialLogin = useCallback(async (data: { provider: 'google' | 'facebook' | 'github'; token: string }) => {
    try {
      const response = await authService.socialLogin(data);
      if (response.success && response.data) {
        const { token } = response.data;
        localStorage.setItem('auth_token', token);

        // Fetch user details immediately after login
        await fetchUser();
      } else {
        throw new Error(response.message || 'Social login failed');
      }
    } catch (error) {
      throw error;
    }
  }, [fetchUser]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setState({ user: null, isAuthenticated: false, isLoading: false });
      router.push('/signin');
    }
  }, [router]);

  const switchRole = useCallback((role: UserRole) => {
    if (!state.user || !state.user.roles.includes(role)) {
      return;
    }

    const updatedUser = { ...state.user, activeRole: role };
    // Update local state, maybe persist preference?
    setState((prev) => ({ ...prev, user: updatedUser }));

    const redirectMap: Record<UserRole, string> = {
      CANDIDATE: '/dashboard',
      HR: '/hr/dashboard',
      ADMIN: '/admin/dashboard',
      ROLE_CANDIDATE: '/dashboard',
      ROLE_HR: '/hr/dashboard',
      ROLE_ADMIN: '/admin/dashboard',
    };

    router.push(redirectMap[role]);
  }, [state.user, router]);

  const hasRole = useCallback((role: UserRole): boolean => {
    return state.user?.roles.includes(role) ?? false;
  }, [state.user]);

  const canAccessRoute = useCallback((requiredRole: UserRole): boolean => {
    if (!state.user) return false;
    return state.user.roles.includes(requiredRole);
  }, [state.user]);

  const value = useMemo(
    () => ({
      ...state,
      login,
      register,
      socialLogin,
      logout,
      switchRole,
      hasRole,
      canAccessRoute,
      refreshUser: fetchUser,
    }),
    [state, login, register, socialLogin, logout, switchRole, hasRole, canAccessRoute, fetchUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

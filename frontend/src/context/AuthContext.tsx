import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { authStorage, StoredAuth } from '../api/client';
import { authApi } from '../api/endpoints';
import { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = authStorage.get();
    if (stored) setUser(stored.user);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    const stored: StoredAuth = {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user
    };
    authStorage.set(stored);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    authStorage.clear();
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN',
      loading,
      login,
      logout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

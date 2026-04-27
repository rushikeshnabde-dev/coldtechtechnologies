import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '../services/api';

const AuthContext = createContext(null);

const STORAGE_KEY = 'coldtech_auth';

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.token) {
          setToken(parsed.token);
          setUser(parsed.user);
          setAuthToken(parsed.token);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  const persist = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    setAuthToken(nextToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: nextToken, user: nextUser }));
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    persist(data.token, data.user);
    return data.user;
  };

  // Google OAuth — sends Google credential token to backend, gets back a JWT
  const loginWithGoogle = async (googleToken) => {
    const { data } = await api.post('/auth/google', { token: googleToken });
    persist(data.token, data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    persist(data.token, data.user);
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    const { data } = await api.get('/auth/me');
    const nextUser = data.user;
    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user: nextUser }));
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!token,
      isAdmin:  user?.role === 'admin',
      isStaff:  user?.role === 'staff',
      login,
      loginWithGoogle,
      register,
      logout,
      refreshProfile,
    }),
    [user, token, loading, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

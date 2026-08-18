import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api, { getApiError, tokenStore } from '../services/api';

const AuthContext = createContext(null);

function normaliseUser(user) {
  return {
    id: String(user.id), fullName: user.full_name, firstName: user.full_name?.split(' ')[0] || 'Student',
    email: user.email, registerNumber: user.register_number, profileImageUrl: user.profile_image_url, role: 'CUSAT Student',
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const setSession = useCallback((payload) => {
    tokenStore.set({ access: payload.access, refresh: payload.refresh });
    setUser(normaliseUser(payload.user));
  }, []);

  useEffect(() => {
    const tokens = tokenStore.get();
    if (!tokens?.access) { setIsLoading(false); return; }
    api.get('/auth/profile/').then((response) => setUser(normaliseUser(response.data))).catch(() => tokenStore.clear()).finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async ({ email, password }) => {
    try {
      const response = await api.post('/auth/login/', { email, password });
      setSession(response.data);
      return response.data.user;
    } catch (error) { throw new Error(getApiError(error, 'Unable to log in with those credentials.')); }
  }, [setSession]);

  const register = useCallback(async (details) => {
    try {
      const response = await api.post('/auth/register/', {
        full_name: details.fullName, email: details.email, register_number: details.registerNumber,
        password: details.password, confirm_password: details.confirmPassword,
      });
      setSession(response.data);
      return response.data.user;
    } catch (error) { throw new Error(getApiError(error, 'Unable to create your account.')); }
  }, [setSession]);

  const updateProfile = useCallback(async (details) => {
    const payload = new FormData();
    payload.append('full_name', details.fullName);
    payload.append('email', details.email);
    payload.append('register_number', details.registerNumber);
    if (details.profileImage) payload.append('profile_image', details.profileImage);
    try {
      const response = await api.put('/auth/profile/', payload);
      const nextUser = normaliseUser(response.data);
      setUser(nextUser);
      return nextUser;
    } catch (error) { throw new Error(getApiError(error, 'Unable to update your profile.')); }
  }, []);

  const logout = useCallback(async () => {
    try { await api.post('/auth/logout/'); } catch { /* The local session is still safe to clear. */ }
    tokenStore.clear();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, isLoading, isAuthenticated: Boolean(user), login, register, logout, updateProfile }), [user, isLoading, login, register, logout, updateProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

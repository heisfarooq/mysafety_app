import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { login as apiLogin } from '../api/auth';
import { getCurrentUser } from '../api/users';
import { setUnauthorizedHandler } from '../api/client';
import { tokenStore } from '../api/tokenStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => tokenStore.get());
  const [user, setUser] = useState(null);
  // loading | authenticated | anonymous | error
  const [status, setStatus] = useState(() => (tokenStore.get() ? 'loading' : 'anonymous'));
  const [profileError, setProfileError] = useState(null);
  const [notice, setNotice] = useState(null);

  const clear = useCallback((message = null) => {
    tokenStore.clear();
    setToken(null);
    setUser(null);
    setProfileError(null);
    setStatus('anonymous');
    setNotice(message);
  }, []);

  // Any protected request that returns 401 clears the session centrally.
  useEffect(() => {
    setUnauthorizedHandler(() => clear('Your session has expired. Please log in again.'));
    return () => setUnauthorizedHandler(null);
  }, [clear]);

  const loadUser = useCallback(async () => {
    setStatus('loading');
    setProfileError(null);
    try {
      const me = await getCurrentUser();
      setUser(me);
      setStatus('authenticated');
      return me;
    } catch (err) {
      if (err.status === 401) return null; // handler already cleared the session
      setProfileError(err);
      setStatus('error');
      return null;
    }
  }, []);

  useEffect(() => {
    if (tokenStore.get()) loadUser();
  }, [loadUser]);

  const login = useCallback(
    async (credentials) => {
      const { accessToken } = await apiLogin(credentials);
      tokenStore.set(accessToken);
      setToken(accessToken);
      setNotice(null);
      await loadUser();
    },
    [loadUser]
  );

  const logout = useCallback(() => clear(null), [clear]);
  const dismissNotice = useCallback(() => setNotice(null), []);

  const value = useMemo(
    () => ({ token, user, status, profileError, notice, login, logout, reloadUser: loadUser, dismissNotice }),
    [token, user, status, profileError, notice, login, logout, loadUser, dismissNotice]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

import React, { useState, useEffect, type ReactNode, useCallback, useMemo, useRef } from 'react';
import applicationsService from '@/api/applicationsService';
import formsService from '@/api/formsService';
import sessionsService from '@/api/sessionsService';
import { API_BASE_URL } from '@/api/config';
import { AuthContext, type User } from './AuthContext';

const encodeToBase64 = (str: string): string => {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) =>
      String.fromCharCode(parseInt(p1, 16)),
    ),
  );
};

const loginStub = async (): Promise<void> => {
  throw new Error('Login not initialized');
};
const logoutStub = (): void => {};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  const loginRef = useRef<(username: string, password: string) => Promise<void>>(loginStub);
  const logoutRef = useRef<() => void>(logoutStub);
  const clearLoginErrorRef = useRef<() => void>(() => {});

  const setCredentialsInServices = useCallback((username: string, password: string) => {
    const credentials = { username, password };
    applicationsService.credentials = credentials;
    formsService.credentials = credentials;
    sessionsService.credentials = credentials;
  }, []);

  const clearCredentialsFromServices = useCallback(() => {
    applicationsService.credentials = null;
    formsService.credentials = null;
    sessionsService.credentials = null;
  }, []);

  const clearLoginError = useCallback(() => {
    setLoginError(null);
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      setLoading(true);
      setLoginError(null);

      try {
        setCredentialsInServices(username, password);

        const testUrl = `${API_BASE_URL}/admin/applications/?limit=1`;
        const token = encodeToBase64(`${username}:${password}`);

        const response = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
          credentials: 'omit',
        });

        if (response.status === 401) {
          throw new Error('Неверные учетные данные');
        }

        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            errorData = { message: `HTTP error! status: ${response.status}` };
          }
          throw new Error(errorData.detail || errorData.message || `API error: ${response.status}`);
        }

        const userData = { id: '1', username };
        setUser(userData);

        localStorage.setItem('authUser', JSON.stringify(userData));
        localStorage.setItem('authCredentials', JSON.stringify({ username, password }));
      } catch (error) {
        clearCredentialsFromServices();

        let errorMessage: string;
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          errorMessage = 'Ошибка сети или CORS. Проверьте подключение к интернету.';
        } else if (error instanceof Error) {
          errorMessage = error.message;
        } else {
          errorMessage = 'Неизвестная ошибка при входе';
        }

        setLoginError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [setCredentialsInServices, clearCredentialsFromServices],
  );

  const logout = useCallback(() => {
    setUser(null);
    setLoginError(null);
    localStorage.removeItem('authUser');
    localStorage.removeItem('authCredentials');
    clearCredentialsFromServices();
  }, [clearCredentialsFromServices]);

  useEffect(() => {
    loginRef.current = login;
    logoutRef.current = logout;
    clearLoginErrorRef.current = clearLoginError;
  }, [login, logout, clearLoginError]);

  const stableLogin = useCallback((username: string, password: string) => {
    return loginRef.current(username, password);
  }, []);

  const stableLogout = useCallback(() => {
    logoutRef.current();
  }, []);

  const stableClearLoginError = useCallback(() => {
    clearLoginErrorRef.current();
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem('authUser');
      const savedCredentials = localStorage.getItem('authCredentials');

      if (savedUser && savedCredentials) {
        try {
          const user = JSON.parse(savedUser);
          const credentials = JSON.parse(savedCredentials);

          setCredentialsInServices(credentials.username, credentials.password);

          const healthUrl = `${API_BASE_URL}/health`;
          const token = encodeToBase64(`${credentials.username}:${credentials.password}`);

          const response = await fetch(healthUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${token}`,
            },
          });

          if (response.status === 401 || response.status === 403) {
            throw new Error('Saved credentials are invalid');
          }

          if (!response.ok) {
            throw new Error(`Health check failed: ${response.status}`);
          }

          setUser(user);
        } catch {
          localStorage.removeItem('authUser');
          localStorage.removeItem('authCredentials');
          clearCredentialsFromServices();
        }
      }

      setLoading(false);
    };

    initAuth();
  }, [setCredentialsInServices, clearCredentialsFromServices]);

  const value = useMemo(
    () => ({
      user,
      login: stableLogin,
      logout: stableLogout,
      loading,
      loginError,
      clearLoginError: stableClearLoginError,
    }),
    [user, stableLogin, stableLogout, loading, loginError, stableClearLoginError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

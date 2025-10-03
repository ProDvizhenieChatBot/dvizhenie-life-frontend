import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import APITest from './APITes';
import { useFormValidation } from '@/hooks/useFormValidation';
import { validationSchemas } from '@/lib/validation';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState(localStorage.getItem('login_username') || '');
  const [password, setPassword] = useState(localStorage.getItem('login_password') || '');
  const [showDebug, setShowDebug] = useState(false);

  const { login, loading, loginError, clearLoginError } = useAuth();

  const {
    errors,
    touched,
    validate,
    handleChange: validationHandleChange,
    handleBlur,
  } = useFormValidation({
    schema: validationSchemas.login,
    initialValues: { username, password },
  });

  useEffect(() => {
    validate();
  }, [validate]);

  const handleUsernameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setUsername(value);
      localStorage.setItem('login_username', value);
      validationHandleChange('username', value);

      if (loginError) {
        clearLoginError();
      }
    },
    [loginError, validationHandleChange, clearLoginError],
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setPassword(value);
      localStorage.setItem('login_password', value);
      validationHandleChange('password', value);

      if (loginError) {
        clearLoginError();
      }
    },
    [loginError, validationHandleChange, clearLoginError],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const isFormValid = validate();

      if (!isFormValid) {
        return;
      }

      try {
        await login(username, password);
      } catch {
        // Ошибка уже установлена в AuthContext
      }
    },
    [username, password, login, validate],
  );

  const handleFieldFocus = useCallback(() => {
    if (loginError) {
      clearLoginError();
    }
  }, [loginError, clearLoginError]);

  const getFieldClassName = (field: string): string => {
    if (errors[field]) return 'border-destructive';
    if (touched[field] && !errors[field]) return 'border-green-500';
    return '';
  };

  if (showDebug) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => setShowDebug(false)}>
          ← Назад к логину
        </Button>
        <APITest />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Вход в систему</CardTitle>
          <CardDescription>Введите свои учетные данные для входа</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Имя пользователя</Label>
              <Input
                id="username"
                value={username}
                onChange={handleUsernameChange}
                onBlur={() => handleBlur('username')}
                onFocus={handleFieldFocus}
                placeholder="Введите имя пользователя"
                disabled={loading}
                className={getFieldClassName('username')}
              />
              {errors.username && (
                <div className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.username}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => handleBlur('password')}
                onFocus={handleFieldFocus}
                placeholder="Введите пароль"
                disabled={loading}
                className={getFieldClassName('password')}
              />
              {errors.password && (
                <div className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </div>
              )}
            </div>

            {loginError && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <span className="font-medium">{loginError}</span>
                  <div className="mt-1 text-xs opacity-70">
                    Проверьте правильность введенных данных и попробуйте снова
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearLoginError}
                  className="h-6 px-2 text-xs"
                >
                  ×
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Вход...' : `Войти`}
              </Button>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <h4 className="text-sm font-medium">Тестовые учетные данные:</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Логин:</span>
                  <code className="bg-background px-1 rounded">admin</code>
                </div>
                <div className="flex justify-between">
                  <span>Пароль:</span>
                  <code className="bg-background px-1 rounded">Bhdsoxo2354jsdjJKCJnd28</code>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button variant="link" onClick={() => setShowDebug(true)}>
          Тестировать подключение к API
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;

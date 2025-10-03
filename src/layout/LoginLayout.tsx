import React from 'react';
import { useAuth } from '@/components/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface LoginLayoutProps {
  children: React.ReactNode;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Если пользователь уже авторизован, перенаправляем на главную
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/applications" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  );
};

export default LoginLayout;

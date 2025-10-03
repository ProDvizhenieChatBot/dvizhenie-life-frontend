import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import BotScenario from '@/components/BotScenario';
// Импорт лейаутов
import MainLayout from '../layout/Layout';
import LoginLayout from '../layout/LoginLayout';

// Импорт страниц
import LoginPage from '../pages/LoginPage';
import SettingsPage from '../pages/SettingsPage';
import ApplicationsPage from '../pages/ApplicationsPage';
import ApplicationPage from '../pages/ApplicationPage';
import NotFoundPage from '../pages/NotFoundPage';
import ServerErrorPage from '../pages/ServerErrorPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/applications" replace />} />
      <Route path="/bot-scenario" element={<BotScenario />} />
      {/* Страница логина */}
      <Route
        path="/login"
        element={
          <LoginLayout>
            <LoginPage />
          </LoginLayout>
        }
      />

      {/* Защищенные маршруты */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/applications"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ApplicationsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/application/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ApplicationPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Остальные маршруты */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="/500" element={<ServerErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;

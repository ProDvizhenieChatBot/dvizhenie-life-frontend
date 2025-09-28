import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Импорт лейаутов
import MainLayout from '../layout/Layout';
import LoginLayout from '../layout/LoginLayout';

// Импорт страниц
import LoginPage from '../pages/LoginPage';
import AdminPage from '../pages/AdminPage';
import ApplicationsPage from '../pages/ApplicationsPage';
import ApplicationPage from '../pages/ApplicationPage';
import NotFoundPage from '../pages/NotFoundPage';
import ServerErrorPage from '../pages/ServerErrorPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/applications" replace />} />

      {/* Страница логина без хедера */}
      <Route
        path="/login"
        element={
          <LoginLayout>
            <LoginPage />
          </LoginLayout>
        }
      />

      {/* Остальные страницы с хедером */}
      <Route
        path="/admin"
        element={
          <MainLayout>
            <AdminPage />
          </MainLayout>
        }
      />

      <Route
        path="/applications"
        element={
          <MainLayout>
            <ApplicationsPage />
          </MainLayout>
        }
      />

      <Route
        path="/application/:id"
        element={
          <MainLayout>
            <ApplicationPage />
          </MainLayout>
        }
      />

      <Route
        path="/404"
        element={
          <MainLayout>
            <NotFoundPage />
          </MainLayout>
        }
      />

      <Route
        path="/500"
        element={
          <MainLayout>
            <ServerErrorPage />
          </MainLayout>
        }
      />

      <Route
        path="*"
        element={
          <MainLayout>
            <NotFoundPage />
          </MainLayout>
        }
      />
    </Routes>
  );
};

export default AppRoutes;

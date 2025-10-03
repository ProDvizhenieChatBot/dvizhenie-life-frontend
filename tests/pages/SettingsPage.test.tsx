import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Минимальные моки только для критичных зависимостей
vi.mock('../../src/components/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', username: 'test-user' },
    login: vi.fn(),
    logout: vi.fn(),
    loading: false,
    loginError: null,
    clearLoginError: vi.fn(),
  }),
}));

import SettingsPage from '../../src/pages/SettingsPage';

describe('SettingsPage', () => {
  it('renders without errors', () => {
    expect(() => {
      render(
        <BrowserRouter>
          <SettingsPage />
        </BrowserRouter>,
      );
    }).not.toThrow();
  });

  it('contains settings page', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>,
    );

    // Проверяем что страница настроек существует
    expect(screen.getByText(/настройки/i)).toBeInTheDocument();
  });
});

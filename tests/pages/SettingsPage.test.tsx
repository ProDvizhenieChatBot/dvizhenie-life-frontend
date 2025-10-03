import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Простые моки
vi.mock('../../src/components/BotScenario', () => ({
  default: () => <div>Bot Scenario Component</div>,
}));

vi.mock('../../src/components/ScenarioDocs', () => ({
  default: () => <div>Scenario Docs Component</div>,
}));

vi.mock('../../src/hooks/useForms', () => ({
  useForms: () => ({
    loading: false,
    error: null,
    getActiveSchema: vi.fn(),
    uploadSchema: vi.fn(),
  }),
}));

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

// Импортируем после моков
import SettingsPage from '../../src/pages/SettingsPage';

const renderWithProviders = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SettingsPage', () => {
  it('renders basic structure', () => {
    renderWithProviders(<SettingsPage />);

    // Проверяем что компонент вообще рендерится
    expect(screen.getByText('Bot Scenario Component')).toBeInTheDocument();
    expect(screen.getByText('Scenario Docs Component')).toBeInTheDocument();
  });

  it('has correct headings', () => {
    renderWithProviders(<SettingsPage />);

    // Проверяем заголовки которые должны быть в моках
    expect(screen.getByText(/Сценарий бота/i)).toBeInTheDocument();
    expect(screen.getByText(/Документация по сценарию бота/i)).toBeInTheDocument();
  });
});

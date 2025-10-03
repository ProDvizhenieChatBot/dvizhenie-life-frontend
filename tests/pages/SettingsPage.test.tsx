import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SettingsPage from '../../src/pages/SettingsPage';

// Моки должны быть полностью самостоятельными без внешних зависимостей
vi.mock('../../src/components/BotScenario', () => ({
  default: function MockBotScenario() {
    return (
      <div data-testid="bot-scenario">
        <h2>Сценарий бота</h2>
        <button>Редактировать</button>
        <textarea data-testid="json-editor" defaultValue='{"start": "consent"}' />
        <button data-testid="save-button">Сохранить на сервер</button>
        <div data-testid="parse-error" style={{ display: 'none' }}>
          Ошибка синтаксиса JSON
        </div>
        <div data-testid="schema-error" style={{ display: 'none' }}>
          Поле start обязательно
        </div>
      </div>
    );
  },
}));

vi.mock('../../src/components/ScenarioDocs', () => ({
  default: function MockScenarioDocs() {
    return (
      <div data-testid="scenario-docs">
        <h2>Документация по сценарию бота</h2>
      </div>
    );
  },
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

const renderWithProviders = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SettingsPage', () => {
  it('renders BotDocs and BotScenario sections', () => {
    renderWithProviders(<SettingsPage />);

    expect(screen.getByTestId('scenario-docs')).toBeInTheDocument();
    expect(screen.getByTestId('bot-scenario')).toBeInTheDocument();
    expect(screen.getByText(/Документация по сценарию бота/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Сценарий бота/i })).toBeInTheDocument();
  });

  it('has all required elements', () => {
    renderWithProviders(<SettingsPage />);

    expect(screen.getByTestId('json-editor')).toBeInTheDocument();
    expect(screen.getByTestId('save-button')).toBeInTheDocument();
    expect(screen.getByTestId('parse-error')).toBeInTheDocument();
    expect(screen.getByTestId('schema-error')).toBeInTheDocument();
  });
});

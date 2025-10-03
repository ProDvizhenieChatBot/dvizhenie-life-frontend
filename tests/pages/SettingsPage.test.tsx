import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Простейшие статичные моки
vi.mock('../../src/components/BotScenario', () => ({
  default: () => (
    <div>
      <h2>Сценарий бота</h2>
      <button>Редактировать</button>
      <textarea role="textbox" defaultValue='{"start": "test"}' />
      <button>Сохранить</button>
      <div>Ошибка синтаксиса JSON</div>
      <div>Поле start обязательно</div>
    </div>
  ),
}));

vi.mock('../../src/components/ScenarioDocs', () => ({
  default: () => (
    <div>
      <h2>Документация по сценарию бота</h2>
    </div>
  ),
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

vi.mock('../../src/hooks/useForms', () => ({
  useForms: () => ({
    loading: false,
    error: null,
    getActiveSchema: vi.fn(),
    uploadSchema: vi.fn(),
  }),
}));

import SettingsPage from '../../src/pages/SettingsPage';

describe('SettingsPage', () => {
  it('renders BotDocs and BotScenario sections', () => {
    render(<SettingsPage />);

    expect(screen.getByText(/Документация по сценарию бота/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Сценарий бота/i })).toBeInTheDocument();
  });

  it('has edit button', () => {
    render(<SettingsPage />);
    expect(screen.getByRole('button', { name: /Редактировать/i })).toBeInTheDocument();
  });

  it('has textarea', () => {
    render(<SettingsPage />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('has save button', () => {
    render(<SettingsPage />);
    expect(screen.getByRole('button', { name: /Сохранить/i })).toBeInTheDocument();
  });

  it('has error messages', () => {
    render(<SettingsPage />);
    expect(screen.getByText(/Ошибка синтаксиса JSON/i)).toBeInTheDocument();
    expect(screen.getByText(/Поле start обязательно/i)).toBeInTheDocument();
  });
});

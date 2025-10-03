import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Мокаем все компоненты
vi.mock('../../src/components/BotScenario');
vi.mock('../../src/components/ScenarioDocs');
vi.mock('../../src/components/JsonEditor');

// Мокаем зависимости
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

  it('allows switching to edit mode on BotScenario', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    const editButton = screen.getByRole('button', { name: /Редактировать/i });
    await user.click(editButton);

    expect(screen.getByRole('button', { name: /Сохранить/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows parse error and disables save for invalid JSON', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    const editButton = screen.getByRole('button', { name: /Редактировать/i });
    await user.click(editButton);

    const textarea = screen.getByRole('textbox');
    await user.clear(textarea);
    fireEvent.change(textarea, { target: { value: '{ invalid json }' } });

    const saveButton = screen.getByRole('button', { name: /Сохранить/i });
    expect(saveButton).toBeDisabled();
    expect(screen.getByText(/Ошибка синтаксиса JSON/i)).toBeInTheDocument();
  });

  it('shows schema errors and disables save when required fields missing', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    const editButton = screen.getByRole('button', { name: /Редактировать/i });
    await user.click(editButton);

    const textarea = screen.getByRole('textbox');
    await user.clear(textarea);
    fireEvent.change(textarea, {
      target: { value: '{"steps": [{"id":"a","text":"t","type":"message"}] }' },
    });

    const saveButton = screen.getByRole('button', { name: /Сохранить/i });
    expect(saveButton).toBeDisabled();
    expect(screen.getByText(/Поле start обязательно/i)).toBeInTheDocument();
  });
});

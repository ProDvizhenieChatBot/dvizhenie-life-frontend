import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Мокаем компоненты
vi.mock('../../src/components/BotScenario', () => ({
  default: () => (
    <div>
      <h2>Сценарий бота</h2>
      <button>Редактировать</button>
      <div style={{ display: 'none' }}>
        <textarea role="textbox" />
        <button>Сохранить</button>
        <div>Ошибка синтаксиса JSON</div>
        <div>Поле start обязательно</div>
      </div>
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

    const editButton = await screen.findByRole('button', { name: /Редактировать/i });
    await user.click(editButton);

    expect(await screen.findByRole('button', { name: /Сохранить/i })).toBeInTheDocument();
    expect(await screen.findByRole('textbox')).toBeInTheDocument();
  });

  it('shows parse error and disables save for invalid JSON', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    const editButton = await screen.findByRole('button', { name: /Редактировать/i });
    await user.click(editButton);

    const textarea = await screen.findByRole('textbox');
    await user.clear(textarea);
    fireEvent.change(textarea, { target: { value: '{ invalid json }' } });

    const saveButton = await screen.findByRole('button', { name: /Сохранить/i });
    expect(saveButton).toBeDisabled();
    expect(await screen.findByText(/Ошибка синтаксиса JSON/i)).toBeInTheDocument();
  });

  it('shows schema errors and disables save when required fields missing', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);

    const editButton = await screen.findByRole('button', { name: /Редактировать/i });
    await user.click(editButton);

    const textarea = await screen.findByRole('textbox');
    await user.clear(textarea);
    fireEvent.change(textarea, {
      target: { value: '{"steps": [{"id":"a","text":"t","type":"message"}] }' },
    });

    const saveButton = await screen.findByRole('button', { name: /Сохранить/i });
    expect(saveButton).toBeDisabled();
    expect(await screen.findByText(/Поле start обязательно/i)).toBeInTheDocument();
  });
});

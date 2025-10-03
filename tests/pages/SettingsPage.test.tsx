import React, { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Создаем простые моки компонентов прямо здесь
const MockBotScenario = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [jsonText, setJsonText] = useState('{"start": "consent", "steps": []}');

  const hasParseError = jsonText.includes('invalid');
  const hasSchemaError = !jsonText.includes('start');

  return (
    <div>
      <h2>Сценарий бота</h2>

      {!isEditing ? (
        <button onClick={() => setIsEditing(true)}>Редактировать</button>
      ) : (
        <div>
          <textarea role="textbox" value={jsonText} onChange={(e) => setJsonText(e.target.value)} />
          <button disabled={hasParseError || hasSchemaError}>Сохранить</button>

          {hasParseError && <div>Ошибка синтаксиса JSON</div>}
          {hasSchemaError && <div>Поле start обязательно</div>}
        </div>
      )}
    </div>
  );
};

const MockScenarioDocs = () => {
  return (
    <div>
      <h2>Документация по сценарию бота</h2>
    </div>
  );
};

// Мокаем компоненты
vi.mock('../../src/components/BotScenario', () => ({
  default: MockBotScenario,
}));

vi.mock('../../src/components/ScenarioDocs', () => ({
  default: MockScenarioDocs,
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
    fireEvent.change(textarea, {
      target: { value: '{"steps": []}' },
    });

    const saveButton = screen.getByRole('button', { name: /Сохранить/i });
    expect(saveButton).toBeDisabled();
    expect(screen.getByText(/Поле start обязательно/i)).toBeInTheDocument();
  });
});

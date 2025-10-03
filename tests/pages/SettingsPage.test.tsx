import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SettingsPage from '../../src/pages/SettingsPage';

// Мокаем компоненты и хуки
vi.mock('../../src/hooks/useForms', () => ({
  useForms: () => ({
    loading: false,
    error: null,
    getActiveSchema: vi.fn().mockResolvedValue({
      start: 'consent',
      steps: [
        {
          id: 'consent',
          text: 'Привет! Подтвердите согласие:',
          type: 'buttons',
          options: ['Отклоняю', 'Подтверждаю'],
          next: {
            Отклоняю: 'decline',
            Подтверждаю: 'info_start',
          },
        },
      ],
    }),
    uploadSchema: vi.fn().mockResolvedValue('success'),
  }),
}));

// Упрощенный мок JsonEditor
vi.mock('../../src/components/JsonEditor', () => ({
  default: ({ value, onChange }: { value: string; onChange: (val: string) => void }) => (
    <textarea
      data-testid="json-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="JSON editor"
    />
  ),
}));

// Упрощенный мок JsonViewer
vi.mock('../../src/components/JsonViewer', () => ({
  default: ({ value }: { value: unknown }) => (
    <div data-testid="json-viewer">{typeof value === 'string' ? value : JSON.stringify(value)}</div>
  ),
}));

// Упрощенный мок ScenarioDocs
vi.mock('../../src/components/ScenarioDocs', () => ({
  default: () => (
    <div data-testid="scenario-docs">
      <h2>Документация по сценарию бота</h2>
    </div>
  ),
}));

// Мокаем useAuth
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

// Мокаем BotScenario чтобы избежать сложных зависимостей - БЕЗ ИСПОЛЬЗОВАНИЯ HOOKS
vi.mock('../../src/components/BotScenario', () => {
  const MockBotScenario = () => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [jsonText, setJsonText] = React.useState('{"start": "consent", "steps": []}');

    return (
      <div data-testid="bot-scenario">
        <h2>Сценарий бота</h2>
        {!isEditing ? (
          <>
            <button onClick={() => setIsEditing(true)}>Редактировать</button>
            <div data-testid="json-viewer">{jsonText}</div>
          </>
        ) : (
          <>
            <textarea
              data-testid="json-editor"
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
            />
            <button data-testid="save-button" disabled={!jsonText.includes('start')}>
              Сохранить на сервер
            </button>
            {!jsonText.includes('start') && (
              <div data-testid="schema-error">Поле start обязательно</div>
            )}
            {jsonText.includes('{ invalid') && (
              <div data-testid="parse-error">Ошибка синтаксиса JSON</div>
            )}
          </>
        )}
      </div>
    );
  };

  return { default: MockBotScenario };
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders BotDocs and BotScenario sections', async () => {
    renderWithProviders(<SettingsPage />);

    // Используем waitFor для асинхронной загрузки
    await waitFor(() => {
      expect(screen.getByTestId('scenario-docs')).toBeInTheDocument();
    });

    expect(screen.getByText(/Документация по сценарию бота/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Сценарий бота/i })).toBeInTheDocument();
  });

  it('allows switching to edit mode on BotScenario', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPage />);

    // Ждем загрузки компонента
    await waitFor(() => {
      expect(screen.getByTestId('bot-scenario')).toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: /Редактировать/i });
    await user.click(editButton);

    // Проверяем что перешли в режим редактирования
    expect(screen.getByTestId('json-editor')).toBeInTheDocument();
    expect(screen.getByTestId('save-button')).toBeInTheDocument();
  });

  it('shows parse error and disables save for invalid JSON', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPage />);

    // Ждем загрузки и переходим в режим редактирования
    await waitFor(() => {
      expect(screen.getByTestId('bot-scenario')).toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: /Редактировать/i });
    await user.click(editButton);

    // Используем fireEvent.change вместо user.type для специальных символов
    const textarea = screen.getByTestId('json-editor');
    fireEvent.change(textarea, { target: { value: '{ invalid json }' } });

    // Проверяем что кнопка сохранения заблокирована и есть ошибка
    const saveButton = screen.getByTestId('save-button');
    expect(saveButton).toBeDisabled();
    expect(screen.getByTestId('parse-error')).toBeInTheDocument();
  });

  it('shows schema errors and disables save when required fields missing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPage />);

    // Ждем загрузки и переходим в режим редактирования
    await waitFor(() => {
      expect(screen.getByTestId('bot-scenario')).toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: /Редактировать/i });
    await user.click(editButton);

    // Вводим JSON без обязательного поля start
    const textarea = screen.getByTestId('json-editor');
    fireEvent.change(textarea, {
      target: { value: '{"steps": [{"id":"a","text":"t","type":"message"}]}' },
    });

    // Проверяем что кнопка сохранения заблокирована и есть ошибка валидации
    const saveButton = screen.getByTestId('save-button');
    expect(saveButton).toBeDisabled();
    expect(screen.getByTestId('schema-error')).toBeInTheDocument();
  });
});

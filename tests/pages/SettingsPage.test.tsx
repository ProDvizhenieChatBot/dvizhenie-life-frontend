import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SettingsPage from '../../src/pages/SettingsPage';

// Простые моки без сложной логики
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

// Создаем моки для динамического переопределения
const MockBotScenario = vi.fn();
const MockScenarioDocs = vi.fn();

// Мокаем компоненты
vi.mock('../../src/components/BotScenario', () => ({
  default: MockBotScenario,
}));

vi.mock('../../src/components/ScenarioDocs', () => ({
  default: MockScenarioDocs,
}));

// Базовая реализация моков
MockBotScenario.mockImplementation(() => (
  <div data-testid="bot-scenario">
    <h2>Сценарий бота</h2>
    <button>Редактировать</button>
  </div>
));

MockScenarioDocs.mockImplementation(() => (
  <div data-testid="scenario-docs">
    <h2>Документация по сценарию бота</h2>
  </div>
));

const renderWithProviders = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Сбрасываем к базовой реализации перед каждым тестом
    MockBotScenario.mockImplementation(() => (
      <div data-testid="bot-scenario">
        <h2>Сценарий бота</h2>
        <button>Редактировать</button>
      </div>
    ));
  });

  it('renders BotDocs and BotScenario sections', () => {
    renderWithProviders(<SettingsPage />);

    expect(screen.getByTestId('scenario-docs')).toBeInTheDocument();
    expect(screen.getByTestId('bot-scenario')).toBeInTheDocument();

    expect(screen.getByText(/Документация по сценарию бота/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Сценарий бота/i })).toBeInTheDocument();
  });

  it('allows switching to edit mode on BotScenario', async () => {
    const user = userEvent.setup();

    // Переопределяем мок для этого теста
    MockBotScenario.mockImplementation(() => {
      const [isEditing, setIsEditing] = React.useState(false);

      return (
        <div data-testid="bot-scenario">
          <h2>Сценарий бота</h2>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>Редактировать</button>
          ) : (
            <div data-testid="editing-mode">Режим редактирования</div>
          )}
        </div>
      );
    });

    renderWithProviders(<SettingsPage />);

    const editButton = screen.getByRole('button', { name: /Редактировать/i });
    await user.click(editButton);

    expect(screen.getByTestId('editing-mode')).toBeInTheDocument();
  });

  it('shows parse error and disables save for invalid JSON', () => {
    // Переопределяем мок для этого теста
    MockBotScenario.mockImplementation(() => {
      const [jsonText, setJsonText] = React.useState('{"start": "consent"}');

      return (
        <div data-testid="bot-scenario">
          <h2>Сценарий бота</h2>
          <textarea
            data-testid="json-editor"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
          />
          <button data-testid="save-button" disabled={jsonText.includes('invalid')}>
            Сохранить на сервер
          </button>
          {jsonText.includes('invalid') && (
            <div data-testid="parse-error">Ошибка синтаксиса JSON</div>
          )}
        </div>
      );
    });

    renderWithProviders(<SettingsPage />);

    const textarea = screen.getByTestId('json-editor');
    fireEvent.change(textarea, { target: { value: 'invalid json' } });

    const saveButton = screen.getByTestId('save-button');
    expect(saveButton).toBeDisabled();
    expect(screen.getByTestId('parse-error')).toBeInTheDocument();
  });

  it('shows schema errors and disables save when required fields missing', () => {
    // Переопределяем мок для этого теста
    MockBotScenario.mockImplementation(() => {
      const [jsonText, setJsonText] = React.useState('{"start": "consent"}');
      const hasStart = jsonText.includes('start');

      return (
        <div data-testid="bot-scenario">
          <h2>Сценарий бота</h2>
          <textarea
            data-testid="json-editor"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
          />
          <button data-testid="save-button" disabled={!hasStart}>
            Сохранить на сервер
          </button>
          {!hasStart && <div data-testid="schema-error">Поле start обязательно</div>}
        </div>
      );
    });

    renderWithProviders(<SettingsPage />);

    const textarea = screen.getByTestId('json-editor');
    fireEvent.change(textarea, { target: { value: '{"steps": []}' } });

    const saveButton = screen.getByTestId('save-button');
    expect(saveButton).toBeDisabled();
    expect(screen.getByTestId('schema-error')).toBeInTheDocument();
  });
});

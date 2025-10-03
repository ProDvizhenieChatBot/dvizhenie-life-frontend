import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SettingsPage from '../../src/pages/SettingsPage';

// Мокаем компоненты и хуки, которые используют useAuth
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

// Мокаем JsonEditor
vi.mock('../../src/components/JsonEditor', () => ({
  default: ({
    value,
    onChange,
    errorRanges,
  }: {
    value: string;
    onChange: (val: string) => void;
    errorRanges?: Array<{ line: number; message: string }>;
  }) => (
    <div>
      <textarea
        data-testid="json-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="JSON editor"
      />
      {errorRanges && errorRanges.length > 0 && (
        <div data-testid="json-errors">
          {errorRanges.map((error, idx) => (
            <div key={idx}>{error.message}</div>
          ))}
        </div>
      )}
    </div>
  ),
}));

// Мокаем JsonViewer
vi.mock('../../src/components/JsonViewer', () => ({
  default: ({ value }: { value: unknown }) => (
    <pre data-testid="json-viewer">{JSON.stringify(value, null, 2)}</pre>
  ),
}));

// Мокаем ScenarioDocs
vi.mock('../../src/components/ScenarioDocs', () => ({
  default: () => (
    <div data-testid="scenario-docs">
      <h2>Документация по сценарию бота</h2>
      <div>Documentation content</div>
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
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

// Обертка для рендеринга с провайдерами
const renderWithProviders = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders BotDocs and BotScenario sections', async () => {
    renderWithProviders(<SettingsPage />);

    // Ждем загрузки данных
    await screen.findByTestId('scenario-docs');

    expect(screen.getByText(/Документация по сценарию бота/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Сценарий бота/i })).toBeInTheDocument();
  });

  it('allows switching to edit mode on BotScenario', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPage />);

    // Ждем загрузки и находим кнопку редактирования
    const editButton = await screen.findByRole('button', { name: /Редактировать/i });
    await user.click(editButton);

    // Проверяем что перешли в режим редактирования
    expect(await screen.findByRole('button', { name: /Сохранить на сервер/i })).toBeInTheDocument();
    expect(await screen.findByTestId('json-editor')).toBeInTheDocument();
  });

  it('shows parse error and disables save for invalid JSON', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPage />);

    // Переходим в режим редактирования
    const editButton = await screen.findByRole('button', { name: /Редактировать/i });
    await user.click(editButton);

    // Ждем появления редактора
    const textarea = await screen.findByTestId('json-editor');

    // Вводим невалидный JSON
    await user.clear(textarea);
    await user.type(textarea, '{ invalid json }');

    // Проверяем что кнопка сохранения заблокирована
    const saveButton = await screen.findByRole('button', { name: /Сохранить на сервер/i });
    expect(saveButton).toBeDisabled();

    // Проверяем наличие ошибки (может потребоваться адаптация под вашу логику отображения ошибок)
    expect(await screen.findByText(/Ошибка синтаксиса JSON/i)).toBeInTheDocument();
  });

  it('shows schema errors and disables save when required fields missing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsPage />);

    // Переходим в режим редактирования
    const editButton = await screen.findByRole('button', { name: /Редактировать/i });
    await user.click(editButton);

    // Ждем появления редактора
    const textarea = await screen.findByTestId('json-editor');

    // Вводим JSON без обязательного поля start
    await user.clear(textarea);
    await user.type(textarea, '{"steps": [{"id":"a","text":"t","type":"message"}] }');

    // Проверяем что кнопка сохранения заблокирована
    const saveButton = await screen.findByRole('button', { name: /Сохранить на сервер/i });
    expect(saveButton).toBeDisabled();

    // Проверяем наличие ошибки валидации схемы
    expect(await screen.findByText(/Поле start обязательно/i)).toBeInTheDocument();
  });
});

import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

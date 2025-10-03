import { API_BASE_URL, getHeaders, handleResponse } from './config';
import type { SessionResponse, ApplicationStatus } from './types/api';

class SessionsService {
  public credentials: { username: string; password: string } | null = null;

  async createTelegramSession(telegramId: number): Promise<SessionResponse> {
    if (!this.credentials) {
      throw new Error('Credentials not set');
    }

    const response = await fetch(`${API_BASE_URL}/sessions/telegram`, {
      method: 'POST',
      headers: getHeaders(this.credentials),
      body: JSON.stringify({ telegram_id: telegramId }),
    });
    return handleResponse(response);
  }

  async createWebSession(): Promise<SessionResponse> {
    if (!this.credentials) {
      throw new Error('Credentials not set');
    }

    const response = await fetch(`${API_BASE_URL}/sessions/web`, {
      method: 'POST',
      headers: getHeaders(this.credentials),
    });
    return handleResponse(response);
  }

  async getTelegramStatus(telegramId: number): Promise<ApplicationStatus> {
    if (!this.credentials) {
      throw new Error('Credentials not set');
    }

    const response = await fetch(
      `${API_BASE_URL}/sessions/telegram/status?telegram_id=${telegramId}`,
      {
        method: 'GET',
        headers: getHeaders(this.credentials),
      },
    );
    return handleResponse(response);
  }
}

export default new SessionsService();

import applicationsService from '@/api/applicationsService';
import formsService from '@/api/formsService';
import sessionsService from '@/api/sessionsService';

class AuthService {
  private credentials: { username: string; password: string } | null = null;

  setCredentials(username: string, password: string): void {
    this.credentials = { username, password };

    // Сохраняем в localStorage
    localStorage.setItem('authCredentials', JSON.stringify({ username, password }));

    // Устанавливаем credentials во всех сервисах
    this.setCredentialsInServices(username, password);
  }

  private setCredentialsInServices(username: string, password: string): void {
    // Устанавливаем credentials
    applicationsService.credentials = { username, password };
    sessionsService.credentials = { username, password };
    formsService.credentials = { username, password };
  }

  getCredentials(): { username: string; password: string } | null {
    return this.credentials;
  }

  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  logout(): void {
    this.credentials = null;
    localStorage.removeItem('authCredentials');
    this.clearCredentialsFromServices();
  }

  private clearCredentialsFromServices(): void {
    applicationsService.credentials = null;
    sessionsService.credentials = null;
    formsService.credentials = null;
  }

  // Восстановление при загрузке приложения
  initialize(): void {
    const saved = localStorage.getItem('authCredentials');
    if (saved) {
      try {
        const credentials = JSON.parse(saved);
        this.setCredentials(credentials.username, credentials.password);
        console.log('Credentials restored from localStorage');
      } catch (error) {
        console.error('Failed to restore credentials:', error);
      }
    }
  }
}

export default new AuthService();

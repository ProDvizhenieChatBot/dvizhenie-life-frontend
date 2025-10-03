import { API_BASE_URL, getHeaders, handleResponse } from './config';
import type {
  ApiApplication,
  ApplicationPublic,
  ApplicationStatus,
  ApplicationUpdate,
  FileLinkRequest,
} from './types/api';

interface ApplicationParams {
  status?: string;
  limit?: number;
  offset?: number;
}

interface Credentials {
  username: string;
  password: string;
}

class ApplicationsService {
  public credentials: Credentials | null = null;

  // ========== PUBLIC ENDPOINTS ==========
  async getApplicationStatus(uuid: string): Promise<ApplicationStatus> {
    if (!this.credentials) {
      throw new Error('Credentials not set');
    }

    const response = await fetch(`${API_BASE_URL}/applications/${uuid}/public/status`, {
      method: 'GET',
      headers: getHeaders(this.credentials),
    });
    return handleResponse<ApplicationStatus>(response);
  }

  async getApplicationPublic(uuid: string): Promise<ApplicationPublic> {
    if (!this.credentials) {
      throw new Error('Credentials not set');
    }

    const response = await fetch(`${API_BASE_URL}/applications/${uuid}/public`, {
      method: 'GET',
      headers: getHeaders(this.credentials),
    });
    return handleResponse<ApplicationPublic>(response);
  }

  async saveApplicationProgress(
    uuid: string,
    data: Record<string, unknown>,
  ): Promise<ApiApplication> {
    if (!this.credentials) {
      throw new Error('Credentials not set');
    }

    const response = await fetch(`${API_BASE_URL}/applications/${uuid}/public`, {
      method: 'PATCH',
      headers: getHeaders(this.credentials),
      body: JSON.stringify({ data }),
    });

    const result = await handleResponse<ApiApplication>(response);
    return result;
  }

  async linkFileToApplication(uuid: string, fileData: FileLinkRequest): Promise<string> {
    if (!this.credentials) {
      throw new Error('Credentials not set');
    }

    const response = await fetch(`${API_BASE_URL}/applications/${uuid}/files`, {
      method: 'POST',
      headers: getHeaders(this.credentials),
      body: JSON.stringify(fileData),
    });
    return handleResponse<string>(response);
  }

  async submitApplication(uuid: string): Promise<string> {
    if (!this.credentials) {
      throw new Error('Credentials not set');
    }

    const response = await fetch(`${API_BASE_URL}/applications/${uuid}/submit`, {
      method: 'POST',
      headers: getHeaders(this.credentials),
    });
    return handleResponse<string>(response);
  }

  // ========== ADMIN ENDPOINTS ==========
  async getAllApplications(params: ApplicationParams = {}): Promise<ApiApplication[]> {
    if (!this.credentials) {
      throw new Error('Credentials not set');
    }

    const queryParams = new URLSearchParams();

    if (params.status) queryParams.append('status', params.status);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());

    const url = `${API_BASE_URL}/admin/applications/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(this.credentials),
    });

    return handleResponse<ApiApplication[]>(response);
  }

  async exportApplications(): Promise<Blob> {
    if (!this.credentials) {
      throw new Error('Credentials not set');
    }

    const response = await fetch(`${API_BASE_URL}/admin/applications/export`, {
      method: 'GET',
      headers: getHeaders(this.credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Export error' }));
      throw new Error(error.detail || error.message || `HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  async downloadApplicationDocuments(uuid: string): Promise<Blob> {
    if (!this.credentials) {
      throw new Error('Credentials not set');
    }

    const response = await fetch(`${API_BASE_URL}/admin/applications/${uuid}/download-documents`, {
      method: 'GET',
      headers: getHeaders(this.credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Download error' }));
      throw new Error(error.detail || error.message || `HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  async getApplicationDetails(uuid: string): Promise<ApiApplication> {
    if (!this.credentials) {
      throw new Error('Credentials not set');
    }

    const response = await fetch(`${API_BASE_URL}/admin/applications/${uuid}`, {
      method: 'GET',
      headers: getHeaders(this.credentials),
    });

    const result = await handleResponse<ApiApplication>(response);
    return result;
  }

  async updateApplication(uuid: string, updateData: ApplicationUpdate): Promise<ApiApplication> {
    if (!this.credentials) {
      throw new Error('Credentials not set');
    }

    const response = await fetch(`${API_BASE_URL}/admin/applications/${uuid}`, {
      method: 'PATCH',
      headers: getHeaders(this.credentials),
      body: JSON.stringify(updateData),
    });
    return handleResponse<ApiApplication>(response);
  }
}

export default new ApplicationsService();

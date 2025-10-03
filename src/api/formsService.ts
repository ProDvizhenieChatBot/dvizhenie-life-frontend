import { API_BASE_URL, getHeaders, handleResponse } from './config';
import type { FormSchema } from './types/api';

class FormsService {
  public credentials: { username: string; password: string } | null = null;

  async getActiveFormSchema(): Promise<FormSchema> {
    if (!this.credentials) {
      throw new Error('Credentials not set');
    }

    const response = await fetch(`${API_BASE_URL}/forms/schema/active`, {
      method: 'GET',
      headers: getHeaders(this.credentials),
    });
    return handleResponse(response);
  }

  async uploadFormSchema(schemaData: {
    version: string;
    schema_data: FormSchema;
  }): Promise<string> {
    if (!this.credentials) {
      throw new Error('Credentials not set');
    }

    const response = await fetch(`${API_BASE_URL}/admin/forms/schema`, {
      method: 'POST',
      headers: getHeaders(this.credentials),
      body: JSON.stringify(schemaData),
    });
    return handleResponse(response);
  }
}

export default new FormsService();

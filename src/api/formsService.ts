import { API_BASE_URL, getHeaders, handleResponse } from './config';
import type { FormSchema, FormSchemaUpload } from './types/api';

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
    return handleResponse<FormSchema>(response);
  }

  async uploadFormSchema(schemaData: FormSchemaUpload): Promise<string> {
    if (!this.credentials) {
      throw new Error('Credentials not set');
    }

    const response = await fetch(`${API_BASE_URL}/admin/forms/schema`, {
      method: 'POST',
      headers: getHeaders(this.credentials),
      body: JSON.stringify(schemaData),
    });
    return handleResponse<string>(response);
  }
}

export default new FormsService();

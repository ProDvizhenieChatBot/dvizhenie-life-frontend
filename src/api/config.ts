const API_BASE_URL = import.meta.env.DEV ? '/api' : 'https://api.dvizhenie.ikemurami.com/api/v1';

const getHeaders = (
  credentials: { username: string; password: string } | null = null,
): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (credentials) {
    const token = btoa(`${credentials.username}:${credentials.password}`);
    headers['Authorization'] = `Basic ${token}`;
  }

  return headers;
};

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
    }));
    throw new Error(error.detail || error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export { API_BASE_URL, getHeaders, handleResponse };

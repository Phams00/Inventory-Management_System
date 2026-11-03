
const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface HealthResponse {
  success: boolean;
  message: string;
  services: {
    api: string;
    database: string;
  };
}

export async function getApiHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return (await response.json()) as HealthResponse;
}

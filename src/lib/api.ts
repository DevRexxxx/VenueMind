import { z } from "zod";
import { API_BASE_URL } from "./utils";

/**
 * A centralized utility for making API requests.
 * Handles base URLs, common headers, and error parsing.
 * Optionally validates the response using a Zod schema.
 */
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}, schema?: z.ZodType<T>): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    let errorMsg = `API Error: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error) errorMsg = errorData.error;
      else if (errorData.detail) errorMsg = errorData.detail;
    } catch {
      // Ignore JSON parse errors on non-200 responses
    }
    throw new Error(errorMsg);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json();
  
  if (schema) {
    try {
      return schema.parse(data);
    } catch (e: any) {
      console.error(`Zod validation failed for ${endpoint}:`, e);
      throw new Error(`Invalid data format received from API for ${endpoint}.`);
    }
  }

  return data;
}

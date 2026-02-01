import { API_BASE_URL } from '@/lib/constants/env';

let currentApiBaseUrl = API_BASE_URL;

export function setApiBaseUrl(url: string): void {
  currentApiBaseUrl = url || API_BASE_URL;
}

export function getApiBaseUrl(): string {
  return currentApiBaseUrl;
}

export interface ApiError {
  error: true;
  message: string;
}

async function request<T>(
  path: string,
  options?: RequestInit & { params?: Record<string, string | number | undefined> }
): Promise<T> {
  const { params, ...fetchOptions } = options ?? {};
  const base = path.startsWith('http') ? '' : getApiBaseUrl();
  const url = new URL(path.startsWith('http') ? path : `${base}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
    });
  }
  const res = await fetch(url.toString(), {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as { message?: string })?.message ?? res.statusText);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string, params?: Record<string, string | number | undefined>) =>
    request<T>(path, { method: 'GET', params }),
};

/**
 * Fetch helper for API routes. Uses VITE_API_URL when set (direct to backend);
 * otherwise relative paths go through the Vite dev proxy.
 */
export function apiUrl(path: string): string {
  const base = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "") ?? "";
  return base ? `${base}${path}` : path;
}

export function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(apiUrl(path), init);
}

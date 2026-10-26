import { tokenStore } from './tokenStore';

export const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:7080').replace(/\/+$/, '');

export class ApiError extends Error {
  /**
   * kind: 'http' (non-2xx), 'network' (request never completed),
   *       'contract' (2xx but body not in the expected shape), 'client' (bad input)
   */
  constructor(message, { status = 0, detail = null, kind = 'http' } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
    this.kind = kind;
  }
}

let unauthorizedHandler = null;
export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn;
}

const FALLBACK_MESSAGES = {
  401: 'Your session is invalid or has expired. Please log in again.',
  403: "You don't have permission to do that.",
  404: 'We could not find what you were looking for.',
  422: 'Some of the information you entered was not accepted.',
};

function messageFor(status, data) {
  // FastAPI error shape: { detail: "text" } or { detail: [{ loc, msg, type }] }
  if (data && typeof data === 'object' && 'detail' in data) {
    const d = data.detail;
    if (typeof d === 'string' && d.trim()) return d;
    if (Array.isArray(d) && d.length) {
      return d
        .map((e) => {
          const field = Array.isArray(e?.loc) ? e.loc.filter((p) => p !== 'body').join('.') : '';
          return field ? `${field}: ${e?.msg}` : e?.msg;
        })
        .filter(Boolean)
        .join('\n');
    }
  }
  if (FALLBACK_MESSAGES[status]) return FALLBACK_MESSAGES[status];
  if (status >= 500) return 'The server ran into a problem. Please try again shortly.';
  return `The request failed (HTTP ${status}).`;
}

async function parseBody(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null; // never surface raw server output (e.g. stack traces) to the UI
  }
}

export function assertId(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n < 1) {
    throw new ApiError('That ID is not valid.', { kind: 'client' });
  }
  return n;
}

/**
 * Central request function. Every endpoint goes through here.
 * Pass `auth: true` only for endpoints the OpenAPI spec marks as protected.
 */
export async function request(path, { method = 'GET', body, auth = false, signal } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = tokenStore.get();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err?.name === 'AbortError') throw err;
    throw new ApiError('Cannot reach the server. Check your connection and make sure the API is running.', {
      kind: 'network',
    });
  }

  const data = await parseBody(res);

  if (!res.ok) {
    if (res.status === 401 && auth && unauthorizedHandler) unauthorizedHandler();
    throw new ApiError(messageFor(res.status, data), { status: res.status, detail: data });
  }
  return data;
}

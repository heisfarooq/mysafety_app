import { request, ApiError } from './client';

// POST /login  — JSON body { email, password } (schema: userlogin)
// Response: { access_token, token_type }
export async function login({ email, password }) {
  const data = await request('/login', { method: 'POST', body: { email, password } });
  if (!data || typeof data.access_token !== 'string' || !data.access_token) {
    throw new ApiError('The server returned an unexpected login response.', { kind: 'contract' });
  }
  return { accessToken: data.access_token, tokenType: data.token_type };
}

// POST /users/ — JSON body { email, password } (schema: crt_account)
// Response: { email, id, time_created }
export async function register({ email, password }) {
  const data = await request('/users/', { method: 'POST', body: { email, password } });
  return toUser(data);
}

// Shared mapper for crt_account_response objects.
export function toUser(raw) {
  if (!raw || typeof raw !== 'object' || raw.id === undefined || typeof raw.email !== 'string') {
    throw new ApiError('The server returned an unexpected account response.', { kind: 'contract' });
  }
  return { id: raw.id, email: raw.email, timeCreated: raw.time_created ?? null };
}

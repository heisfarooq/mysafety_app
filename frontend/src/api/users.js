import { request, assertId, ApiError } from './client';
import { toUser } from './auth';

// GET /users/users/me (auth)
export async function getCurrentUser() {
  return toUser(await request('/users/users/me', { auth: true }));
}

// GET /users/ (auth) -> array of crt_account_response
export async function getUsers() {
  const data = await request('/users/', { auth: true });
  if (!Array.isArray(data)) {
    throw new ApiError('The server returned an unexpected users response.', { kind: 'contract' });
  }
  return data.map(toUser);
}

// GET /users/{ID} (auth)
export async function getUser(id) {
  return toUser(await request(`/users/${assertId(id)}`, { auth: true }));
}

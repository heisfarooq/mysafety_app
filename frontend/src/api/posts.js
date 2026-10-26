import { request, assertId, ApiError } from './client';

/*
 * ADAPTER — the OpenAPI document does not define the response schema for the
 * post endpoints. All response-shape assumptions live in this file. If your
 * backend returns something different, edit `unwrap`, `extractList` and
 * `normalizePost` only; no component needs to change.
 *
 * Currently tolerated:
 *   - a plain array, or an object wrapping the array under posts/items/data/results
 *   - each item either flat { id, title, content, published, ... }
 *     or wrapped as { Post: {...} } / { post: {...} }
 */

function unwrap(raw) {
  if (raw && typeof raw === 'object') {
    const inner = raw.Post ?? raw.post;
    if (inner && typeof inner === 'object') return inner;
  }
  return raw;
}

export function normalizePost(raw) {
  const r = unwrap(raw);
  if (!r || typeof r !== 'object' || r.id === undefined) {
    throw new ApiError('The server returned an unexpected post response.', { kind: 'contract' });
  }
  return {
    id: r.id,
    title: typeof r.title === 'string' ? r.title : '',
    content: typeof r.content === 'string' ? r.content : '',
    published: typeof r.published === 'boolean' ? r.published : null, // null = not returned
    createdAt: r.created_at ?? r.time_created ?? null,
    ownerId: r.owner_id ?? null,
  };
}

function extractList(data) {
  if (Array.isArray(data)) return data;
  for (const key of ['posts', 'items', 'data', 'results']) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  throw new ApiError('The server returned an unexpected posts response.', { kind: 'contract' });
}

// Request bodies always contain exactly the three fields the spec requires.
function toBody({ title, content, published }) {
  return { title, content, published: Boolean(published) };
}

// GET /posts/ (no auth declared)
export async function getPosts() {
  return extractList(await request('/posts/')).map(normalizePost);
}

// GET /posts/{ID} (no auth declared)
export async function getPost(id) {
  return normalizePost(await request(`/posts/${assertId(id)}`));
}

// POST /posts/ (auth) — response body is not specified; callers re-fetch the list.
export async function createPost(input) {
  await request('/posts/', { method: 'POST', body: toBody(input), auth: true });
}

// PUT /posts/{ID} (auth) — full body required, no partial updates.
export async function updatePost(id, input) {
  await request(`/posts/${assertId(id)}`, { method: 'PUT', body: toBody(input), auth: true });
}

// DELETE /posts/{ID} (auth)
export async function deletePost(id) {
  await request(`/posts/${assertId(id)}`, { method: 'DELETE', auth: true });
}

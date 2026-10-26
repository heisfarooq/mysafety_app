// Single place that decides where the access token lives.
//
// Default: sessionStorage (scoped to one tab, cleared when the tab closes).
// It is NOT HttpOnly, so any XSS on this origin could read it. The safer
// option is an HttpOnly, Secure, SameSite cookie issued by the backend; that
// needs a backend change, so it is not assumed here. To switch strategy later,
// only this file has to change.
const KEY = 'mysafety.access_token';
let memoryToken = null;

function storage() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export const tokenStore = {
  get() {
    const s = storage();
    if (s) {
      try {
        return s.getItem(KEY) || memoryToken;
      } catch {
        /* fall through */
      }
    }
    return memoryToken;
  },
  set(token) {
    memoryToken = token;
    const s = storage();
    if (s) {
      try {
        s.setItem(KEY, token);
      } catch {
        /* memory fallback already set */
      }
    }
  },
  clear() {
    memoryToken = null;
    const s = storage();
    if (s) {
      try {
        s.removeItem(KEY);
      } catch {
        /* ignore */
      }
    }
  },
};

# MY SAFETY — Frontend

React + Vite + React Router + Lucide icons. Plain CSS (no Tailwind), Inter font.
Talks only to the endpoints in your OpenAPI contract:
`POST /login`, `POST /users/`, `GET /users/`, `GET /users/users/me`, `GET /users/{id}`,
`GET|POST /posts/`, `GET|PUT|DELETE /posts/{id}`.

## Run it

```bash
npm install
cp .env.example .env        # then set VITE_API_BASE_URL to your FastAPI address
npm run dev                 # http://localhost:5173
npm run build && npm run preview   # production build
```

## 1. Add the Feyide House photo (required)

Copy your `IMG_1960.jpeg` to **`src/assets/feyide-house.jpeg`**.
The hero and the login/register side panel pick it up automatically (any of
jpeg/jpg/png/webp). Until it exists the hero shows a plain navy background and the
dev console warns you. To reframe the photo, change `--hero-position` at the top of
`src/index.css` (e.g. `center 25%`).

## 2. Backend CORS

The browser calls your API from `http://localhost:5173`, so FastAPI must allow that origin:

```python
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"],
                   allow_methods=["*"], allow_headers=["*"])
```

## Token storage trade-offs

The backend returns a bearer token in JSON, so the token must live in JavaScript-readable
storage. This app uses **sessionStorage** (per tab, cleared when the tab closes) rather than
localStorage, with an in-memory fallback. It is still readable by any script on the page, so an
XSS bug would expose it. The safer design is an **HttpOnly, Secure, SameSite cookie** set by
the backend — that needs a backend change and is not assumed. Swapping strategy only touches
`src/api/tokenStore.js` (plus sending `credentials: 'include'` in `src/api/client.js`).

## Where the unknowns are isolated

The OpenAPI file does not define post response bodies. All assumptions live in
`src/api/posts.js` (`unwrap`, `extractList`, `normalizePost`). It accepts a plain array or an
object wrapping the array (`posts`/`items`/`data`/`results`), and items that are flat or wrapped
as `{ "Post": {...} }`. Open `GET /posts/` in `/docs` and adjust that file if yours differs.
Duplicate-email handling shows the server's `detail` message (and treats HTTP 409 as "already exists");
no other status code is assumed.

## Structure

```
src/api        client (fetch, errors, bearer header, 401 hook), tokenStore, auth, users, posts
src/context    AuthContext (token, current user, session notice), ToastContext
src/routes     AppRoutes, ProtectedRoute (UX gate only — backend enforces access)
src/layouts    PublicLayout, DashboardLayout (sidebar + topbar)
src/pages      Landing, Login, Register, Dashboard, Posts, PostDetails, Profile, Users, UserDetails, NotFound
src/components Button, Input, Modal, ConfirmDialog, PostForm, PostCard, Navbar, Footer, …
```

## Behaviour notes

- `GET /posts/` and `GET /posts/{id}` are called **without** a token (not declared protected).
- Any protected request that gets 401 clears the session and returns to Login with a message; 403 shows "Access denied".
- Logout only clears client state (no logout endpoint exists in the spec).
- The "Accounts" page calls `GET /users/`; if your backend restricts it, you'll see the access-denied state.
- Dashboard counts (total / published / drafts) are computed from the posts the server returns.

## Verified

Against a local mock API: login and registration send exactly `{email, password}` as JSON; bearer
header present on protected calls and absent on public ones; PUT sends all three post fields;
204 DELETE handled; 401 triggers the central handler; 422 and network failures map to readable
messages; no endpoints outside the contract are called. The production build succeeds.

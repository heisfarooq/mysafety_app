from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.exceptions import HTTPException

from .database import engine, Base
from .Routers import post, users, auth, Oauth2

Base.metadata.create_all(bind=engine)

# ---- the API (your existing app, unchanged apart from the name) ----
api = FastAPI()

# Only needed if something on another origin calls the API directly
# (e.g. your old plain-HTML frontend). The React app uses the same origin.
api.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:7080"],
    allow_methods=["*"],
    allow_headers=["*"],
)

api.include_router(post.router)
api.include_router(users.router)
api.include_router(auth.router)
api.include_router(Oauth2.router)


# ---- serve the React build; unknown paths fall back to index.html ----
class SPAStaticFiles(StaticFiles):
    async def get_response(self, path, scope):
        try:
            return await super().get_response(path, scope)
        except HTTPException as ex:
            if ex.status_code == 404:
                return await super().get_response("index.html", scope)
            raise


DIST = Path(__file__).resolve().parent.parent / "frontend" / "dist"

# ---- the outer app that uvicorn runs ----
app = FastAPI()
app.mount("/api", api)                                           # first
if DIST.exists():
    app.mount("/", SPAStaticFiles(directory=DIST, html=True))    # last
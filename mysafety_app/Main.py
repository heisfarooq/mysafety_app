from fastapi import FastAPI,Depends,Response,HTTPException,status
from sqlalchemy.orm import Session
from .database import get_db,engine,Base
import psycopg2
from .Routers import post,users,auth,Oauth2

Base.metadata.create_all(bind = engine)


app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for local dev; tighten this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(post.router)
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(Oauth2.router)


from fastapi import FastAPI,Depends,Response,HTTPException,status
from sqlalchemy.orm import Session
from .database import get_db,engine,Base
import psycopg2
from .Routers import post,users,auth,Oauth2

Base.metadata.create_all(bind = engine)


app = FastAPI()

app.include_router(post.router)
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(Oauth2.router)


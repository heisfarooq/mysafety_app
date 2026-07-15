from pydantic import BaseModel,EmailStr
from datetime import datetime
from typing import Optional

class crt_post(BaseModel):
    title: str
    content:str
    published:bool

class crt_account(BaseModel):
    email:EmailStr
    password: str

# class userout(BaseModel):
#     email:EmailStr
#     id:int
#     created_at: datetime
#     class Config:
#         orm_mode = True

class userlogin(BaseModel):
    email:EmailStr
    password:str

class crt_account_response(BaseModel):
    email:EmailStr
    id:int
    time_created:datetime
    class Config:
        orm_mode = True
class Token(BaseModel):
    access_token:str
    token_type:str
class Tokendata(BaseModel):
    id:Optional[str]= None
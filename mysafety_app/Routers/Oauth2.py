from jose import JWTError, jwt
from datetime import datetime,timedelta,UTC
from fastapi import APIRouter
from ..config import settings

router = APIRouter(
    tags=(['Oauth2'])
)

SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACCESS_TOKEN_EXPIRE_MNUTES = settings.access_token_expire_minutes

def create_access_token(data:dict):
    token_payload = data.copy()
    expiry_time = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MNUTES)
    token_payload.update({"exp":expiry_time})
    encoded_jwt=jwt.encode(token_payload,SECRET_KEY,algorithm=ALGORITHM)
    return(encoded_jwt)


from jose import JWTError, jwt
from datetime import datetime,timedelta,UTC
from fastapi import APIRouter
from ..config import settings
from .. import schemas,database,models
from fastapi import Depends,HTTPException,status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from ..database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='login')

router = APIRouter(
    tags=(['Oauth2'])
)

SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACCESS_TOKEN_EXPIRE_MNUTES = settings.access_token_expire_minutes

def create_access_token(data:dict):
    token_payload = data.copy()
    expiry_time = datetime.now(UTC) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MNUTES)
    token_payload.update({"exp":expiry_time})
    encoded_jwt=jwt.encode(token_payload,SECRET_KEY,algorithm=ALGORITHM)
    return(encoded_jwt)
def verify_access_token(token:str,credentials_exception,db:Session):
    try:
        decoded_jwt = jwt.decode(token,SECRET_KEY,algorithms= [ALGORITHM])
        email:str = decoded_jwt.get("sub")
        user = db.query(models.Users).filter(models.Users.email==email).first()

        if user is None:
            raise credentials_exception
        token_data = schemas.Tokendata(email = email)
    except JWTError:
        raise credentials_exception
    return token_data
    
def login_as_user(token:str=Depends(oauth2_scheme),db:Session=Depends(database.get_db)):
    credentials_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                          detail=f"invalid credentials",
                                          headers={"www-Authenticate":"Bearer"})
    token_data = verify_access_token(token , credentials_exception,db)
    user = db.query(models.Users).filter(models.Users.email == token_data.email).first()
    return user

def require_admin(current_user = Depends(login_as_user)):
    if current_user.role != models.UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user
    
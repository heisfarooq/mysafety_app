from fastapi import APIRouter,Depends,status,HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import schemas,models,utils
from . import Oauth2

router = APIRouter(
    tags=(['Authentication'])
)

@router.post("/login")
def login(login_credentials:schemas.userlogin , db:Session = Depends(get_db)):
    user_account = db.query(models.Users).filter(models.Users.email==login_credentials.email).first()
    if not user_account:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail= "invalid login details")
    if not utils.verify(login_credentials.password,user_account.password):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="incorrect password")
    access_token = Oauth2.create_access_token(data = {"users_id":user_account.id})
    return{"access_token": access_token,"token_type":"bearer"}

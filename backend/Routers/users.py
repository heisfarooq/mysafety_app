from fastapi import APIRouter,Depends,Response,HTTPException,status
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models,schemas
from ..utils import password_context
from . import Oauth2


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/",status_code=status.HTTP_202_ACCEPTED,response_model=list[schemas.crt_account_response])
def Get_all_accounts(db:Session=Depends(get_db),current_user:str = Depends(Oauth2.require_admin)):
    all_accounts = db.query(models.Users).all()
    return(all_accounts)

@router.post("/", status_code = status.HTTP_201_CREATED,response_model = schemas.crt_account_response)
def Create_account(user_reg:schemas.crt_account, db:Session = Depends(get_db)):
    hashed_password = password_context.hash(user_reg.password)
    user_reg.password = hashed_password
    new_account = models.Users(**user_reg.model_dump())
    db.add(new_account)
    db.commit()
    db.refresh(new_account)
    return(new_account)

@router.get("/users/me", response_model=schemas.crt_account_response)
def get_me(current_user = Depends(Oauth2.login_as_user)):
    return current_user

@router.get("/{ID}",response_model=schemas.crt_account_response)
def Get_one_account(ID:int , db : Session = Depends(get_db),current_user:str = Depends(Oauth2.require_admin)):
    single_account = db.query(models.Users).filter(models.Users.id == ID).first()
    if not single_account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail='User with id {ID} not found')
    else:
        return(single_account)

# wherever your get_current_user dependency lives, e.g. Routers/Oauth2.py


from fastapi import FastAPI,Depends,HTTPException,status,APIRouter
from sqlalchemy.orm import Session 
from ..database import get_db
from .. import schemas , models
from . import Oauth2


router = APIRouter(
    prefix="/posts",
    tags = ['Posts'])

@router.get("/")
def Getall_post(db:Session = Depends(get_db)):
    All_post = db.query(models.Post).all()
    return(All_post)

@router.get("/{ID}")
def Getsngle_post(ID:int,db:Session = Depends(get_db)):
    single_post= db.query(models.Post).filter(models.Post.id==ID).first()
    if not single_post:
        raise HTTPException(status_code = status.HTTP_404_NOT_FOUND,detail=(f"post with id {ID} does not exist"))
    return(single_post)

@router.post('/')
def Create_post(post_input:schemas.crt_post,db:Session = Depends(get_db),login_current_user:int = Depends(Oauth2.login_as_user)):
    
    new_post = models.Post(**post_input.model_dump())
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return{"Message": "Post Created"}

@router.put('/{ID}')
def Update_post(ID:int,updt_post :schemas.crt_post,db:Session = Depends(get_db),login_current_user:int = Depends(Oauth2.login_as_user)):
    updated_post = db.query(models.Post).filter(models.Post.id==ID)
    if not updated_post.first():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail= 'Can only update an existing post')
    else:
        updated_post.update(updt_post.model_dump(),synchronize_session=False)

@router.delete('/{ID}')
def Delete_post(ID:int ,db:Session = Depends(get_db),current_user:str = Depends(Oauth2.require_admin)):
    deleted_post = db.query(models.Post).filter(models.Post.id==ID)
    if not deleted_post.first() :
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail=(f'post with number {ID} does not exist'))
    else:
        deleted_post.delete(synchronize_session=False)
        db.commit()
    return{"Message": "Post deleted"}

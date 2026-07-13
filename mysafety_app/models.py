from sqlalchemy import Column,String,Integer,Boolean,ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import text
from sqlalchemy.sql.sqltypes import TIMESTAMP
from .database import Base


class Post(Base):
    __tablename__="Post"
    id = Column(Integer,primary_key=True,nullable=False)
    title = Column(String,nullable=False)
    content = Column(String,nullable=False)
    time_created = Column(TIMESTAMP(timezone=True),server_default=text('now()'),nullable=False)
    published = Column(Boolean, server_default=text('True'),nullable=False)

class Users(Base):
    __tablename__ = "Users"
    id = Column(Integer, primary_key=True,nullable=False)
    email = Column(String,nullable=False,unique=True)
    password = Column(String, nullable= False)
    phone = Column(String)
    time_created = time_created = Column(TIMESTAMP(timezone=True),server_default=text('Now()'),nullable=False)
    

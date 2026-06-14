from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth
from routers.auth import get_db, get_current_user, get_current_admin
import secrets
import string

router = APIRouter()

@router.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=schemas.UserResponse)
def update_user_me(user_update: schemas.UserUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if user_update.name is not None:
        current_user.name = user_update.name
    if user_update.avatar_index is not None:
        current_user.avatar_index = user_update.avatar_index
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("", response_model=dict)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Auto-generate password
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    password = ''.join(secrets.choice(alphabet) for i in range(12))
    
    hashed_password = auth.get_password_hash(password)
    new_user = models.User(
        name=user.name,
        email=user.email,
        role=user.role,
        avatar_index=user.avatar_index,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"user": schemas.UserResponse.from_orm(new_user), "password": password}

@router.get("", response_model=List[schemas.UserResponse])
def get_all_users(db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    users = db.query(models.User).order_by(models.User.id.desc()).all()
    return users

@router.post("/{user_id}/reset-password", response_model=dict)
def reset_password(user_id: int, db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    new_password = ''.join(secrets.choice(alphabet) for i in range(12))
    
    user.hashed_password = auth.get_password_hash(new_password)
    db.commit()
    
    return {"detail": "Password reset successfully", "new_password": new_password}

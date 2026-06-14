from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from models import RoleEnum, ShiftTypeEnum, ActionEnum

class UserBase(BaseModel):
    name: str
    email: str
    role: RoleEnum = RoleEnum.member
    avatar_index: int = 1

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar_index: Optional[int] = None

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class ShiftBase(BaseModel):
    shift_type: ShiftTypeEnum
    date: date

class ShiftCreate(ShiftBase):
    pass

class ShiftAssignmentResponse(BaseModel):
    id: int
    user: UserResponse
    class Config:
        from_attributes = True

class ShiftResponse(ShiftBase):
    id: int
    assignments: List[ShiftAssignmentResponse] = []
    class Config:
        from_attributes = True

class ShiftLogResponse(BaseModel):
    id: int
    shift: Optional[ShiftResponse] = None
    user: Optional[UserResponse] = None
    action: ActionEnum
    performer: Optional[UserResponse] = None
    timestamp: datetime
    notes: Optional[str] = None
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

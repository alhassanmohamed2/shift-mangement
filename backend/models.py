from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey, Date, Text
from sqlalchemy.orm import relationship
import enum
from datetime import datetime, timezone
from database import Base

class RoleEnum(str, enum.Enum):
    admin = "admin"
    member = "member"

class ShiftTypeEnum(str, enum.Enum):
    morning = "morning"
    evening = "evening"
    night = "night"

class ActionEnum(str, enum.Enum):
    assigned = "assigned"
    removed = "removed"
    swapped = "swapped"

def get_utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.member, nullable=False)
    avatar_index = Column(Integer, default=1)
    created_at = Column(DateTime, default=get_utc_now)

class Shift(Base):
    __tablename__ = "shifts"
    id = Column(Integer, primary_key=True, index=True)
    shift_type = Column(Enum(ShiftTypeEnum), nullable=False)
    date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=get_utc_now)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now)
    
    assignments = relationship("ShiftAssignment", back_populates="shift", cascade="all, delete-orphan")

class ShiftAssignment(Base):
    __tablename__ = "shift_assignments"
    id = Column(Integer, primary_key=True, index=True)
    shift_id = Column(Integer, ForeignKey("shifts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    assigned_by = Column(Integer, ForeignKey("users.id"))
    assigned_at = Column(DateTime, default=get_utc_now)
    
    shift = relationship("Shift", back_populates="assignments")
    user = relationship("User", foreign_keys=[user_id])
    assigner = relationship("User", foreign_keys=[assigned_by])

class ShiftLog(Base):
    __tablename__ = "shift_logs"
    id = Column(Integer, primary_key=True, index=True)
    shift_id = Column(Integer, ForeignKey("shifts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    action = Column(Enum(ActionEnum), nullable=False)
    performed_by = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime, default=get_utc_now)
    notes = Column(Text, nullable=True)

    shift = relationship("Shift")
    user = relationship("User", foreign_keys=[user_id])
    performer = relationship("User", foreign_keys=[performed_by])

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
import models, schemas
from routers.auth import get_db, get_current_user

router = APIRouter()

@router.get("", response_model=dict)
def get_logs(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    shift_type: Optional[models.ShiftTypeEnum] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user)
):
    query = db.query(models.ShiftLog).join(models.Shift)
    
    if shift_type:
        query = query.filter(models.Shift.shift_type == shift_type)
    if date_from:
        query = query.filter(models.Shift.date >= date_from)
    if date_to:
        query = query.filter(models.Shift.date <= date_to)
        
    total = query.count()
    logs = query.order_by(models.ShiftLog.timestamp.desc()).offset((page - 1) * limit).limit(limit).all()
    
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "logs": [schemas.ShiftLogResponse.from_orm(log) for log in logs]
    }

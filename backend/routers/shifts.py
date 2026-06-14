from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date, timedelta
import models, schemas
from routers.auth import get_db, get_current_user, get_current_admin
from sqlalchemy import func

router = APIRouter()

def get_or_create_shift(db: Session, shift_type: models.ShiftTypeEnum, shift_date: date):
    shift = db.query(models.Shift).filter(
        models.Shift.shift_type == shift_type,
        models.Shift.date == shift_date
    ).first()
    if not shift:
        shift = models.Shift(shift_type=shift_type, date=shift_date)
        db.add(shift)
        db.commit()
        db.refresh(shift)
    return shift

@router.get("/current", response_model=List[schemas.ShiftResponse])
def get_current_shifts(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    today = date.today()
    shifts = []
    for stype in models.ShiftTypeEnum:
        shifts.append(get_or_create_shift(db, stype, today))
    return shifts

@router.get("/week", response_model=List[schemas.ShiftResponse])
def get_week_shifts(start: date, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    shifts = []
    for i in range(7):
        current_date = start + timedelta(days=i)
        for stype in models.ShiftTypeEnum:
            shifts.append(get_or_create_shift(db, stype, current_date))
    return shifts

@router.post("/{shift_id}/assign")
def assign_user(shift_id: int, user_id: int, db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    shift = db.query(models.Shift).filter(models.Shift.id == shift_id).first()
    if not shift:
        raise HTTPException(status_code=404, detail="Shift not found")
        
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    existing_assignment = db.query(models.ShiftAssignment).filter(
        models.ShiftAssignment.shift_id == shift_id,
        models.ShiftAssignment.user_id == user_id
    ).first()
    if existing_assignment:
        raise HTTPException(status_code=400, detail="User already assigned to this shift")
        
    count = db.query(models.ShiftAssignment).filter(models.ShiftAssignment.shift_id == shift_id).count()
    if count >= 3:
        raise HTTPException(status_code=400, detail="Shift already has maximum members (3)")

    assignment = models.ShiftAssignment(shift_id=shift_id, user_id=user_id, assigned_by=admin.id)
    db.add(assignment)
    
    log = models.ShiftLog(shift_id=shift_id, user_id=user_id, action=models.ActionEnum.assigned, performed_by=admin.id)
    db.add(log)
    
    db.commit()
    return {"status": "success"}

@router.delete("/{shift_id}/assign/{user_id}")
def remove_user(shift_id: int, user_id: int, db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    assignment = db.query(models.ShiftAssignment).filter(
        models.ShiftAssignment.shift_id == shift_id,
        models.ShiftAssignment.user_id == user_id
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
        
    db.delete(assignment)
    
    log = models.ShiftLog(shift_id=shift_id, user_id=user_id, action=models.ActionEnum.removed, performed_by=admin.id)
    db.add(log)
    
    db.commit()
    return {"status": "success"}

@router.post("/auto-assign")
def auto_assign(start_date: date, db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    # Get all members
    members = db.query(models.User).filter(models.User.role == models.RoleEnum.member).all()
    if len(members) < 2:
        raise HTTPException(status_code=400, detail="Not enough members to assign shifts. Minimum 2 needed.")
    
    # 1. Gather historical preferences based on assignments
    member_preferences = {}
    for m in members:
        assignments = db.query(models.ShiftAssignment).filter(models.ShiftAssignment.user_id == m.id).all()
        counts = {models.ShiftTypeEnum.morning: 0, models.ShiftTypeEnum.evening: 0, models.ShiftTypeEnum.night: 0}
        for a in assignments:
            shift = db.query(models.Shift).filter(models.Shift.id == a.shift_id).first()
            if shift:
                counts[shift.shift_type] += 1
        best_shift = max(counts, key=counts.get)
        member_preferences[m.id] = best_shift if counts[best_shift] > 0 else models.ShiftTypeEnum.morning
    
    shifts_this_week = {m.id: 0 for m in members}
    last_shift_date = {m.id: None for m in members}
    last_shift_type = {m.id: None for m in members}

    for i in range(7):
        current_date = start_date + timedelta(days=i)
        
        for stype in [models.ShiftTypeEnum.morning, models.ShiftTypeEnum.evening, models.ShiftTypeEnum.night]:
            shift = get_or_create_shift(db, stype, current_date)
            
            current_count = db.query(models.ShiftAssignment).filter(models.ShiftAssignment.shift_id == shift.id).count()
            if stype == models.ShiftTypeEnum.evening:
                target_count = 3
            elif stype == models.ShiftTypeEnum.night:
                target_count = 1
            else:
                target_count = 2
                
            needed = target_count - current_count
            if needed <= 0:
                continue
                
            available = []
            for m in members:
                if shifts_this_week[m.id] >= 5:
                    continue
                if last_shift_date[m.id] == current_date:
                    continue
                if stype == models.ShiftTypeEnum.morning and last_shift_date[m.id] == current_date - timedelta(days=1) and last_shift_type[m.id] == models.ShiftTypeEnum.night:
                    continue
                already = db.query(models.ShiftAssignment).filter(
                    models.ShiftAssignment.shift_id == shift.id,
                    models.ShiftAssignment.user_id == m.id
                ).first()
                if already:
                    continue
                available.append(m)
            
            available.sort(key=lambda m: (member_preferences[m.id] != stype, shifts_this_week[m.id]))
            
            for m in available[:needed]:
                assignment = models.ShiftAssignment(shift_id=shift.id, user_id=m.id, assigned_by=admin.id)
                db.add(assignment)
                log = models.ShiftLog(shift_id=shift.id, user_id=m.id, action=models.ActionEnum.assigned, performed_by=admin.id, notes="Auto-assigned")
                db.add(log)
                shifts_this_week[m.id] += 1
                last_shift_date[m.id] = current_date
                last_shift_type[m.id] = stype
                
    db.commit()
    return {"status": "success", "message": "Week auto-assigned successfully"}

@router.delete("/clear-week")
def clear_week(start_date: date, db: Session = Depends(get_db), admin: models.User = Depends(get_current_admin)):
    for i in range(7):
        current_date = start_date + timedelta(days=i)
        for stype in models.ShiftTypeEnum:
            shift = db.query(models.Shift).filter(models.Shift.shift_type == stype, models.Shift.date == current_date).first()
            if shift:
                db.query(models.ShiftAssignment).filter(models.ShiftAssignment.shift_id == shift.id).delete()
    db.commit()
    return {"status": "success"}

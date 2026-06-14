import os
from database import SessionLocal
import models
from auth import get_password_hash
from datetime import date, timedelta
import random

def populate():
    db = SessionLocal()
    
    admin = db.query(models.User).filter(models.User.role == models.RoleEnum.admin).first()
    if not admin:
        print("Admin user not found. Run seed first.")
        return
        
    names = [
        "Alice Smith", "Bob Johnson", "Charlie Brown", "Diana Prince", "Eve Adams",
        "Frank Castle", "Grace Hopper", "Hank Pym", "Ivy Pepper", "Jack Sparrow"
    ]
    
    members = []
    
    for i, name in enumerate(names):
        email = f"{name.split()[0].lower()}@example.com"
        user = db.query(models.User).filter(models.User.email == email).first()
        if not user:
            user = models.User(
                name=name,
                email=email,
                hashed_password=get_password_hash("password123"),
                role=models.RoleEnum.member,
                avatar_index=(i % 8) + 1
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        members.append(user)
        
    today = date.today()
    start_date = today - timedelta(days=today.weekday()) 
    
    for i in range(7):
        current_date = start_date + timedelta(days=i)
        
        # Keep track of assigned members today to avoid double booking
        assigned_today = set()
        
        for stype in [models.ShiftTypeEnum.morning, models.ShiftTypeEnum.evening, models.ShiftTypeEnum.night]:
            shift = db.query(models.Shift).filter(
                models.Shift.shift_type == stype,
                models.Shift.date == current_date
            ).first()
            if not shift:
                shift = models.Shift(shift_type=stype, date=current_date)
                db.add(shift)
                db.commit()
                db.refresh(shift)
                
            current_count = db.query(models.ShiftAssignment).filter(models.ShiftAssignment.shift_id == shift.id).count()
            needed = 2 - current_count
            
            if needed > 0:
                available = [m for m in members if m.id not in assigned_today]
                # If we don't have enough available, just pick any to satisfy the script
                if len(available) < needed:
                    available = members
                    
                selected = random.sample(available, needed)
                for m in selected:
                    exists = db.query(models.ShiftAssignment).filter(
                        models.ShiftAssignment.shift_id == shift.id,
                        models.ShiftAssignment.user_id == m.id
                    ).first()
                    if not exists:
                        assignment = models.ShiftAssignment(shift_id=shift.id, user_id=m.id, assigned_by=admin.id)
                        db.add(assignment)
                        log = models.ShiftLog(shift_id=shift.id, user_id=m.id, action=models.ActionEnum.assigned, performed_by=admin.id, notes="Auto populated")
                        db.add(log)
                        assigned_today.add(m.id)
    
    db.commit()
    print("Successfully populated 10 members and assigned shifts for the current week.")

if __name__ == "__main__":
    populate()

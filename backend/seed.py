import os
from database import SessionLocal, engine
import models
from auth import get_password_hash

def seed():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        admin_email = os.getenv("ADMIN_USER", "admin")
        admin_password = os.getenv("ADMIN_PASSWORD", "admin")
        admin = db.query(models.User).filter(models.User.email == admin_email).first()
        if not admin:
            admin = models.User(
                name="Admin User",
                email=admin_email,
                hashed_password=get_password_hash(admin_password),
                role=models.RoleEnum.admin,
                avatar_index=1
            )
            db.add(admin)
            db.commit()
            print("Admin account created.")
        else:
            print("Admin account already exists.")
    finally:
        db.close()

if __name__ == "__main__":
    seed()

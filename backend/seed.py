from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
from models import User
from auth import get_password_hash

def seed_db():
    print("Initializing database...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if we already have users
    if db.query(User).first():
        print("Database already seeded.")
        db.close()
        return

    print("Seeding test users...")
    
    users_to_create = [
        {"username": "admin", "password": "password123", "role": "ADMIN", "is_active": True},
        {"username": "hr_manager", "password": "password123", "role": "HR_MANAGER", "is_active": True},
        {"username": "finance_manager", "password": "password123", "role": "FINANCE_MANAGER", "is_active": True},
        {"username": "security_analyst", "password": "password123", "role": "SECURITY_ANALYST", "is_active": True},
        {"username": "employee01", "password": "password123", "role": "EMPLOYEE", "is_active": True},
        {"username": "guest01", "password": "password123", "role": "GUEST", "is_active": True},
        {"username": "disabled_user", "password": "password123", "role": "EMPLOYEE", "is_active": False}
    ]

    for user_data in users_to_create:
        new_user = User(
            username=user_data["username"],
            hashed_password=get_password_hash(user_data["password"]),
            role=user_data["role"],
            is_active=user_data["is_active"]
        )
        db.add(new_user)
    
    db.commit()
    print("Database seeding complete!")
    db.close()

if __name__ == "__main__":
    seed_db()

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

from main import app
from database import Base, get_db
from models import User
from auth import get_password_hash

# Use an in-memory SQLite database for tests
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

from sqlalchemy.pool import StaticPool
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def db_session():
    # Create the database and tables
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    # Seed test users
    users = [
        User(username="admin_test", hashed_password=get_password_hash("pass123"), role="ADMIN", is_active=True),
        User(username="disabled_test", hashed_password=get_password_hash("pass123"), role="EMPLOYEE", is_active=False),
        User(
            username="mfa_user", 
            hashed_password=get_password_hash("pass123"), 
            role="EMPLOYEE", 
            is_active=True, 
            mfa_enabled=True, 
            mfa_secret="JBSWY3DPEHPK3PXP" # valid base32 secret
        ),
        User(username="admin", hashed_password=get_password_hash("password123"), role="ADMIN", is_active=True, mfa_enabled=True, mfa_secret="JBSWY3DPEHPK3PXP"),
        User(username="hr_manager", hashed_password=get_password_hash("password123"), role="HR_MANAGER", is_active=True),
        User(username="finance_manager", hashed_password=get_password_hash("password123"), role="FINANCE_MANAGER", is_active=True, mfa_enabled=True, mfa_secret="JBSWY3DPEHPK3PXP"),
        User(username="employee01", hashed_password=get_password_hash("password123"), role="EMPLOYEE", is_active=True)
    ]
    db.add_all(users)
    db.commit()
    
    yield db
    
    # Teardown
    db.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="module")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
            
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c

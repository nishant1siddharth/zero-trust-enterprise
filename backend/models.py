from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, nullable=False, default="GUEST")
    is_active = Column(Boolean, default=True)
    
    # MFA fields (To be utilized in Phase 4)
    mfa_enabled = Column(Boolean, default=False)
    mfa_secret = Column(String, nullable=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(String, nullable=False) # Store ISO format string for simplicity
    user_id = Column(String, nullable=True)
    role = Column(String, nullable=True)
    action = Column(String, nullable=False)
    resource = Column(String, nullable=False)
    decision = Column(String, nullable=False) # ALLOW / DENY
    reason = Column(String, nullable=True)

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from models import User, AuditLog
from database import get_db
from pep import enforce_policy

router = APIRouter(
    prefix="/audit",
    tags=["Security Monitoring & Audit"]
)

@router.get("/logs")
def get_audit_logs(limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(enforce_policy)):
    """Returns the most recent audit logs. Protected by Policy Engine (Security Analyst role)."""
    logs = db.query(AuditLog).order_by(AuditLog.id.desc()).limit(limit).all()
    return logs

@router.get("/stats")
def get_security_stats(db: Session = Depends(get_db), current_user: User = Depends(enforce_policy)):
    """Returns aggregated security statistics for the dashboard."""
    total_requests = db.query(func.count(AuditLog.id)).scalar()
    allowed = db.query(func.count(AuditLog.id)).filter(AuditLog.decision == "ALLOW").scalar()
    denied = db.query(func.count(AuditLog.id)).filter(AuditLog.decision == "DENY").scalar()
    
    # Analyze suspicious events (e.g., failed logins or brute force attempts)
    failed_logins = db.query(func.count(AuditLog.id)).filter(
        AuditLog.action == "LOGIN", 
        AuditLog.decision == "DENY"
    ).scalar()
    
    return {
        "total_requests": total_requests,
        "allowed_requests": allowed,
        "denied_requests": denied,
        "failed_logins": failed_logins
    }

@router.get("/public-stats")
def get_public_security_stats(db: Session = Depends(get_db)):
    """Returns aggregated security statistics for the public landing page (unauthenticated)."""
    total_requests = db.query(func.count(AuditLog.id)).scalar()
    allowed = db.query(func.count(AuditLog.id)).filter(AuditLog.decision == "ALLOW").scalar()
    denied = db.query(func.count(AuditLog.id)).filter(AuditLog.decision == "DENY").scalar()
    
    failed_logins = db.query(func.count(AuditLog.id)).filter(
        AuditLog.action == "LOGIN", 
        AuditLog.decision == "DENY"
    ).scalar()
    
    return {
        "total_requests": total_requests,
        "allowed_requests": allowed,
        "denied_requests": denied,
        "failed_logins": failed_logins
    }

from datetime import datetime
from sqlalchemy.orm import Session
from models import AuditLog
from database import SessionLocal
import logging

logger = logging.getLogger("ZeroTrustAudit")
logger.setLevel(logging.INFO)

def log_audit_event(user_id: str, role: str, action: str, resource: str, decision: str, reason: str):
    """
    Log an event to the database and standard out.
    Uses a fresh DB session since it might be called from outside normal request lifecycle (e.g. auth failures).
    """
    timestamp = datetime.utcnow().isoformat() + "Z"
    
    log_msg = f"[AUDIT] {timestamp} User={user_id} Role={role} Action={action} Resource={resource} Decision={decision} Reason='{reason}'"
    if decision == "DENY":
        logger.warning(log_msg)
    else:
        logger.info(log_msg)
        
    db = SessionLocal()
    try:
        new_log = AuditLog(
            timestamp=timestamp,
            user_id=user_id,
            role=role,
            action=action,
            resource=resource,
            decision=decision,
            reason=reason
        )
        db.add(new_log)
        db.commit()
    except Exception as e:
        logger.error(f"Failed to write audit log to database: {str(e)}")
    finally:
        db.close()

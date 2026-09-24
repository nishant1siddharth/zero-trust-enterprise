from fastapi import Depends, HTTPException, status, Request
from dependencies import get_current_active_user
from models import User
from policy_engine import policy_engine
from audit_logger import log_audit_event

def enforce_policy(request: Request, current_user: User = Depends(get_current_active_user)):
    """
    Policy Enforcement Point (PEP) Dependency
    Intercepts the request, extracts context, queries the PDP, and logs the decision.
    """
    resource = request.url.path
    action = request.method
    
    # Exclude auth routes from strict policy engine checks since they are handled natively
    if resource.startswith("/auth/"):
        return current_user

    # Query the Policy Decision Point (PDP)
    decision_obj = policy_engine.evaluate(
        user_role=current_user.role,
        resource=resource,
        action=action,
        mfa_enabled=current_user.mfa_enabled
    )
    
    decision = decision_obj["decision"]
    reason = decision_obj["reason"]
    
    # Audit Logging (Phase 9)
    log_audit_event(
        user_id=current_user.username,
        role=current_user.role,
        action=action,
        resource=resource,
        decision=decision,
        reason=reason
    )
    
    if decision == "ALLOW":
        return current_user
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Zero Trust Policy Denied: {reason}"
        )

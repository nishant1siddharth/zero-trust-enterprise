from fastapi import APIRouter, Depends
from models import User
from pep import enforce_policy
from policy_engine import policy_engine

router = APIRouter(
    prefix="/admin",
    tags=["System Administration"]
)

@router.get("/system")
def get_system_status(current_user: User = Depends(enforce_policy)):
    return {"message": "System Administration Access Granted", "status": "All systems operational"}

@router.get("/iam-policies")
def get_iam_policies(current_user: User = Depends(enforce_policy)):
    return {"policies": policy_engine.policies}

@router.post("/restart")
def restart_services(current_user: User = Depends(enforce_policy)):
    return {"message": "System services restarted successfully."}

@router.post("/lockdown")
def emergency_lockdown(current_user: User = Depends(enforce_policy)):
    return {"message": "Emergency Lockdown initiated. All non-admin sessions terminated."}

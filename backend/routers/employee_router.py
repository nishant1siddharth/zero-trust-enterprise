from fastapi import APIRouter, Depends
from models import User
from pep import enforce_policy

router = APIRouter(
    prefix="/employee",
    tags=["Employee Portal"]
)

@router.get("/portal")
def get_employee_portal(current_user: User = Depends(enforce_policy)):
    return {"message": f"Welcome to the Employee Portal, {current_user.username}", "data": "General employee announcements"}

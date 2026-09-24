from fastapi import APIRouter, Depends
from models import User
from pep import enforce_policy

router = APIRouter(
    prefix="/hr",
    tags=["HR Management"]
)

@router.get("/data")
def get_hr_data(current_user: User = Depends(enforce_policy)):
    return {"message": "HR Data Access Granted", "salaries": "Confidential"}

@router.post("/promote")
def promote_employee(current_user: User = Depends(enforce_policy)):
    return {"message": "Employee promoted successfully"}

@router.post("/data")
def add_employee(current_user: User = Depends(enforce_policy)):
    return {"message": "New employee record securely added."}

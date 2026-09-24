from fastapi import APIRouter, Depends
from models import User
from pep import enforce_policy

router = APIRouter(
    prefix="/finance",
    tags=["Finance Management"]
)

@router.get("/reports")
def get_financial_reports(current_user: User = Depends(enforce_policy)):
    return {"message": "Finance Reports Access Granted", "Q3_Revenue": "$1,000,000"}

@router.post("/transfer")
def transfer_funds(current_user: User = Depends(enforce_policy)):
    return {"message": "Funds transferred successfully"}

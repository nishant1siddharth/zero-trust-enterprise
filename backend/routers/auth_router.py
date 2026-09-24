from datetime import timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Form
from sqlalchemy.orm import Session
import pyotp

import models
import schemas
import auth
from database import get_db
from dependencies import get_current_user

from audit_logger import log_audit_event

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        username=user.username,
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    log_audit_event(user.username, user.role, "REGISTER", "/auth/register", "ALLOW", "User registration successful")
    return new_user

@router.post("/login", response_model=schemas.Token)
def login_for_access_token(
    username: str = Form(...),
    password: str = Form(...),
    totp_code: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user or not auth.verify_password(password, user.hashed_password):
        log_audit_event(username, "UNKNOWN", "LOGIN", "/auth/login", "DENY", "Incorrect username or password")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        log_audit_event(username, user.role, "LOGIN", "/auth/login", "DENY", "Inactive user account")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")

    # MFA Verification
    if user.mfa_enabled:
        if not totp_code:
            log_audit_event(username, user.role, "LOGIN_MFA", "/auth/login", "DENY", "MFA challenge required but missing")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="MFA challenge required"
            )
        totp = pyotp.TOTP(user.mfa_secret)
        # Allow '000000' as a master demo code, otherwise check real TOTP
        if totp_code != "000000" and not totp.verify(totp_code):
            log_audit_event(username, user.role, "LOGIN_MFA", "/auth/login", "DENY", "Invalid MFA code provided")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid MFA code"
            )

    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # Policy engine will verify role continuously.
    access_token = auth.create_access_token(
        data={"sub": user.username, "role": user.role, "mfa": user.mfa_enabled}, 
        expires_delta=access_token_expires
    )
    
    log_audit_event(username, user.role, "LOGIN", "/auth/login", "ALLOW", "Successful authentication")
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/mfa/setup", response_model=schemas.MFASetupResponse)
def setup_mfa(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.mfa_enabled:
        raise HTTPException(status_code=400, detail="MFA already enabled")
    
    secret = pyotp.random_base32()
    current_user.mfa_secret = secret
    db.commit()
    
    # Generate provisioning URI for Google Authenticator / Authy
    totp_uri = pyotp.totp.TOTP(secret).provisioning_uri(
        name=current_user.username, 
        issuer_name="Zero Trust Enterprise"
    )
    
    return {"secret": secret, "qr_code_url": totp_uri}

@router.post("/mfa/enable")
def enable_mfa(request: schemas.MFAVerifyRequest, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.mfa_enabled:
        raise HTTPException(status_code=400, detail="MFA already enabled")
        
    if not current_user.mfa_secret:
        raise HTTPException(status_code=400, detail="MFA setup not initiated")
        
    totp = pyotp.TOTP(current_user.mfa_secret)
    if request.totp_code != "000000" and not totp.verify(request.totp_code):
        raise HTTPException(status_code=400, detail="Invalid MFA code")
        
    current_user.mfa_enabled = True
    db.commit()
    
    return {"message": "MFA enabled successfully"}

@router.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    """Return information about the currently authenticated user"""
    return current_user

from pydantic import BaseModel
from typing import Optional

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "GUEST"

class UserLogin(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    is_active: bool
    mfa_enabled: bool

    class Config:
        from_attributes = True

# MFA Schemas
class MFASetupResponse(BaseModel):
    secret: str
    qr_code_url: str

class MFAVerifyRequest(BaseModel):
    totp_code: str

class LoginRequest(BaseModel):
    username: str
    password: str
    totp_code: Optional[str] = None

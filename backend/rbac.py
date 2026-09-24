from enum import Enum
from typing import List, Callable
from fastapi import Depends, HTTPException, status

from models import User
from dependencies import get_current_active_user

class Permission(str, Enum):
    VIEW_EMPLOYEE_DATA = "VIEW_EMPLOYEE_DATA"
    MANAGE_EMPLOYEE_DATA = "MANAGE_EMPLOYEE_DATA"
    VIEW_HR_DATA = "VIEW_HR_DATA"
    MANAGE_HR_DATA = "MANAGE_HR_DATA"
    VIEW_FINANCE_DATA = "VIEW_FINANCE_DATA"
    MANAGE_FINANCE_DATA = "MANAGE_FINANCE_DATA"
    VIEW_SECURITY_LOGS = "VIEW_SECURITY_LOGS"
    MANAGE_USERS = "MANAGE_USERS"
    SYSTEM_ADMIN = "SYSTEM_ADMIN"

class Role(str, Enum):
    ADMIN = "ADMIN"
    HR_MANAGER = "HR_MANAGER"
    FINANCE_MANAGER = "FINANCE_MANAGER"
    SECURITY_ANALYST = "SECURITY_ANALYST"
    EMPLOYEE = "EMPLOYEE"
    GUEST = "GUEST"

# Authorization Matrix
ROLE_PERMISSIONS = {
    Role.ADMIN: [p for p in Permission], # Admin has all permissions
    Role.HR_MANAGER: [
        Permission.VIEW_EMPLOYEE_DATA, 
        Permission.MANAGE_EMPLOYEE_DATA, 
        Permission.VIEW_HR_DATA, 
        Permission.MANAGE_HR_DATA
    ],
    Role.FINANCE_MANAGER: [
        Permission.VIEW_EMPLOYEE_DATA,
        Permission.VIEW_FINANCE_DATA,
        Permission.MANAGE_FINANCE_DATA
    ],
    Role.SECURITY_ANALYST: [
        Permission.VIEW_EMPLOYEE_DATA,
        Permission.VIEW_SECURITY_LOGS
    ],
    Role.EMPLOYEE: [
        Permission.VIEW_EMPLOYEE_DATA
    ],
    Role.GUEST: []
}

def require_permissions(required_permissions: List[Permission]) -> Callable:
    def permission_dependency(current_user: User = Depends(get_current_active_user)):
        user_role = Role(current_user.role)
        user_permissions = ROLE_PERMISSIONS.get(user_role, [])
        
        for req_perm in required_permissions:
            if req_perm not in user_permissions:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Operation not permitted. Required permission: {req_perm.value}"
                )
        return current_user
    return permission_dependency
